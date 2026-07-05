import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersRepository } from '../users/repositories/users.repository';
import { UsersService } from '../users/users.service';
import { UserSessionsService } from '../user_sessions/user_sessions.service';
import { PasswordResetTokensService } from '../password_reset_tokens/password_reset_tokens.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { JwtHelper } from '../../utils/jwt.helper';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly userSessionsService: UserSessionsService,
    private readonly passwordResetTokensService: PasswordResetTokensService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{
    user: User;
    access_token: string;
    refresh_token: string;
  }> {
    const existing = await this.usersRepository.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.usersService.create({
      email: registerDto.email,
      password: registerDto.password,
      full_name: registerDto.full_name,
      role: registerDto.role as UserRole,
      university_id: registerDto.university_id,
      current_grade: registerDto.current_grade,
    });

    const tokens = await this.generateUserTokens(user);
    return { user, ...tokens };
  }

  async login(
    loginDto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{
    user: User;
    access_token: string;
    refresh_token: string;
  }> {
    const user = await this.usersRepository.findByEmail(loginDto.email);
    if (!user || !user.password_hash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = this.verifyPassword(loginDto.password, user.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Strip password hash
    const userResult = { ...user };
    delete userResult.password_hash;

    const tokens = await this.generateUserTokens(
      userResult,
      userAgent,
      ipAddress,
    );
    return { user: userResult, ...tokens };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const session = await this.userSessionsService.validate(refreshToken);
      await this.userSessionsService.revoke(session.id);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(email: string): Promise<{ resetToken: string }> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const { token } = await this.passwordResetTokensService.generateToken(
      user.id,
    );
    // In production, we'd email this token. Here we return it in response for testing.
    return { resetToken: token };
  }

  async resetPassword(resetDto: ResetPasswordDto): Promise<void> {
    const tokenRecord = await this.passwordResetTokensService.validateToken(
      resetDto.token,
    );

    // Update user password
    await this.usersService.update(tokenRecord.user_id, {
      password: resetDto.password,
    });

    // Mark token as used
    await this.passwordResetTokensService.useToken(resetDto.token);
  }

  private verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    const computedHash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return computedHash === hash;
  }

  private async generateUserTokens(
    user: User,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      university_id: user.university_id,
    };

    const accessToken = JwtHelper.sign(payload, 86400); // 1 day access token expiry
    const refreshToken = crypto.randomBytes(40).toString('hex');

    await this.userSessionsService.create({
      user_id: user.id,
      refresh_token: refreshToken,
      user_agent: userAgent,
      ip_address: ipAddress,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
