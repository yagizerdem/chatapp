import { HttpStatus, Injectable, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/profile/entity/profile.entity';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from '../profile/profile.service';
import AppError from 'src/utility/AppError';
import ServiceResponseDto from './dto/serviceResponse.dto';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { ContactRequestEntity } from './entity/contactRequest.entity';
import { Repository } from 'typeorm';
import { ContactRequestState } from './enum/ContactRequestState.enum';
import { ContactEntity } from './entity/contact.entity';
import { UserEntity } from 'src/auth/entity/user.entity';

@Injectable()
export class ContactService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly ProfileService: ProfileService,
    @InjectMapper() private readonly classMapper: Mapper,
    @InjectRepository(ContactRequestEntity)
    private readonly contactRequestRepository: Repository<ContactRequestEntity>, // Inject ContactEntity repository
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>, // Inject ContactEntity repository
    @InjectRepository(ContactEntity)
    private readonly contactRepository: Repository<ContactEntity>, // Inject ContactEntity repository
  ) {}

  async createContactRequest(
    fromUserId: number,
    destProfileId: number,
  ): Promise<ServiceResponseDto<ContactRequestEntity>> {
    try {
      const fromUserProfile: ProfileEntity = (
        await this.ProfileService.getByUserId(fromUserId)
      ).data;

      // validation pipe line
      if (!fromUserProfile) {
        throw new AppError('profile dont exist', true, 404);
      }
      if (fromUserProfile.id == destProfileId) {
        throw new AppError('cant send request to own profile', true, 404);
      }

      const contactFromDb = await this.contactRequestRepository
        .createQueryBuilder()
        .where('fromProfileId = :fromId', {
          fromId: fromUserProfile.id,
        })
        .andWhere('destProfileId = :destId', { destId: destProfileId })
        .andWhere('state = :state', {
          state: ContactRequestState.PENDING,
        })
        .getOne();

      if (contactFromDb) {
        throw new AppError('contact already send', true, 400);
      }

      // crate entity
      const newContactRequestEntity = new ContactRequestEntity();
      newContactRequestEntity.fromProfileId = fromUserProfile.id;
      newContactRequestEntity.destProfileId = destProfileId;
      newContactRequestEntity.state = ContactRequestState.PENDING;

      const insertResult = await this.contactRequestRepository.save(
        newContactRequestEntity,
      );

      const response = ServiceResponseDto.success<ContactRequestEntity>(
        'request send successfully',
        insertResult,
      );
      return response;
    } catch (error) {
      let message =
        error instanceof AppError ? error.message : 'internal server error';
      const response = ServiceResponseDto.fail<ContactRequestEntity>(message);
      response.error = error;
      return response;
    }
  }

  async rejectContactRequest(
    contactRequestId: number,
    destUserId: number,
  ): Promise<ServiceResponseDto<ContactRequestEntity>> {
    try {
      // get profile
      const destUserProfile: ProfileEntity = (
        await this.ProfileService.getByUserId(destUserId)
      ).data;

      if (!destUserProfile) {
        throw new AppError(
          'profile is not found',
          true,
          HttpStatus.BAD_REQUEST,
        );
      }

      const contactRequestFromdb: ContactRequestEntity =
        await this.contactRequestRepository.findOne({
          where: { id: contactRequestId }, // Filter by ID
          relations: ['destProfile'], // Include the 'destProfile' relationship
        });

      if (contactRequestFromdb.state != ContactRequestState.PENDING) {
        throw new AppError(
          'request already fullfilled',
          true,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!contactRequestFromdb) {
        throw new AppError(
          'contact request not found',
          true,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (contactRequestFromdb.destProfileId != destUserProfile.id) {
        throw new AppError(
          'this request is not current users',
          true,
          HttpStatus.UNAUTHORIZED,
        );
      }

      contactRequestFromdb.state = ContactRequestState.REJECTED;

      // Save the updated entity back to the database
      const result: ContactRequestEntity =
        await this.contactRequestRepository.save(contactRequestFromdb);

      const response = ServiceResponseDto.success<ContactRequestEntity>(
        'rejected successfully',
        result,
      );
      return response;

      return null;
    } catch (error) {
      const msg =
        error instanceof AppError ? error.message : 'internal server error';
      const response = ServiceResponseDto.fail<ContactRequestEntity>(msg);
      response.error = error;
      return response;
    }
  }

  async getAllContactReqeust(
    userId: number,
    page: number,
    limit: number,
  ): Promise<ServiceResponseDto<Array<ContactRequestEntity>>> {
    try {
      //   try get profile
      const profileFromDb: ProfileEntity = (
        await this.ProfileService.getByUserId(userId)
      )?.data;
      if (!profileFromDb) {
        throw new AppError('profile dont exist', true, HttpStatus.BAD_REQUEST);
      }

      const skip = (page - 1) * limit; // Calculate records to skip for pagination
      const result = await this.contactRequestRepository
        .createQueryBuilder('contacts')
        .leftJoinAndSelect('contacts.fromProfile', 'profile')
        .leftJoinAndSelect('profile.user', 'user') // Join user relationship from profile
        .where('contacts.destProfileId LIKE :text', {
          text: `%${profileFromDb.id}%`,
        })
        .andWhere('contacts.state = :state', {
          state: ContactRequestState.PENDING, // Enum value for pending state
        })
        .offset(skip) // Use offset for SQLite pagination
        .limit(limit) // Use limit for SQLite pagination
        .getMany();

      const response = ServiceResponseDto.success('data fetched', result);
      return response;
    } catch (error) {
      console.log(error);
      const message =
        error instanceof AppError ? error.message : 'internal server error';
      return ServiceResponseDto.fail(message);
    }
  }

  async acceptContactRequest(
    userId: number,
    contactRequestId: number,
  ): Promise<ServiceResponseDto<ContactRequestEntity>> {
    try {
      // check contasct request exist
      const contactRequest: ContactRequestEntity =
        await this.contactRequestRepository.findOneBy({ id: contactRequestId });

      if (!contactRequest) {
        throw new AppError(
          'contact request not found',
          true,
          HttpStatus.NOT_FOUND,
        );
      }

      //check profile exist
      const userProfileFromDb = (await this.ProfileService.getByUserId(userId))
        ?.data;
      if (!userProfileFromDb) {
        throw new AppError('profile not found', true, HttpStatus.NOT_FOUND);
      }

      // check contact request dest prfile id match with user profile id
      if (contactRequest.destProfileId != userProfileFromDb.id) {
        throw new AppError(
          'this request is not related with current user',
          true,
          HttpStatus.BAD_REQUEST,
        );
      }

      // check state of request
      if (contactRequest.state != ContactRequestState.PENDING) {
        throw new AppError(
          'this contact request is already fullfilled',
          true,
          HttpStatus.BAD_REQUEST,
        );
      }

      // change state to accepted
      contactRequest.state = ContactRequestState.ACCEPTED;
      await this.contactRequestRepository.save(contactRequest);

      const p1: ProfileEntity = userProfileFromDb;
      const p2: ProfileEntity = await this.profileRepository.findOneBy({
        id: contactRequest.fromProfileId,
      });

      // check contact table already has data
      const contactFromDb1 = await this.contactRepository
        .createQueryBuilder('contact')
        .where('contact.contactProfileId = :contactProfileId', {
          contactProfileId: p1.id,
        })
        .andWhere('contact.userProfileId = :userProfileId', {
          userProfileId: p2.id,
        })
        .getOne();
      if (contactFromDb1) {
        throw new AppError('already in contact', true, HttpStatus.BAD_REQUEST);
      }

      // insrting contact to talbe
      const contactEntity1 = new ContactEntity();
      contactEntity1.userProfile = p1;
      contactEntity1.contactProfile = p2;

      const contactEntity2 = new ContactEntity();
      contactEntity2.userProfile = p2;
      contactEntity2.contactProfile = p1;

      console.log('saving to db', contactEntity1, contactEntity2);
      await this.contactRepository.insert(contactEntity1);
      await this.contactRepository.insert(contactEntity2);

      return ServiceResponseDto.success<ContactRequestEntity>(
        'request accepted successfully',
        null,
      );
    } catch (error) {
      const message =
        error instanceof AppError ? error.message : 'internal server error';
      const response = ServiceResponseDto.fail<ContactRequestEntity>(message);
      response.error = error;
      return response;
    }
  }

  async getContactWithPagination(
    userId: number,
    page: number,
    limit: number,
  ): Promise<ServiceResponseDto<Array<ContactEntity>>> {
    try {
      const profileFromDb = (await this.ProfileService.getByUserId(userId))
        ?.data;

      if (!profileFromDb) {
        throw new AppError('profile not found', true, HttpStatus.BAD_REQUEST);
      }

      const skip = (page - 1) * limit;

      const contactsFromDb: Array<ContactEntity> = await this.contactRepository
        .createQueryBuilder('contact')
        .leftJoinAndSelect('contact.contactProfile', 'Profile') // Join userProfile relation
        .leftJoinAndSelect('Profile.user', 'User')
        .where('contact.userProfileId = :userProfileId', {
          userProfileId: profileFromDb.id,
        })
        .offset(skip)
        .take(limit)
        .getMany();

      const reponse = ServiceResponseDto.success(
        'data fetch successfully',
        contactsFromDb,
      );
      return reponse;
    } catch (error) {
      console.log(error);
      const message =
        error instanceof AppError ? error.message : 'internal server error';
      const response = ServiceResponseDto.fail<Array<ContactEntity>>(message);
      response.error = error;
      return response;
    }

    return null;
  }
}
