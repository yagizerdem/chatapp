import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { AutoMap } from '@automapper/classes';

export class registerDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  @IsString()
  @AutoMap()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @AutoMap()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)

  //   @Matches(
  //     /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$/,
  //     {
  //       message: `
  //         Ensure string has two uppercase letters.
  //         Ensure string has one special case letter.
  //         Ensure string has two digits.
  //         Ensure string has three lowercase letters.
  //         Ensure string is of length 8.
  //         `,
  //     },
  //   )
  @IsStrongPassword()
  @AutoMap()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @AutoMap()
  email: string;
}
