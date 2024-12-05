import { Injectable, UseFilters } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { registerDto } from './dto/register.dto';
import AppError from 'src/utility/AppError';
import RegisterResult from './dto/registerResult.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/login.dto';
import LogInResult from './dto/loginResult.dto';
import { JwtService } from '@nestjs/jwt';
import UserCredentials from './dto/userCredentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectMapper() private readonly classMapper: Mapper,
    private readonly jwtService: JwtService,
  ) {}
  async register(dto: registerDto): Promise<RegisterResult> {
    // hash password
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(dto.password, saltOrRounds);
    const newUser = await this.classMapper.mapAsync(
      dto,
      registerDto,
      UserEntity,
    );
    newUser.password = hash; // secured password
    try {
      const result = await this.userRepository.insert(newUser);
    } catch (error) {
      // Handle specific SQLite errors
      if (error.code === 'SQLITE_CONSTRAINT') {
        const appError = new AppError('User already exists.', true, 409);
        const result = RegisterResult.fail(appError.message);
        result.error = appError;
        return result;
      }

      // Handle unexpected errors
      const appError = new AppError(
        'An unexpected error occurred.',
        false,
        500,
      );
      const result = RegisterResult.fail(appError.message);
      result.error = appError;
      return result;
    }
    return RegisterResult.success('user created succesfully');
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // Explicitly include the password field
      .where('user.email = :email', { email })
      .getOne();
  }

  async login(dto: loginDto): Promise<LogInResult<UserCredentials>> {
    const userFromDb = await this.findUserByEmail(dto.email);
    if (!userFromDb) {
      const appError = new AppError('User not exist.', true, 404);
      const result = LogInResult.fail<UserCredentials>(appError.message);
      result.error = appError;
      return result;
    }

    const flag: boolean = await bcrypt.compare(
      dto.password,
      userFromDb.password,
    );

    if (!flag) {
      const appError = new AppError('password dont match.', true, 404);
      const result = LogInResult.fail<UserCredentials>(appError.message);
      result.error = appError;
      return result;
    }
    // generate jwt
    const payload = {
      firstName: userFromDb.firstName,
      lastName: userFromDb.lastName,
      email: userFromDb.email,
      id: userFromDb.id,
    };
    const jwt_token = await this.jwtService.signAsync(payload);
    // return user credentials
    return LogInResult.success<UserCredentials>(
      'log in successfull',
      new UserCredentials({
        firstName: userFromDb.firstName,
        lastName: userFromDb.lastName,
        email: userFromDb.email,
        id: userFromDb.id,
        jwt: jwt_token,
      }),
    );
  }
}
