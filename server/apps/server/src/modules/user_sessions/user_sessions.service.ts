import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { UserSessionsRepository } from './repositories/user_sessions.repository';
import { CreateUserSessionDto } from './dto/create_user_session.dto';
import { QueryUserSessionDto } from './dto/query_user_session.dto';
import { UserSession } from './entities/user_session.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class UserSessionsService {
  constructor(
    private readonly repository: UserSessionsRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async create(dto: CreateUserSessionDto): Promise<UserSession> {
    await this.usersService.findOne(dto.user_id);

    const refresh_token_hash = this.hashToken(dto.refresh_token);
    const expires_at = new Date(Date.now() + 30 * 24 * 3600 * 1000); // 30 days session expiry

    return this.repository.create({
      user_id: dto.user_id,
      refresh_token_hash,
      user_agent: dto.user_agent,
      ip_address: dto.ip_address,
      expires_at,
    });
  }

  async validate(refreshToken: string): Promise<UserSession> {
    const hash = this.hashToken(refreshToken);
    const session = await this.repository.findByRefreshTokenHash(hash);

    if (!session) {
      throw new UnauthorizedException('Invalid session or refresh token');
    }

    if (session.is_revoked) {
      throw new UnauthorizedException('Session has been revoked');
    }

    if (new Date(session.expires_at).getTime() < Date.now()) {
      throw new UnauthorizedException('Session has expired');
    }

    return session;
  }

  async findAll(
    queryDto: QueryUserSessionDto,
  ): Promise<{ data: UserSession[]; total: number }> {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string): Promise<UserSession> {
    const session = await this.repository.findById(id);
    if (!session) {
      throw new NotFoundException(`User session with ID ${id} not found`);
    }
    return session;
  }

  async revoke(id: string): Promise<void> {
    await this.findOne(id);
    const success = await this.repository.revoke(id);
    if (!success) {
      throw new ConflictException(`Session with ID ${id} is already revoked`);
    }
  }

  async revokeAllForUser(userId: string): Promise<{ revoked: number }> {
    await this.usersService.findOne(userId);
    const count = await this.repository.revokeAllByUserId(userId);
    return { revoked: count };
  }

  async cleanExpired(): Promise<{ deleted: number }> {
    const count = await this.repository.deleteExpired();
    return { deleted: count };
  }
}
