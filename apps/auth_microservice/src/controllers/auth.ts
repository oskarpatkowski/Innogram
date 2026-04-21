import config from "../config/config.js";
import type { LoginDto } from "../dto/loginDto.ts";
import type { SignupDto } from "../dto/signUpDto.ts";
import {
  authenticateUser,
  exchangeCodeForToken,
  handleLogout,
  processRefreshtoken,
  registerUser,
  validateToken,
} from "../services/auth.js";

export const register = async (registerUserDto: SignupDto) => {
  return await registerUser(registerUserDto);
};

export const authenticate = async (loginDto: LoginDto) => {
  return await authenticateUser(loginDto);
};

export const validate = async (accessToken: string) => {
  return await validateToken(accessToken);
};

export const logout = async (refreshToken: string) => {
  return await handleLogout(refreshToken);
};

export const refresh = async (
  refreshToken: string,
  ipAddress: string,
  userAgent: string,
) => {
  return await processRefreshtoken(refreshToken, ipAddress, userAgent);
};

export const oauthRegister = async (
  code: string,
  ipAddress: string,
  userAgent: string,
) => {
  return await exchangeCodeForToken(code, ipAddress, userAgent);
};

export const oauthInitiate = async () => {
  return {
    url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.googleClientId}&redirect_uri=${config.googleRedirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email`,
  };
};
