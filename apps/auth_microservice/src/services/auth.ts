import type { User } from "@prisma/client";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import ms, { type StringValue } from "ms";
import { v4 as uuidv4 } from "uuid";
import config from "../config/config.js";
import { prismaClient } from "../data/prismaClient.js";
import {
  type JwtPayload as AuthJwtPayload,
  RedisAuthRepository,
} from "../data/redisRepository.js";
import type { LoginDto } from "../dto/loginDto.ts";
import { SignupDto } from "../dto/signUpDto.js";

const googleClient = new OAuth2Client(
  config.googleClientId,
  config.googleClientSecret,
  config.googleRedirectUri,
);

export class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const redisAuthRepository = new RedisAuthRepository();

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

const normalizeExpiry = (expiry?: string | number) => {
  if (!expiry) return undefined;
  if (typeof expiry === "string" && !isNaN(Number(expiry))) {
    return Number(expiry);
  }
  return expiry;
};

const generateToken = (user: User & { profile?: { id: string } | null }) => {
  const accessSignOptions: SignOptions = {};

  if (config.jwtExpiresIn) {
    accessSignOptions.expiresIn = config.jwtExpiresIn as Exclude<
      SignOptions["expiresIn"],
      undefined
    >;
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      profileId: user.profile?.id,
      role: user.role,
    },
    config.jwtSecret,
    accessSignOptions,
  );

  const refreshSignOptions: SignOptions = {};

  if (config.jwtRefreshExpiresIn) {
    refreshSignOptions.expiresIn = normalizeExpiry(
      config.jwtRefreshExpiresIn,
    ) as Exclude<SignOptions["expiresIn"], undefined>;
  }
  const refreshTokenId = uuidv4();

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      profileId: user.profile?.id,
      role: user.role,
      jwtId: refreshTokenId,
    },
    config.jwtRefreshSecret,
    refreshSignOptions,
  );

  return { accessToken, refreshToken, refreshTokenId };
};

const getRedisExpirySeconds = (expiry?: string | number) => {
  if (!expiry) return 0;
  if (typeof expiry === "string" && !isNaN(Number(expiry))) {
    return Number(expiry); // Already in seconds
  }
  return ms(expiry as StringValue) / 1000;
};

export const registerUser = async (registerUserDto: SignupDto) => {
  const account = await prismaClient.account.findUnique({
    where: {
      email: registerUserDto.email,
    },
  });
  const profile = await prismaClient.profile.findUnique({
    where: {
      username: registerUserDto.username,
    },
  });

  if (account) {
    throw new HttpError("Account with that email already exists", 409);
  }
  if (profile) {
    throw new HttpError("Profile with that name already exists", 409);
  }

  const hashedPassword = await hashPassword(registerUserDto.password);

  const user = await prismaClient.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const userId = uuidv4();

      return tx.user.create({
        data: {
          id: userId,
          createdById: userId,
          account: {
            create: {
              email: registerUserDto.email,
              passwordHash: hashedPassword,
              providerId: "local",
              lastLoginAt: new Date(),
              createdById: userId,
              updatedById: userId,
            },
          },
          profile: {
            create: {
              username: registerUserDto.username,
              displayName: registerUserDto.username,
              birthday: registerUserDto.birthday,
              bio: registerUserDto.bio,
              createdById: userId,
            },
          },
        },
        include: {
          account: true,
          profile: true,
        },
      });
    },
  );

  const redisExpirySeconds = getRedisExpirySeconds(config.jwtRefreshExpiresIn);
  const tokens = generateToken(user);
  await redisAuthRepository.storeRefreshTokenId(
    user.id,
    user.account?.id || "",
    tokens.refreshTokenId,
    registerUserDto.ipAddress,
    registerUserDto.userAgent,
    redisExpirySeconds,
  );

  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
};

export const authenticateUser = async (loginDto: LoginDto) => {
  const account = await prismaClient.account.findUnique({
    where: {
      email: loginDto.email,
    },
  });

  if (!account) {
    throw new HttpError("User not found", 404);
  }
  const isPasswordValid = await bcrypt.compare(
    loginDto.password,
    account.passwordHash,
  );

  if (!isPasswordValid) {
    throw new HttpError("Invalid password", 401);
  }

  const user = await prismaClient.user.findUnique({
    where: { id: account.userId },
    include: { profile: true },
  });
  if (!user) {
    throw new HttpError("User record missing", 404);
  }

  if (!user.profile) {
    const username = account.email.split("@")[0] || "user";
    const profile = await prismaClient.profile.create({
      data: {
        username: username,
        displayName: username,
        birthday: new Date(Date.now()),
        bio: "",
        userId: user.id,
        createdById: user.id,
      },
    });
    user.profile = profile;
  }

  const tokens = generateToken(user);

  const redisExpirySeconds = getRedisExpirySeconds(config.jwtRefreshExpiresIn);
  await redisAuthRepository.storeRefreshTokenId(
    account.userId,
    account.id,
    tokens.refreshTokenId,
    loginDto.ipAddress,
    loginDto.userAgent,
    redisExpirySeconds,
  );

  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
};

export const processRefreshtoken = async (
  refreshToken: string,
  ipAddress: string,
  userAgent: string,
) => {
  const decoded = jwt.verify(
    refreshToken,
    config.jwtRefreshSecret,
  ) as JwtPayload;

  if (!decoded.jwtId || !decoded.userId) {
    throw new HttpError("Invalid token payload", 401);
  }

  const session = await redisAuthRepository.findSessionByTokenId(decoded.jwtId);
  if (!session) {
    throw new HttpError("Session not found", 401);
  }
  const user = await prismaClient.user.findUnique({
    where: { id: decoded.userId },
    include: {
      account: true,
      profile: true,
    },
  });
  if (!user) {
    throw new HttpError("User not found", 404);
  }
  const isBlacklisted = await redisAuthRepository.isTokenBlacklisted({
    jwtId: decoded.jwtId,
    userId: decoded.userId,
    exp: decoded.exp || 0,
  });
  if (isBlacklisted) {
    throw new HttpError("Token has been revoked", 401);
  }

  if (!user.profile) {
    const username = user.account?.email.split("@")[0] || "user_" + user.id.slice(0, 8);
    const profile = await prismaClient.profile.create({
      data: {
        username: username,
        displayName: username,
        birthday: new Date(Date.now()),
        bio: "",
        userId: user.id,
        createdById: user.id,
      },
    });
    user.profile = profile;
  }

  const tokens = generateToken(user);
  const redisExpirySeconds = getRedisExpirySeconds(config.jwtRefreshExpiresIn);
  await redisAuthRepository.storeRefreshTokenId(
    user.id,
    user.account?.id || "",
    tokens.refreshTokenId,
    ipAddress,
    userAgent,
    redisExpirySeconds,
  );

  return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
};

export const exchangeCodeForToken = async (
  code: string,
  ipAddress: string,
  userAgent: string,
) => {
  const { tokens: googleTokens } = await googleClient.getToken(code);

  if (!googleTokens.id_token) {
    throw new HttpError("Failed to receive ID token from Google", 401);
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: googleTokens.id_token,
    audience: config.googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new HttpError("Invalid Google ID token payload", 401);
  }

  let account = await prismaClient.account.findUnique({
    where: { email: payload.email },
  });

  let user;
  if (!account) {
    const baseUsername =
      payload.name?.replace(/\s+/g, "").toLowerCase() ||
      payload.email.split("@")[0] ||
      "";
    user = await prismaClient.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const userId = uuidv4();

        return tx.user.create({
          data: {
            id: userId,
            createdById: userId,
            account: {
              create: {
                email: payload.email!,
                passwordHash: "",
                providerId: "google",
                lastLoginAt: new Date(),
                createdById: userId,
                updatedById: userId,
              },
            },
            profile: {
              create: {
                username: baseUsername,
                displayName: payload.name || baseUsername,
                birthday: new Date(Date.now()),
                bio: "",
                createdById: userId,
              },
            },
          },
          include: {
            account: true,
            profile: true,
          },
        });
      },
    );
    account = user.account;
  } else {
    user = await prismaClient.user.findUnique({
      where: { id: account.userId },
      include: {
        account: true,
        profile: true,
      },
    });

    if (user && !user.profile) {
      const baseUsername =
        payload.name?.replace(/\s+/g, "").toLowerCase() ||
        payload.email.split("@")[0] ||
        "";
      const profile = await prismaClient.profile.create({
        data: {
          username: baseUsername,
          displayName: payload.name || baseUsername,
          birthday: new Date(Date.now()),
          bio: "",
          userId: user.id,
          createdById: user.id,
        },
      });
      user.profile = profile;
    }
  }

  if (!user) {
    throw new HttpError("User record missing", 404);
  }

  const appTokens = generateToken(user);
  const redisExpirySeconds = getRedisExpirySeconds(config.jwtRefreshExpiresIn);

  await redisAuthRepository.storeRefreshTokenId(
    user.id,
    account?.id || "",
    appTokens.refreshTokenId,
    ipAddress,
    userAgent,
    redisExpirySeconds,
  );

  return {
    accessToken: appTokens.accessToken,
    refreshToken: appTokens.refreshToken,
  };
};

export const validateToken = async (accessToken: string) => {
  try {
    const decoded = jwt.verify(accessToken, config.jwtSecret) as JwtPayload;

    if (decoded.jwtId) {
      const isBlacklisted = await redisAuthRepository.isTokenBlacklisted({
        jwtId: decoded.jwtId,
        userId: decoded.userId,
        exp: decoded.exp || 0,
      });

      if (isBlacklisted) {
        throw new HttpError("Token has been revoked", 401);
      }
    }
    const returnPayload = {
      isValid: true,
      tokenPayload: decoded,
    };
    return returnPayload;
  } catch (error) {
    console.error("JWT Verification failed in auth_microservice:", error);
    throw error;
  }
};

export const handleLogout = async (refreshToken: string) => {
  const decoded = jwt.verify(
    refreshToken,
    config.jwtRefreshSecret,
  ) as JwtPayload;

  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  const remainingSeconds = (decoded.exp as number) - currentTimeInSeconds;

  if (remainingSeconds > 0) {
    const tokenToBlacklist: AuthJwtPayload = {
      jwtId: decoded.jwtId as string,
      userId: decoded.userId as string,
      exp: decoded.exp as number,
    };
    await redisAuthRepository.blacklistToken(
      tokenToBlacklist,
      remainingSeconds,
    );
  }

  await redisAuthRepository.deleteSessionByRefreshTokenId(
    decoded.jwtId as string,
  );
};

export const revokeAllUserSessions = async (userId: string) => {
  await redisAuthRepository.deleteAllSessionsByUserId(userId);
  return { success: true };
};
