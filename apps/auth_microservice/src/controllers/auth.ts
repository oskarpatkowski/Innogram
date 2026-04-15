import type { LoginDto } from "../dto/loginDto.js";
import type { SignupDto } from "../dto/signUpDto.js"
import { authenticateUser, registerUser, validateToken, handleLogout, processRefreshtoken, exchangeCodeForToken } from "../services/auth.js"

export const register = async (registerUserDto: SignupDto) => {
  return await registerUser(registerUserDto);
}

export const authenticate = async (loginDto: LoginDto) => {
  return await authenticateUser(loginDto);
}

export const validate = async (accessToken: string) => {
  return await validateToken(accessToken);
}

export const logout = async (refreshToken: string) => {
  return await handleLogout(refreshToken);
}

export const refresh = async (refreshToken: string, ipAddress: string, userAgent: string) => {
  return await processRefreshtoken(refreshToken, ipAddress, userAgent);
}

export const oauthRegister = async (code: string, ipAddress: string, userAgent: string) => {
  return await exchangeCodeForToken(code, ipAddress, userAgent);
}