import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create_user.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { QueryUserDto } from './dto/query_user.dto';
import { User } from './entities/user.entity';
import { OAuthAccountsService } from '../oauth_accounts/oauth_accounts.service';
import { PasswordResetTokensService } from '../password_reset_tokens/password_reset_tokens.service';
import { UserSessionsService } from '../user_sessions/user_sessions.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => OAuthAccountsService))
    private readonly oauthAccountsService: OAuthAccountsService,
    @Inject(forwardRef(() => PasswordResetTokensService))
    private readonly passwordResetTokensService: PasswordResetTokensService,
    @Inject(forwardRef(() => UserSessionsService))
    private readonly userSessionsService: UserSessionsService,
  ) {}

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    return `${salt}:${hash}`;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findByEmail(
      createUserDto.email,
    );
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const { password, ...userData } = createUserDto;
    const password_hash = password ? this.hashPassword(password) : null;

    const user = await this.usersRepository.create({
      ...userData,
      password_hash,
    });

    // Strip password hash from response
    delete user.password_hash;
    return user;
  }

  async findAll(
    queryDto: QueryUserDto,
  ): Promise<{ data: User[]; total: number }> {
    const result = await this.usersRepository.findAll(queryDto);
    result.data.forEach((user) => {
      delete user.password_hash;
    });
    return result;
  }

  async count(queryDto: Omit<QueryUserDto, 'page' | 'limit'>): Promise<number> {
    return this.usersRepository.count(queryDto);
  }

  async findOne(
    id: string,
    relations?: { oauth?: boolean; tokens?: boolean; sessions?: boolean },
  ): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    delete user.password_hash;

    if (relations?.oauth) {
      user.oauth_accounts = await this.oauthAccountsService.findByUserId(id);
    }
    if (relations?.tokens) {
      const tokensResult = await this.passwordResetTokensService.findAll({
        user_id: id,
        limit: 100,
      });
      user.password_reset_tokens = tokensResult.data;
    }
    if (relations?.sessions) {
      const sessionsResult = await this.userSessionsService.findAll({
        user_id: id,
        limit: 100,
      });
      user.user_sessions = sessionsResult.data;
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    if (updateUserDto.email) {
      const existing = await this.usersRepository.findByEmail(
        updateUserDto.email,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException('Email already in use');
      }
    }

    const { password, ...updateData } = updateUserDto;
    const mappedUpdate: Partial<User> = { ...updateData };

    if (password) {
      mappedUpdate.password_hash = this.hashPassword(password);
    }

    const updatedUser = await this.usersRepository.update(id, mappedUpdate);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    delete updatedUser.password_hash;
    return updatedUser;
  }

  async remove(id: string, hardDelete = false): Promise<void> {
    await this.findOne(id); // Ensure user exists

    const success = hardDelete
      ? await this.usersRepository.hardDelete(id)
      : await this.usersRepository.softDelete(id);

    if (!success) {
      throw new NotFoundException(`User with ID ${id} could not be deleted`);
    }
  }

  async restore(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const success = await this.usersRepository.restore(id);
    if (!success) {
      throw new ConflictException(
        `User with ID ${id} is not deleted or could not be restored`,
      );
    }
  }
}
