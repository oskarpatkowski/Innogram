import jwt from "jsonwebtoken";
import type { LoginDto } from "../dto/loginDto.ts";
import { SignupDto } from "../dto/signUpDto.js";
export declare const registerUser: (registerUserDto: SignupDto) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const authenticateUser: (loginDto: LoginDto) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const processRefreshtoken: (refreshToken: string, ipAddress: string, userAgent: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const exchangeCodeForToken: (code: string, ipAddress: string, userAgent: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const validateToken: (accessToken: string) => Promise<{
    isValid: boolean;
    tokenPayload: jwt.JwtPayload;
}>;
export declare const handleLogout: (refreshToken: string) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map