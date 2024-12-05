import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ProfileEntity } from '../../profile/entity/profile.entity';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

@Entity('ContactRequest')
export class ContactRequestDto {
  @IsNumber()
  destProfileId: number;
}
