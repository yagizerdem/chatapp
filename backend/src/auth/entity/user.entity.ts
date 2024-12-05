import { PrimaryGeneratedColumn, Column, Entity, OneToOne } from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { ProfileEntity } from 'src/profile/entity/profile.entity';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  @AutoMap()
  firstName: string;

  @Column({ type: 'varchar', length: 150 })
  @AutoMap()
  lastName: string;

  @Column({ type: 'varchar', length: 150, select: false })
  @AutoMap()
  password: string;

  @Column({ unique: true })
  @AutoMap()
  email: string;

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  profile: ProfileEntity;
}
