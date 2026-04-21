import type { SignOptions } from 'jsonwebtoken';
interface Config {
    port: number;
    redisPort: number;
    redisUname: string;
    redisPassword: string;
    nodeEnv: string;
    databaseUrl: string;
    jwtSecret: string;
    jwtExpiresIn: SignOptions['expiresIn'];
    jwtRefreshSecret: string;
    jwtRefreshExpiresIn: SignOptions['expiresIn'];
    googleClientId: string;
    googleClientSecret: string;
    googleRedirectUri: string;
    allowedOrigin: string;
}
declare const config: Config;
export default config;
//# sourceMappingURL=config.d.ts.map