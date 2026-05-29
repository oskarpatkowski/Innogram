import { Injectable, Logger } from '@nestjs/common';
import { CreateChatMessageDto } from '../../dto/create.message.dto';
import { UpdateChatMessageDto } from '../../dto/update.message.dto';
import { PrismaService } from './prisma.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChatMessageDto, profileId: string, userId: string) {
    try {
      const { assetIds, ...messageData } = dto;

      const message = await this.prisma.message.create({
        data: {
          ...messageData,
          profileId: profileId,
          createdById: userId,
        },
      });
      Logger.log(`Message ${message.id} created`, 'MessageService');

      if (assetIds && assetIds.length > 0) {
        for (const assetId of assetIds) {
          await this.linkAssetToMessage(assetId, message.id, userId);
        }
      }

      return message;
    } catch (error) {
      Logger.error(
        `Failed to create message: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
        'MessageService',
      );
      throw error;
    }
  }

  async getById(id: string) {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id },
      });

      if (message) {
        Logger.log(`Message ${message.id} found`, 'MessageService');
      } else {
        Logger.log(`Message ${id} not found`, 'MessageService');
      }

      return message;
    } catch (error) {
      Logger.error(
        `Failed to get message by id ${id}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
        'MessageService',
      );
      throw error;
    }
  }

  async getAll() {
    try {
      const messages = await this.prisma.message.findMany();

      if (messages.length > 0) {
        Logger.log(`Found ${messages.length} messages`, 'MessageService');
      } else {
        Logger.log(`No messages found`, 'MessageService');
      }

      return messages;
    } catch (error) {
      Logger.error(
        `Failed to get all messages: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
        'MessageService',
      );
      throw error;
    }
  }

  async getForChat(chatId: string) {
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          chatId: chatId,
        },
      });

      if (messages.length > 0) {
        Logger.log(
          `Found ${messages.length} messages for chat: ${chatId}`,
          'MessageService',
        );
      } else {
        Logger.log(`No messages found for chat: ${chatId}`, 'MessageService');
      }

      return messages;
    } catch (error) {
      Logger.error(
        `Failed to get messages for chat ${chatId}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
        'MessageService',
      );
    }
  }

  async update(id: string, messageDto: UpdateChatMessageDto) {
    try {
      const message = await this.prisma.message.update({
        where: { id },
        data: messageDto,
      });

      Logger.log(`Message ${message.id} updated`, 'MessageService');
      return message;
    } catch (error) {
      Logger.error(
        `Failed to update message ${id}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
        'MessageService',
      );
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const message = await this.prisma.message.delete({
        where: { id },
      });

      if (message) {
        Logger.log(`Message ${message.id} deleted`, 'MessageService');
      } else {
        Logger.log(`Message ${id} not found`, 'MessageService');
      }

      return message;
    } catch (error) {
      Logger.error(
        `Failed to delete message ${id}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
        'MessageService',
      );
      throw error;
    }
  }

  async linkAssetToMessage(assetId: string, messageId: string, userId: string) {
    try {
      Logger.log(
        `Linking asset ${assetId} to message ${messageId} by user ${userId}`,
        'MessageService',
      );
      const linked = await this.prisma.messageAsset.create({
        data: {
          assetId: assetId,
          messageId: messageId,
          createdById: userId,
        },
      });
      return linked;
    } catch (error) {
      Logger.error(
        `Failed to link asset ${assetId} to message ${messageId}: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
        'MessageService',
      );
      throw error;
    }
  }
}
