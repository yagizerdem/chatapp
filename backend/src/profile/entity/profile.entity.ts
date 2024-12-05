import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  RelationId,
  OneToMany,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { UserEntity } from 'src/auth/entity/user.entity';
import { ContactRequestEntity } from 'src/contact/entity/contactRequest.entity';
import { ContactEntity } from 'src/contact/entity/contact.entity';

@Entity('Profile')
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: true, unique: false })
  @AutoMap()
  address: string;

  @Column({ type: 'varchar', length: 1000, nullable: true, unique: false })
  @AutoMap()
  biography: string;

  @Column({ type: 'varchar', nullable: true, unique: false })
  @AutoMap()
  profileBase64: string;

  @OneToOne(() => UserEntity, (user) => user.profile, {
    nullable: false,
  })
  @JoinColumn() // Indicates that this side holds the foreign key
  user: UserEntity;

  // Add this property to access the userId directly
  @RelationId((profile: ProfileEntity) => profile.user)
  @AutoMap()
  userId: number;

  @OneToMany(
    () => ContactRequestEntity,
    (contactRequest) => contactRequest.fromProfile,
  )
  sentRequests: Promise<ContactRequestEntity[]>;

  @OneToMany(() => ContactEntity, (contact) => contact.userProfile)
  sentContacts: Promise<ContactEntity[]>;

  @OneToMany(() => ContactEntity, (contact) => contact.contactProfile)
  receivedContacts: Promise<ContactEntity[]>;
}
