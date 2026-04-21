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

const redisAuthRepository = new RedisAuthRepository();

const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
const generateToken = (user: User) => {
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
      role: user.role,
    },
    config.jwtSecret,
    accessSignOptions,
  );

  const refreshSignOptions: SignOptions = {};

  if (config.jwtRefreshExpiresIn) {
    refreshSignOptions.expiresIn = config.jwtRefreshExpiresIn as Exclude<
      SignOptions["expiresIn"],
      undefined
    >;
  }
  const refreshTokenId = uuidv4();

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      role: user.role,
      jwtId: refreshTokenId,
    },
    config.jwtRefreshSecret,
    refreshSignOptions,
  );

  return { accessToken, refreshToken, refreshTokenId };
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
    throw new Error("Account with that email already exists");
  }
  if (profile) {
    throw new Error("Profile with that name already exists");
  }

  const hashedPassword = await hashPassword(registerUserDto.password);

  const user = await prismaClient.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const newUser = await tx.user.create({
        data: {
          account: {
            create: {
              email: registerUserDto.email,
              passwordHash: hashedPassword,
              providerId: "local",
              lastLoginAt: new Date(),
              createdById: "",
              updatedById: "",
            },
          },
          profile: {
            create: {
              username: registerUserDto.username,
              displayName: registerUserDto.username,
              birthday: registerUserDto.birthday,
              bio: registerUserDto.bio,
              createdById: "",
            },
          },
        },
      });

      return tx.user.update({
        where: {
          id: newUser.id,
        },
        data: {
          createdById: newUser.id,
          account: {
            update: {
              createdById: newUser.id,
            },
          },
          profile: {
            update: {
              createdById: newUser.id,
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

  const expiryString = config.jwtRefreshExpiresIn as StringValue;

  const redisExpirySeconds = ms(expiryString) / 1000;

  const tokens = generateToken(user);
  await redisAuthRepository.storeRefreshTokenId(
    user.id,
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
    throw new Error("User not found");
  }
  const isPasswordValid = await bcrypt.compare(
    loginDto.password,
    account.passwordHash,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const user = await prismaClient.user.findUnique({
    where: { id: account.userId },
  });
  if (!user) {
    throw new Error("User record missing");
  }

  const tokens = generateToken(user);

  const expiryString = config.jwtRefreshExpiresIn as StringValue;

  const redisExpirySeconds = ms(expiryString) / 1000;

  await redisAuthRepository.storeRefreshTokenId(
    account.userId,
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
    throw new Error("Invalid token payload");
  }

  const session = await redisAuthRepository.findSessionByTokenId(decoded.jwtId);
  if (!session) {
    throw new Error("Session not found");
  }
  const user = await prismaClient.user.findUnique({
    where: { id: decoded.userId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  const isBlacklisted = await redisAuthRepository.isTokenBlacklisted({
    jwtId: decoded.jwtId,
    userId: decoded.userId,
    exp: decoded.exp || 0,
  });
  if (isBlacklisted) {
    throw new Error("Token has been revoked");
  }

  const tokens = generateToken(user);
  const expiryString = config.jwtRefreshExpiresIn as StringValue;

  const redisExpirySeconds = ms(expiryString) / 1000;

  await redisAuthRepository.storeRefreshTokenId(
    user.id,
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
    throw new Error("Failed to receive ID token from Google");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: googleTokens.id_token,
    audience: config.googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new Error("Invalid Google ID token payload");
  }

  const account = await prismaClient.account.findUnique({
    where: { email: payload.email },
  });

  let user: User;
  if (!account) {
    const baseUsername =
      payload.name?.replace(/\s+/g, "").toLowerCase() ||
      payload.email.split("@")[0] ||
      "";
    user = await prismaClient.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const newUser = await tx.user.create({
          data: {
            account: {
              create: {
                email: payload.email!,
                passwordHash: "",
                providerId: "google",
                lastLoginAt: new Date(),
                createdById: "",
                updatedById: "",
              },
            },
            profile: {
              create: {
                username: baseUsername,
                displayName: payload.name || baseUsername,
                birthday: new Date(Date.now()),
                bio: "",
                createdById: "",
              },
            },
          },
        });

        return tx.user.update({
          where: { id: newUser.id },
          data: {
            createdById: newUser.id,
            account: { update: { createdById: newUser.id } },
            profile: { update: { createdById: newUser.id } },
          },
        });
      },
    );
  } else {
    user = (await prismaClient.user.findUnique({
      where: { id: account.userId },
    })) as User;
  }

  const appTokens = generateToken(user);
  const expiryString = config.jwtRefreshExpiresIn as StringValue;
  const redisExpirySeconds = ms(expiryString) / 1000;

  await redisAuthRepository.storeRefreshTokenId(
    user.id,
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
  const decoded = jwt.verify(accessToken, config.jwtSecret) as JwtPayload;

  if (decoded.jwtId) {
    const isBlacklisted = await redisAuthRepository.isTokenBlacklisted({
      jwtId: decoded.jwtId,
      userId: decoded.userId,
      exp: decoded.exp || 0,
    });

    if (isBlacklisted) {
      throw new Error("Token has been revoked");
    }
  }
  const returnPayload = {
    isValid: true,
    tokenPayload: decoded,
  };
  return returnPayload;
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
