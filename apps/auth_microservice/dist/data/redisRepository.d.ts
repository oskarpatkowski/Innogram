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
export declare class RedisAuthRepository {
    isTokenBlacklisted: (token: JwtPayload) => Promise<boolean>;
    blacklistToken: (token: JwtPayload, expiresInSeconds: number) => Promise<void>;
    storeRefreshTokenId: (userId: string, refreshTokenId: string, ipAddress: string, userAgent: string, expiresInSeconds?: number) => Promise<void>;
    findSessionByTokenId: (tokenId: string) => Promise<RefreshTokenSession | null>;
    deleteSessionByRefreshTokenId: (tokenId: string) => Promise<void>;
}
//# sourceMappingURL=redisRepository.d.ts.map