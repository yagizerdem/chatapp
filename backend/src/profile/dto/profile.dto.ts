import { AutoMap } from '@automapper/classes';
import { autoMap } from '@automapper/core';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
  MaxLength,
  Matches,
  IsNumber,
  IsOptional,
} from 'class-validator';
export class ProfileDto {
  @AutoMap()
  id: number;

  @AutoMap()
  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @AutoMap()
  @IsOptional()
  biography: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  profileBase64: string;

  @AutoMap()
  userId: number;
}
export default ProfileDto;
