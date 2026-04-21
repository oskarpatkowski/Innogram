import config from "../config/config.js";
import { authenticateUser, exchangeCodeForToken, handleLogout, processRefreshtoken, registerUser, validateToken, } from "../services/auth.js";
export const register = async (registerUserDto) => {
    return await registerUser(registerUserDto);
};
export const authenticate = async (loginDto) => {
    return await authenticateUser(loginDto);
};
export const validate = async (accessToken) => {
    return await validateToken(accessToken);
};
export const logout = async (refreshToken) => {
    return await handleLogout(refreshToken);
};
export const refresh = async (refreshToken, ipAddress, userAgent) => {
    return await processRefreshtoken(refreshToken, ipAddress, userAgent);
};
export const oauthRegister = async (code, ipAddress, userAgent) => {
    return await exchangeCodeForToken(code, ipAddress, userAgent);
};
export const oauthInitiate = async () => {
    return {
        url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.googleClientId}&redirect_uri=${config.googleRedirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email`,
    };
};
//# sourceMappingURL=auth.js.map