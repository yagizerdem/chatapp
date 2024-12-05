import {
  Controller,
  Get,
  Req,
  Query,
  Post,
  Body,
  HttpStatus,
} from '@nestjs/common';
import ApiResponse from 'src/utility/ApiResponse';
import { Public } from 'src/utility/decorators/public.decorator';
import ProfileDto from './dto/profile.dto';
import { ProfileService } from './profile.service';
import createProfileResult from './dto/createProfileResult.dto';
import { UserEntity } from 'src/auth/entity/user.entity';
import { ProfileEntity } from './entity/profile.entity';
import { Request } from 'express';
import getProfileResult from './dto/getProfilesResult.dto';
import AppError from 'src/utility/AppError';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get('/')
  @Public()
  async getProfile(
    @Query('profileId') profileId: number,
    @Req() request: Request,
  ): Promise<ApiResponse<any>> {
    const result: getProfileResult<ProfileEntity> =
      await this.profileService.getProfile(profileId);
    if (!result.success) {
      throw result.error;
    }

    return new ApiResponse(
      HttpStatus.OK,
      'profile found',
      request.path,
      result.data,
    );
  }
  @Get('getbulk')
  @Public()
  async searchProfileByName(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('userName') userName: string | null,
    @Req() request: Request,
  ) {
    if (!page || !limit) {
      throw new AppError('page and limit query required', true);
    }

    const result = await this.profileService.getProfileAsList(
      page,
      limit,
      userName,
    );

    const apiResponse = new ApiResponse(
      HttpStatus.OK,
      result.message,
      request.path,
      result.data,
    );
    return apiResponse;
  }

  @Get('/byUserId')
  @Public()
  async getProfileByUserId(
    @Query('userId') userId: number,
    @Req() request: Request,
  ): Promise<ApiResponse<any>> {
    const result: getProfileResult<ProfileEntity> =
      await this.profileService.getByUserId(userId);
    if (result.error) {
      throw result.error;
    }
    return new ApiResponse(
      HttpStatus.OK,
      result.message,
      request.path,
      result.data,
    );
  }
  @Post('/')
  async upsertProfile(
    @Body() profileDto: ProfileDto,
    @Req() request: Request,
  ): Promise<ApiResponse<any>> {
    const userId = request['user'].id;
    profileDto.userId = userId;
    const response: createProfileResult<ProfileEntity> =
      await this.profileService.upsert(profileDto);

    if (response.error) {
      throw response.error;
    }

    return new ApiResponse<ProfileEntity>(
      HttpStatus.OK,
      response.message,
      request.path,
      response.data,
    );
  }
}
