import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ProfileEntity } from '../../profile/entity/profile.entity';

@Entity('Contact')
export class ContactEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({ name: 'userProfileId' }) // Links to `ProfileEntity` for the "from" profile
  userProfile: ProfileEntity;

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({ name: 'contactProfileId' }) // Links to `ProfileEntity` for the "destination" profile
  contactProfile: ProfileEntity;

  @CreateDateColumn({ type: 'text' }) // Automatically generates the current date
  createdAt: Date;

  @Column() // Explicitly store the foreign key
  userProfileId: number;

  @Column() // Explicitly store the foreign key
  contactProfileId: number;
}
