import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LoginDto } from '../../dto/login.dto';
import { RefreshDto } from '../../dto/refresh.dto';
import { SignupDto } from '../../dto/signup.dto';
import { PrismaService } from '../services/prisma.service';

interface InternalSignupDto {
  username: string;
  password: string;
  email: string;
  birthdate: Date;
  bio: string;
  ipAddress: string;
  userAgent: string;
}

export interface AppJwtPayload {
  userId: string;
  role: string;
  jwtId?: string;
  iat?: number;
  exp?: number;
}

export interface TokenValidationResponse {
  isValid: boolean;
  tokenPayload: AppJwtPayload;
}

export interface oAuthRedirectUrl {
  url: string;
}

export interface tokensResponse {
  accessToken: string;
  refreshToken: string;
}

interface OAuthRequest {
  code: string;
  ipAddress: string;
  userAgent: string;
}

@Injectable()
export class AuthService {
  private authPort: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.authPort = configService.get<number>('AUTH_PORT') || 3002;
  }

  public async register(signupDto: SignupDto) {
    Logger.log('Registering user', 'AuthService');

    const internalSignupDto: InternalSignupDto = {
      username: signupDto.username,
      password: signupDto.password,
      email: signupDto.email,
      birthdate: signupDto.birthdate,
      bio: 'A short bio',
      ipAddress: signupDto.ipaddress,
      userAgent: signupDto.useragent,
    };

    return await axios.post<tokensResponse>(
      `http://localhost:${this.authPort}/internal/auth/register`,
      internalSignupDto,
    );
  }

  public async login(loginDto: LoginDto) {
    Logger.log(`Logging in user: ${loginDto.email}`, 'AuthService');

    return await axios.post<tokensResponse>(
      `http://localhost:${this.authPort}/internal/auth/login`,
      loginDto,
    );
  }

  public async validateToken(accessToken: string) {
    Logger.log('Validating token', 'AuthService');

    const response = await axios.post<TokenValidationResponse>(
      `http://localhost:${this.authPort}/internal/auth/validate`,
      { accessToken },
    );

    return response.data;
  }

  public async refreshToken(refreshDto: RefreshDto) {
    Logger.log('Refreshing token', 'AuthService');

    return await axios.post<tokensResponse>(
      `http://localhost:${this.authPort}/internal/auth/refresh`,
      refreshDto,
    );
  }

  public async logout(refreshTokenId: string) {
    Logger.log('Logging out user', 'AuthService');

    return await axios.post(
      `http://localhost:${this.authPort}/internal/auth/logout`,
      { refreshTokenId },
    );
  }

  public async oAuthInit(provider: string) {
    Logger.log(`Initiating OAuth to ${provider}`, 'AuthService');

    return await axios.get<oAuthRedirectUrl>(
      `http://localhost:${this.authPort}/internal/auth/oauth/initiate`,
    );
  }

  public async oAuthCallback(oAuthRequest: OAuthRequest, provider: string) {
    Logger.log(`Callback from ${provider}`, 'AuthService');

    return await axios.post<tokensResponse>(
      `http://localhost:${this.authPort}/internal/auth/oauth/exchange-code`,
      oAuthRequest,
    );
  }
}
