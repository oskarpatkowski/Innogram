import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { LoginDto } from '../../dto/login.dto';
import { RefreshDto } from '../../dto/refresh.dto';
import { SignupDto } from '../../dto/signup.dto';
import { PrismaService } from '../services/prisma.service';

interface InternalSignupDto {
  username: string;
  password: string;
  email: string;
  birthday: Date;
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
  private authServiceUrl: string;
  private axiosClient: AxiosInstance;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const authPort = configService.get<number>('AUTH_PORT') || 3002;
    this.authServiceUrl =
      configService.get<string>('AUTH_SERVICE_URL') ||
      `http://localhost:${authPort}`;

    this.axiosClient = axios.create({
      baseURL: this.authServiceUrl,
    });

    this.axiosClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error) && error.response) {
          const data = error.response.data as
            | { error?: { message?: string } }
            | undefined;
          const message = data?.error?.message || error.message;
          throw new HttpException(message, error.response.status);
        }
        throw error;
      },
    );
  }

  public async register(signupDto: SignupDto) {
    Logger.log('Registering user', 'AuthService');

    const internalSignupDto: InternalSignupDto = {
      username: signupDto.username,
      password: signupDto.password,
      email: signupDto.email,
      birthday: signupDto.birthdate,
      bio: 'A short bio',
      ipAddress: signupDto.ipAddress,
      userAgent: signupDto.userAgent,
    };

    const response = await this.axiosClient.post<tokensResponse>(
      '/internal/auth/register',
      internalSignupDto,
    );

    return response.data;
  }

  public async login(loginDto: LoginDto) {
    Logger.log(`Logging in user: ${loginDto.email}`, 'AuthService');

    const response = await this.axiosClient.post<tokensResponse>(
      '/internal/auth/login',
      loginDto,
    );

    return response.data;
  }

  public async validateToken(accessToken: string) {
    Logger.log('Validating token', 'AuthService');

    const response = await this.axiosClient.post<TokenValidationResponse>(
      '/internal/auth/validate',
      {
        accessToken,
      },
    );
    console.log(response.data);
    return response.data;
  }

  public async refreshToken(refreshDto: RefreshDto) {
    Logger.log('Refreshing token', 'AuthService');

    const response = await this.axiosClient.post<tokensResponse>(
      '/internal/auth/refresh',
      refreshDto,
    );

    return response.data;
  }

  public async logout(refreshToken: string) {
    Logger.log('Logging out user', 'AuthService');

    const response = await this.axiosClient.post<{ message?: string }>(
      '/internal/auth/logout',
      {
        refreshToken,
      },
    );

    return response.data;
  }

  public async oAuthInit(provider: string) {
    Logger.log(`Initiating OAuth to ${provider}`, 'AuthService');

    const response = await this.axiosClient.get<oAuthRedirectUrl>(
      '/internal/auth/oauth/initiate',
    );

    return response.data;
  }

  public async oAuthCallback(oAuthRequest: OAuthRequest, provider: string) {
    Logger.log(`Callback from ${provider}`, 'AuthService');

    const response = await this.axiosClient.post<tokensResponse>(
      '/internal/auth/oauth/exchange-code',
      oAuthRequest,
    );

    return response.data;
  }
}
