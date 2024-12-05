import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SocketAuthMiddleware } from './SocketAuthMiddleware';

@Module({
  providers: [SocketGateway, SocketService, SocketAuthMiddleware],
})
export class SocketModule {}
