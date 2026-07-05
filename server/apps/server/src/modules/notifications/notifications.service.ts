import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from './repositories/notifications.repository';
import { CreateNotificationDto } from './dto/create_notification.dto';
import { QueryNotificationDto } from './dto/query_notification.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(private readonly repository: NotificationsRepository) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    return this.repository.create(dto);
  }

  async findAll(
    queryDto: QueryNotificationDto,
  ): Promise<{ data: Notification[]; total: number }> {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string): Promise<Notification> {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return record;
  }

  async markAsRead(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.markAsRead(id);
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const count = await this.repository.markAllAsRead(userId);
    return { count };
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.delete(id);
  }
}
