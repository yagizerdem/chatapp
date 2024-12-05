import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ProfileEntity } from './entity/profile.entity';
import { Repository } from 'typeorm';
import ProfileDto from './dto/profile.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserEntity } from 'src/auth/entity/user.entity';
import AppError from 'src/utility/AppError';
import createProfileResult from './dto/createProfileResult.dto';
import getProfileResult from './dto/getProfilesResult.dto';
import getBulkResult from './dto/getBulkResult.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity) // Inject the UserEntity repository
    private readonly userRepository: Repository<UserEntity>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}
  async getProfile(
    profileId: number,
  ): Promise<getProfileResult<ProfileEntity>> {
    try {
      if (!profileId) {
        throw new AppError('User dont registered', true, HttpStatus.NOT_FOUND);
      }

      const profile: ProfileEntity = await this.profileRepository.findOne({
        where: { id: profileId },
        relations: ['user'], // Ensure the `user` relation is loaded
      });

      if (!profile) {
        throw new AppError('profile dont exist');
      }

      const result = getProfileResult.success<ProfileEntity>(
        'profile found successfull',
        profile,
      );
      return result;
    } catch (error) {
      let errorMessage: string =
        error instanceof AppError ? error.message : 'internal server error';
      const result = getProfileResult.fail<ProfileEntity>(errorMessage);
      result.error = error;
      return result;
    }
  }

  async upsert(dto: ProfileDto): Promise<createProfileResult<ProfileEntity>> {
    const newProfile = await this.classMapper.mapAsync(
      dto,
      ProfileDto,
      ProfileEntity,
    );

    try {
      // check user exist in databae
      const userFromDb = await this.userRepository.findOneBy({
        id: newProfile.userId,
      });
      if (!userFromDb) {
        throw new AppError('User dont registered', true, HttpStatus.NOT_FOUND);
      }

      // find if profile exist
      const profileFromDb = await this.profileRepository.findOne({
        where: {
          user: { id: userFromDb.id }, // Query based on user relationship
        },
        relations: ['user'], // Ensure the `user` relation is loaded
      });
      if (profileFromDb) {
        newProfile.id = profileFromDb.id;
      }

      newProfile.user = userFromDb;
      const savedProfile = await this.profileRepository.save(newProfile);

      const result = createProfileResult.success<ProfileEntity>(
        !profileFromDb
          ? 'proifl inserted successfull'
          : 'profile updated successsfully',
        savedProfile,
      );

      return result;
    } catch (error) {
      console.log(error);
      // Handle specific SQLite errors
      if (error.code === 'SQLITE_CONSTRAINT') {
        const appError = new AppError('Profile already exists.', true, 409);
        const result = createProfileResult.fail<ProfileEntity>(
          appError.message,
        );
        result.error = appError;
        return result;
      }

      // Handle unexpected errors
      const appError = new AppError(
        'An unexpected error occurred.',
        false,
        500,
      );
      const result = createProfileResult.fail<ProfileEntity>(appError.message);
      result.error = appError;
      return result;
    }
  }
  async getProfileAsList(
    page: number,
    limit: number,
    username?: string,
  ): Promise<getBulkResult<ProfileEntity[]>> {
    try {
      const queryBuilder = this.profileRepository
        .createQueryBuilder('profile')
        .leftJoinAndSelect('profile.user', 'user')
        .addSelect([
          'user.id',
          'user.firstName',
          'user.lastName',
          'user.email',
        ]);
      if (username) {
        queryBuilder.where(
          `CONCAT(user.firstName, ' ', user.lastName) LIKE :username`,
          {
            username: `%${username}%`,
          },
        );
      }
      // pagination
      queryBuilder.skip((page - 1) * limit).take(limit);

      // Execute the query and get results and total count
      const [data, total] = await queryBuilder.getManyAndCount();

      const result = getBulkResult.success<ProfileEntity[]>(
        'users fetched',
        data,
      );

      return result;
    } catch (error) {
      const result = getBulkResult.fail<ProfileEntity[]>(
        'internal server error',
      );
      result.error = error;
      return result;
    }
  }

  async getByUserId(userId: number): Promise<getProfileResult<ProfileEntity>> {
    try {
      const queryBuilder = this.profileRepository
        .createQueryBuilder('profile')
        .leftJoinAndSelect('profile.user', 'user')
        .addSelect(['user.id', 'user.firstName', 'user.lastName', 'user.email'])
        .where('user.id = :userId', { userId });

      const profileFromDb = await queryBuilder.getOne();

      return getProfileResult.success<ProfileEntity>(
        !profileFromDb ? 'profile not created' : 'profile found',
        profileFromDb,
      );
    } catch (error) {
      var msg =
        error instanceof AppError ? error.message : 'internal sever error';
      const result = getProfileResult.fail<ProfileEntity>(msg);
      result.error = error;
      return result;
    }
  }
}
