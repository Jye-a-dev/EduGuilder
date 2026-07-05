import {
  Controller,
  Post,
  Body,
  Headers,
  Ip,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot_password.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { ApiAuth } from './auth.swagger';
import { User } from '../users/entities/user.entity';

@Controller('auth')
@ApiAuth.controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiAuth.register()
  async register(@Body() registerDto: RegisterDto): Promise<{
    user: User;
    access_token: string;
    refresh_token: string;
  }> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiAuth.login()
  async login(
    @Body() loginDto: LoginDto,
    @Headers('user-agent') userAgent?: string,
    @Ip() ipAddress?: string,
  ): Promise<{
    user: User;
    access_token: string;
    refresh_token: string;
  }> {
    return this.authService.login(loginDto, userAgent, ipAddress);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiAuth.logout()
  async logout(
    @Body('refresh_token') refreshToken: string,
  ): Promise<{ message: string }> {
    await this.authService.logout(refreshToken);
    return { message: 'Successfully logged out' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiAuth.forgotPassword()
  async forgotPassword(
    @Body() forgotDto: ForgotPasswordDto,
  ): Promise<{ resetToken: string }> {
    return this.authService.forgotPassword(forgotDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiAuth.resetPassword()
  async resetPassword(
    @Body() resetDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(resetDto);
    return { message: 'Password has been reset successfully' };
  }
}
