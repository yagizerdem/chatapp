import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
export class loginDto {
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  email: string;
}
export default loginDto;
