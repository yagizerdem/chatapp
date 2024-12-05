import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<number, Socket> = new Map();
  handleConnection(socket: Socket): void {
    const userId: number = socket.data.user.id;
    this.connectedClients.set(userId, socket);
    console.log(`socket connected , userId : ${userId}`);
  }

  handleDisconnect(socket: Socket) {
    const userId: number = socket.data.user.id;
    this.connectedClients.delete(userId);
    console.log(`socket disconnected , userId : ${userId}`);
  }

  async logMessage() {}
  sendMessage(socket: Socket, message: string, destUserId: number) {
    const destSocket: Socket = this.connectedClients.get(destUserId);
    const fromUserId: number = socket.data.user.id;
    destSocket.emit('recieveChat', message, fromUserId);
  }

  // Add more methods for handling events, messages, etc.
}
