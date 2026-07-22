import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { OAuthAccountsRepository } from './repositories/oauth_accounts.repository';
import { CreateOAuthAccountDto } from './dto/create_oauth_account.dto';
import { QueryOAuthAccountDto } from './dto/query_oauth_account.dto';
import { OAuthAccount } from './entities/oauth_account.entity';
import { UsersRepository } from '../users/repositories/users.repository';

@Injectable()
export class OAuthAccountsService {
  constructor(
    private readonly oauthAccountsRepository: OAuthAccountsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(dto: CreateOAuthAccountDto): Promise<OAuthAccount> {
    // Verify user exists
    const user = await this.usersRepository.findById(dto.user_id);
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.user_id} not found`);
    }

    // Verify oauth provider is not already registered
    const existing = await this.oauthAccountsRepository.findByProvider(
      dto.provider,
      dto.provider_user_id,
    );
    if (existing) {
      throw new ConflictException(
        'This OAuth account is already linked to a user',
      );
    }

    return this.oauthAccountsRepository.create(dto);
  }

  async findAll(
    queryDto: QueryOAuthAccountDto,
  ): Promise<{ data: OAuthAccount[]; total: number }> {
    return this.oauthAccountsRepository.findAll(queryDto);
  }

  async findOne(id: string): Promise<OAuthAccount> {
    const oauth = await this.oauthAccountsRepository.findById(id);
    if (!oauth) {
      throw new NotFoundException(`OAuth account with ID ${id} not found`);
    }
    return oauth;
  }

  async findByUserId(userId: string): Promise<OAuthAccount[]> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.oauthAccountsRepository.findByUserId(userId);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    const success = await this.oauthAccountsRepository.delete(id);
    if (!success) {
      throw new NotFoundException(
        `OAuth account with ID ${id} could not be deleted`,
      );
    }
  }

  async removeByUserId(userId: string): Promise<number> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return this.oauthAccountsRepository.deleteByUserId(userId);
  }
}
