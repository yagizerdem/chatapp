import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ProfileModule } from 'src/profile/profile.module';
import { ContactRequestEntity } from './entity/contactRequest.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { ContactEntity } from './entity/contact.entity';
import { ProfileEntity } from 'src/profile/entity/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactRequestEntity]),
    TypeOrmModule.forFeature([ContactEntity]),
    TypeOrmModule.forFeature([ProfileEntity]),
    AutomapperModule,
    ProfileModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
