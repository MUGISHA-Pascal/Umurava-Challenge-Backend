import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from '../models/notification.model';
import { Model } from 'mongoose';

@WebSocketGateway({ cors:  '*' })
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, Socket>(); // Store connected clients

  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.clients.set(client.id, client); // Store client
    client.emit('connection_status', 'Connected to WebSocket server');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.clients.delete(client.id); // Remove client on disconnect
  }

  async sendNotification(userId: string, message: string) {
    await this.notificationModel.create({
      user: userId,
      message,
      isRead: false,
    });

    for (const client of this.clients.values()) {
      client.emit('notification', message);
    } 
  }

  @SubscribeMessage('mark-notifications-read')
  async notificationRead(@ConnectedSocket() client: Socket) {
    const updated = await this.notificationModel.updateMany(
      {},
      { $set: { isRead: true } },
    );
    console.log('working');
    if (updated) {
      console.log('Notification updated successfully');
      client.emit('notification-read', {
        message: 'Notification updated successfully',
      });
    }
  }

  @SubscribeMessage('broadcast-message')
  async BroadCastMessage(@MessageBody() message: string) {
    this.server.emit('notification', message);
    const broadcastNotification = await this.notificationModel.create({
      message,
      isRead: false,
    });
    console.log('broadcast ', message);
  }
}
