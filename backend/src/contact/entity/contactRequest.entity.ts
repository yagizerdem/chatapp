import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ProfileEntity } from '../../profile/entity/profile.entity';
import { ContactRequestState } from '../enum/ContactRequestState.enum';

@Entity('ContactRequest')
export class ContactRequestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({ name: 'fromProfileId' }) // Links to `ProfileEntity` for the "from" profile
  fromProfile: ProfileEntity;

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({ name: 'destProfileId' }) // Links to `ProfileEntity` for the "destination" profile
  destProfile: ProfileEntity;

  @CreateDateColumn({ type: 'text' }) // Automatically generates the current date
  createdAt: Date;

  @Column({
    type: 'text',
    length: 1,
    default: ContactRequestState.PENDING,
    nullable: false,
  })
  state: ContactRequestState;

  @Column() // Explicitly store the foreign key
  fromProfileId: number;

  @Column() // Explicitly store the foreign key
  destProfileId: number;
}
