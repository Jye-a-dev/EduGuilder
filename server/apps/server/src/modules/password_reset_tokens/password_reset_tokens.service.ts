import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PasswordResetTokensRepository } from './repositories/password_reset_tokens.repository';
import { QueryPasswordResetTokenDto } from './dto/query_password_reset_token.dto';
import { PasswordResetToken } from './entities/password_reset_token.entity';
import { UsersRepository } from '../users/repositories/users.repository';

@Injectable()
export class PasswordResetTokensService {
  constructor(
    private readonly repository: PasswordResetTokensRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async generateToken(
    userId: string,
  ): Promise<{ token: string; record: PasswordResetToken }> {
    // Verify user exists
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const token_hash = this.hashToken(token);
    const expires_at = new Date(Date.now() + 3600 * 1000); // 1 hour expiration

    const record = await this.repository.create({
      user_id: userId,
      token_hash,
      expires_at,
    });

    return { token, record };
  }

  async validateToken(token: string): Promise<PasswordResetToken> {
    const token_hash = this.hashToken(token);
    const record = await this.repository.findByTokenHash(token_hash);

    if (!record) {
      throw new NotFoundException('Invalid reset token');
    }

    if (record.used_at) {
      throw new BadRequestException('Reset token has already been used');
    }

    if (new Date(record.expires_at).getTime() < Date.now()) {
      throw new BadRequestException('Reset token has expired');
    }

    return record;
  }

  async useToken(token: string): Promise<PasswordResetToken> {
    const record = await this.validateToken(token);
    const success = await this.repository.markAsUsed(record.id);
    if (!success) {
      throw new ConflictException('Failed to mark token as used');
    }
    const updated = await this.repository.findById(record.id);
    return updated!;
  }

  async findAll(
    queryDto: QueryPasswordResetTokenDto,
  ): Promise<{ data: PasswordResetToken[]; total: number }> {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string): Promise<PasswordResetToken> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(
        `Password reset token with ID ${id} not found`,
      );
    }
    return record;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.markAsUsed(id); // Soft invalidate by marking as used
  }

  async cleanExpired(): Promise<{ deleted: number }> {
    const deleted = await this.repository.deleteExpired();
    return { deleted };
  }

  async removeByUserId(userId: string): Promise<number> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.repository.deleteByUserId(userId);
  }
}
