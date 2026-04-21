import type { LoginDto } from "../dto/loginDto.ts";
import type { SignupDto } from "../dto/signUpDto.ts";
export declare const register: (registerUserDto: SignupDto) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const authenticate: (loginDto: LoginDto) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const validate: (accessToken: string) => Promise<{
    isValid: boolean;
    tokenPayload: import("jsonwebtoken").JwtPayload;
}>;
export declare const logout: (refreshToken: string) => Promise<void>;
export declare const refresh: (refreshToken: string, ipAddress: string, userAgent: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const oauthRegister: (code: string, ipAddress: string, userAgent: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const oauthInitiate: () => Promise<{
    url: string;
}>;
//# sourceMappingURL=auth.d.ts.map