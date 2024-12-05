import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { SocketAuthMiddleware } from './SocketAuthMiddleware';

@WebSocketGateway({
  cors: {
    origin: '*', // Allowed origins
    methods: ['GET', 'POST'], // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly socketAuthMiddleware: SocketAuthMiddleware,
  ) {}
  afterInit(server: Server): void {
    // Apply the authentication middleware to the Socket.IO server
    server.use((socket, next) => this.socketAuthMiddleware.use(socket, next));
  }
  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket);

    socket.on('sendMessage', (message, destUserId) => {
      this.socketService.sendMessage(socket, message, destUserId);
    });
  }

  handleDisconnect(socket: Socket): void {
    this.socketService.handleDisconnect(socket);
  }

  // Implement other Socket.IO event handlers and message handlers
}
