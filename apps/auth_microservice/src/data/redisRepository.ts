import { redisClient } from "./redisClient.ts";

export interface JwtPayload {
  jwtId: string; 
  userId: string; 
  exp: number; 
}

export interface RefreshTokenSession {
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export class RedisAuthRepository {

  isTokenBlacklisted = async (token: JwtPayload): Promise<boolean> => {
    const key = `blacklist:access:${token.jwtId}`; 
    const result = await redisClient.exists(key);
    
    return result === 1;
  }

  blacklistToken = async (token: JwtPayload, expiresInSeconds: number): Promise<void> => {
    const key = `blacklist:access:${token.jwtId}`;
    
    await redisClient.setEx(key, expiresInSeconds, 'true');
  };

  storeRefreshTokenId = async (
    userId: string, 
    refreshTokenId: string, 
    ipAddress: string,
    userAgent: string,
    expiresInSeconds: number = 604800 
  ): Promise<void> => {
    const key = `refresh_tokens:${refreshTokenId}`;
    
    const sessionData: RefreshTokenSession = {
      userId,
      ipAddress, 
      userAgent,
      createdAt: new Date().toISOString()
    };

    await redisClient.setEx(key, expiresInSeconds, JSON.stringify(sessionData));
  };

  findSessionByTokenId = async (tokenId: string): Promise<RefreshTokenSession | null> => {
    const key = `refresh_tokens:${tokenId}`;
    const data = await redisClient.get(key);
    
    if (!data) return null;
    
    return JSON.parse(data) as RefreshTokenSession;
  };

  deleteSessionByRefreshTokenId = async (tokenId: string): Promise<void> => {
    const key = `refresh_tokens:${tokenId}`;
    
    await redisClient.del(key);
  };
}