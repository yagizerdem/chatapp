import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
@Injectable()
export class SocketAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(socket: Socket, next: (err?: any) => void): void {
    try {
      // Extract the token from the WebSocket handshake headers
      const token = socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('Missing authorization token');
      }

      // Verify the token
      const payload = this.jwtService.verify(token);

      // Attach user data to the socket
      socket.data.user = payload;

      next(); // Allow the connection
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new UnauthorizedException('Invalid or expired token'));
    }
  }
}
