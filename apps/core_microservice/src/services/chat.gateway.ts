import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatMessageDto } from '../../dto/create.message.dto';
import { AppJwtPayload, AuthService } from '../services/auth.service';
import { ChatsService } from '../services/chats.service';
import { MessageService } from '../services/message.service';

interface AuthenticatedSocket extends Socket {
  user: AppJwtPayload;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly authService: AuthService,
    private readonly messageService: MessageService,
    private readonly chatsService: ChatsService,
  ) {}

  afterInit() {
    this.logger.log(`Chat gateway initialized`);
  }

  async handleConnection(client: AuthenticatedSocket) {
    const token =
      (client.handshake.auth?.token as string | undefined) ||
      client.handshake.headers['authorization'] ||
      client.handshake.headers.cookie?.match(/accessToken=([^;]+)/)?.[1];

    if (!token) {
      this.logger.warn('Connection without token. Disconnecting.');
      client.disconnect();
      return;
    }

    try {
      const { isValid, tokenPayload } =
        await this.authService.validateToken(token);
      if (!isValid) {
        this.logger.warn('Invalid token. Disconnecting.');
        client.disconnect();
        return;
      }
      client.user = tokenPayload;
      this.logger.log(
        `Client connected: ${client.id} - Profile: ${client.user.profileId}`,
      );

      const userChats = await this.chatsService.getChatsForProfile(
        client.user.profileId,
      );

      for (const chat of userChats) {
        await client.join(chat.id);
      }

      this.logger.log(
        `User ${client.user.profileId} joined ${userChats.length} chat rooms.`,
      );
    } catch (error) {
      this.logger.error('Authentication failed', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.user) {
      this.logger.log(
        `Client disconnected: ${client.id} - Profile: ${client.user.profileId}`,
      );
    } else {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() payload: CreateChatMessageDto & { chatId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const message = await this.messageService.create(
      payload,
      client.user.profileId,
      client.user.userId,
    );

    this.server.to(payload.chatId).emit('newMessage', message);
    this.logger.log(
      `Profile ${client.user.profileId} sent message to chat ${payload.chatId}`,
    );
    return message;
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @MessageBody() payload: { messageId: string; content: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const messageToUpdate = await this.messageService.getById(
      payload.messageId,
    );

    if (!messageToUpdate) {
      throw new Error('message not found');
    }

    if (!(messageToUpdate.profileId == client.user.profileId)) {
      throw new Error('not authorized');
    }

    const updatedMessage = await this.messageService.update(payload.messageId, {
      content: payload.content,
    });

    if (messageToUpdate.chatId) {
      this.server
        .to(messageToUpdate.chatId)
        .emit('messageUpdated', updatedMessage);
    }
    return updatedMessage;
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody() payload: { messageId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const messageToDelete = await this.messageService.getById(
      payload.messageId,
    );

    if (!messageToDelete) {
      throw new Error('message not found');
    }

    if (!(messageToDelete.profileId == client.user.profileId)) {
      throw new Error('not authorized');
    }

    await this.messageService.delete(payload.messageId);

    if (messageToDelete.chatId) {
      this.server.to(messageToDelete.chatId).emit('messageDeleted', {
        messageId: payload.messageId,
        chatId: messageToDelete.chatId,
      });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() { chatId }: { chatId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.to(chatId).emit('typing', {
      profileId: client.user.profileId,
      chatId: chatId,
    });
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @MessageBody() { chatId }: { chatId: string },
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    client.to(chatId).emit('stopTyping', {
      profileId: client.user.profileId,
      chatId: chatId,
    });
  }
}
