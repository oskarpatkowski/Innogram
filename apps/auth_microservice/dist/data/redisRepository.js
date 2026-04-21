import { redisClient } from "./redisClient.js";
export class RedisAuthRepository {
    isTokenBlacklisted = async (token) => {
        const key = `blacklist:access:${token.jwtId}`;
        const result = await redisClient.exists(key);
        return result === 1;
    };
    blacklistToken = async (token, expiresInSeconds) => {
        const key = `blacklist:access:${token.jwtId}`;
        await redisClient.setEx(key, expiresInSeconds, "true");
    };
    storeRefreshTokenId = async (userId, refreshTokenId, ipAddress, userAgent, expiresInSeconds = 604800) => {
        const key = `refresh_tokens:${refreshTokenId}`;
        const sessionData = {
            userId,
            ipAddress,
            userAgent,
            createdAt: new Date().toISOString(),
        };
        await redisClient.setEx(key, expiresInSeconds, JSON.stringify(sessionData));
    };
    findSessionByTokenId = async (tokenId) => {
        const key = `refresh_tokens:${tokenId}`;
        const data = await redisClient.get(key);
        if (!data)
            return null;
        return JSON.parse(data);
    };
    deleteSessionByRefreshTokenId = async (tokenId) => {
        const key = `refresh_tokens:${tokenId}`;
        await redisClient.del(key);
    };
}
//# sourceMappingURL=redisRepository.js.map