import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entity/profile.entity';
import { ProfileService } from './profile.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ProfileMapping } from './mapper/ProfileMapper';
import { UserEntity } from 'src/auth/entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfileEntity]),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    AuthModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileMapping],
  exports: [TypeOrmModule, ProfileService],
})
export class ProfileModule {}
