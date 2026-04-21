import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import express from 'express';
import { LoginDto } from '../../dto/login.dto';
import { RefreshDto } from '../../dto/refresh.dto';
import { SignupDto } from '../../dto/signup.dto';
import { AuthService, TokenValidationResponse } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async handleSignUp(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const response = await this.authService.register(signupDto);
    const { accessToken, refreshToken } = response.data;

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return response;
  }

  @Post('login')
  @HttpCode(200)
  public async handleLogin(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const response = await this.authService.login(loginDto);
    const { accessToken, refreshToken } = response.data;

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return response;
  }

  @Post('validate')
  @HttpCode(200)
  public async handleValidate(
    @Body() accessToken: string,
  ): Promise<TokenValidationResponse> {
    return await this.authService.validateToken(accessToken);
  }

  @Post('refresh')
  @HttpCode(200)
  public async handleRefresh(
    @Body() refreshDto: RefreshDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    try {
      const response = await this.authService.refreshToken(refreshDto);
      const { accessToken, refreshToken } = response.data;

      res.cookie('accessToken', accessToken, { httpOnly: true });
      res.cookie('refreshToken', refreshToken, { httpOnly: true });

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
    @Body() refreshTokenId: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return await this.authService.logout(refreshTokenId);
  }

  @Get('login/:provider')
  public async handleOAuthInit(
    @Param('provider') provider: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const response = await this.authService.oAuthInit(provider);
    res.redirect(response.data.url);
  }

  @Get(':provider/callback')
  public async handleOAuthCallback(
    @Param('provider') provider: string,
    @Query('ipaddress') ipaddress: string,
    @Query('useragent') useragent: string,
    @Query('code') code: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const request = {
      code,
      ipAddress: ipaddress,
      userAgent: useragent,
    };
    const response = await this.authService.oAuthCallback(request, provider);
    const { accessToken, refreshToken } = response.data;

    res.cookie('accessToken', accessToken, { httpOnly: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true });

    return response;
  }
}
