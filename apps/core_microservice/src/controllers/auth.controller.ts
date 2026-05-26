import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpException,
  Ip,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import express from 'express';
import { LoginDto } from '../../dto/login.dto';
import { SignupDto } from '../../dto/signup.dto';
import {
  AppJwtPayload,
  AuthService,
  TokenValidationResponse,
} from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async handleSignUp(
    @Body() signupDto: SignupDto,
    @Ip() ipAddress: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const response = await this.authService.register(signupDto, ipAddress);
    const { accessToken, refreshToken } = response;

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return response;
  }

  @Post('login')
  @HttpCode(200)
  public async handleLogin(
    @Body() loginDto: LoginDto,
    @Ip() ipAddress: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const response = await this.authService.login(loginDto, ipAddress);
    const { accessToken, refreshToken } = response;

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return response;
  }

  @Post('validate')
  @HttpCode(200)
  public async handleValidate(
    @Req() req: express.Request,
    @Body('accessToken') bodyAccessToken?: string,
  ): Promise<TokenValidationResponse> {
    const cookieToken = req.cookies?.['accessToken'] as string | undefined;
    const token = bodyAccessToken || cookieToken;

    if (!token) {
      return { isValid: false, tokenPayload: {} as AppJwtPayload };
    }
    try {
      return await this.authService.validateToken(token);
    } catch {
      return { isValid: false, tokenPayload: {} as AppJwtPayload };
    }
  }

  @Post('refresh')
  @HttpCode(200)
  public async handleRefresh(
    @Req() req: express.Request,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken = req.cookies?.['refreshToken'] as string | undefined;

    if (!refreshToken) {
      throw new HttpException('No refresh token provided', 401);
    }

    try {
      const response = await this.authService.refreshToken(
        refreshToken,
        ipAddress,
        userAgent || '',
      );
      const { accessToken, refreshToken: newRefreshToken } = response;

      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true });

      return response;
    } catch (error) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(200)
  public async handleLogout(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken = req.cookies?.['refreshToken'] as string | undefined;
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    if (refreshToken) {
      return await this.authService.logout(refreshToken);
    }
    return { message: 'Logged out successfully' };
  }

  @Get('login/:provider')
  public async handleOAuthInit(@Param('provider') provider: string) {
    console.log(`[AuthController] Initiating OAuth for ${provider}`);
    const response = await this.authService.oAuthInit(provider);
    console.log(`[AuthController] Generated OAuth URL: ${response.url}`);
    if (!response.url) {
      console.error(
        `[AuthController] No URL returned from auth service for provider ${provider}`,
      );
    }

    return response;
  }

  @Get(':provider/callback')
  public async handleOAuthCallback(
    @Param('provider') provider: string,
    @Query('useragent') useragent: string,
    @Query('code') code: string,
    @Ip() ipAddress: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const request = {
      code,
      userAgent: useragent,
    };
    const response = await this.authService.oAuthCallback(
      request,
      provider,
      ipAddress,
    );
    const { accessToken, refreshToken } = response;

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
    return res.redirect(`${clientUrl}/`);
  }
}
