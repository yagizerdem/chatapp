import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { userProfile } from './mapper/userProfile';
import { AutomapperModule } from '@automapper/nestjs';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AutomapperModule,
    JwtModule.register({
      secret:
        process.env.JWTSECRET ||
        '69dc584dc3ec9df19b65b74c28c631a35cb910febe45befa648c46fb2691156d', // dont know why my process.env dont work here ?
      global: true,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    userProfile,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Register AuthGuard as a global guard
    },
  ],
  exports: [TypeOrmModule],
})
export class AuthModule {
  /**
   *
   */
  constructor() {}
}
