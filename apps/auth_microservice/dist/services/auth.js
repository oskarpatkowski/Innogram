import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt, {} from "jsonwebtoken";
import ms, {} from "ms";
import { v4 as uuidv4 } from "uuid";
import config from "../config/config.js";
import { prismaClient } from "../data/prismaClient.js";
import { RedisAuthRepository, } from "../data/redisRepository.js";
import { SignupDto } from "../dto/signUpDto.js";
const googleClient = new OAuth2Client(config.googleClientId, config.googleClientSecret, config.googleRedirectUri);
const redisAuthRepository = new RedisAuthRepository();
const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};
const generateToken = (user) => {
    const accessSignOptions = {};
    if (config.jwtExpiresIn) {
        accessSignOptions.expiresIn = config.jwtExpiresIn;
    }
    const accessToken = jwt.sign({
        userId: user.id,
        role: user.role,
    }, config.jwtSecret, accessSignOptions);
    const refreshSignOptions = {};
    if (config.jwtRefreshExpiresIn) {
        refreshSignOptions.expiresIn = config.jwtRefreshExpiresIn;
    }
    const refreshTokenId = uuidv4();
    const refreshToken = jwt.sign({
        userId: user.id,
        role: user.role,
        jwtId: refreshTokenId,
    }, config.jwtRefreshSecret, refreshSignOptions);
    return { accessToken, refreshToken, refreshTokenId };
};
export const registerUser = async (registerUserDto) => {
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
    const user = await prismaClient.$transaction(async (tx) => {
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
    });
    const expiryString = config.jwtRefreshExpiresIn;
    const redisExpirySeconds = ms(expiryString) / 1000;
    const tokens = generateToken(user);
    await redisAuthRepository.storeRefreshTokenId(user.id, tokens.refreshTokenId, registerUserDto.ipAddress, registerUserDto.userAgent, redisExpirySeconds);
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
};
export const authenticateUser = async (loginDto) => {
    const account = await prismaClient.account.findUnique({
        where: {
            email: loginDto.email,
        },
    });
    if (!account) {
        throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(loginDto.password, account.passwordHash);
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
    const expiryString = config.jwtRefreshExpiresIn;
    const redisExpirySeconds = ms(expiryString) / 1000;
    await redisAuthRepository.storeRefreshTokenId(account.userId, tokens.refreshTokenId, loginDto.ipAddress, loginDto.userAgent, redisExpirySeconds);
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
};
export const processRefreshtoken = async (refreshToken, ipAddress, userAgent) => {
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
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
    const expiryString = config.jwtRefreshExpiresIn;
    const redisExpirySeconds = ms(expiryString) / 1000;
    await redisAuthRepository.storeRefreshTokenId(user.id, tokens.refreshTokenId, ipAddress, userAgent, redisExpirySeconds);
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
};
export const exchangeCodeForToken = async (code, ipAddress, userAgent) => {
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
    let user;
    if (!account) {
        const baseUsername = payload.name?.replace(/\s+/g, "").toLowerCase() ||
            payload.email.split("@")[0] ||
            "";
        user = await prismaClient.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    account: {
                        create: {
                            email: payload.email,
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
        });
    }
    else {
        user = (await prismaClient.user.findUnique({
            where: { id: account.userId },
        }));
    }
    const appTokens = generateToken(user);
    const expiryString = config.jwtRefreshExpiresIn;
    const redisExpirySeconds = ms(expiryString) / 1000;
    await redisAuthRepository.storeRefreshTokenId(user.id, appTokens.refreshTokenId, ipAddress, userAgent, redisExpirySeconds);
    return {
        accessToken: appTokens.accessToken,
        refreshToken: appTokens.refreshToken,
    };
};
export const validateToken = async (accessToken) => {
    const decoded = jwt.verify(accessToken, config.jwtSecret);
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
export const handleLogout = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const remainingSeconds = decoded.exp - currentTimeInSeconds;
    if (remainingSeconds > 0) {
        const tokenToBlacklist = {
            jwtId: decoded.jwtId,
            userId: decoded.userId,
            exp: decoded.exp,
        };
        await redisAuthRepository.blacklistToken(tokenToBlacklist, remainingSeconds);
    }
    await redisAuthRepository.deleteSessionByRefreshTokenId(decoded.jwtId);
};
//# sourceMappingURL=auth.js.map