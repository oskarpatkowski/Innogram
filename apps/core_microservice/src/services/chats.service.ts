import { Injectable, Logger } from '@nestjs/common';
import { CreateChatDto } from '../../dto/create.chat.dto';
import { UpdateChatDto } from '../../dto/update.chat.dto';
import { PrismaService } from '../services/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateChatDto, creatorProfileId: string) {
    const memberIds = [
      ...new Set([...(dto.memberProfileIds || []), creatorProfileId]),
    ];

    const creator = await this.prisma.profile.findUnique({
      where: { id: creatorProfileId },
    });
    if (!creator) {
      throw new Error('Creator profile not found');
    }

    const chat = await this.prisma.chat.create({
      data: {
        name: dto.name,
        description: dto.description,
        type: dto.type,
        createdById: creator.userId,
        participants: {
          create: memberIds.map((profileId) => ({
            profileId: profileId,
            createdById: creator.userId,
          })),
        },
      },
    });
    Logger.log(`Chat ${chat.id} created`, 'ChatsService');
    return chat;
  }

  async getById(id: string) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id,
      },
      include: {
        participants: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (chat) {
      Logger.log(`Chat ${chat.id} found`, 'ChatsService');
    } else {
      Logger.log(`Chat ${id} not found`, 'ChatsService');
    }

    return chat;
  }

  async getAll() {
    const chats = await this.prisma.chat.findMany({
      include: {
        participants: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (chats.length > 0) {
      Logger.log(`Found ${chats.length} chats`, 'ChatsService');
    } else {
      Logger.log(`No chats found`, 'ChatsService');
    }

    return chats;
  }

  async getChatsForProfile(profileId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            profileId: profileId,
          },
        },
      },
      include: {
        participants: {
          include: {
            profile: true,
          },
        },
      },
    });
    return chats;
  }

  async update(id: string, chatDto: UpdateChatDto, updaterUserId: string) {
    const { memberProfileIds, ...updateData } = chatDto;

    const prismaUpdateData: Prisma.ChatUpdateInput = { ...updateData };

    if (memberProfileIds) {
      prismaUpdateData.participants = {
        deleteMany: {},
        create: memberProfileIds.map((profileId) => ({
          profileId: profileId,
          createdById: updaterUserId,
        })),
      };
    }

    const chat = await this.prisma.chat.update({
      where: { id },
      data: prismaUpdateData,
    });

    Logger.log(`Chat ${chat.id} updated`, 'ChatsService');

    return chat;
  }

  async delete(id: string) {
    const chat = await this.prisma.chat.delete({
      where: {
        id,
      },
    });

    if (chat) {
      Logger.log(`Chat ${chat.id} deleted`, 'ChatsService');
    } else {
      Logger.log(`Chat ${id} not found`, 'ChatsService');
    }

    return chat;
  }
}
