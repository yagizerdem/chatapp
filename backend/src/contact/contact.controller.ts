import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Public } from 'src/utility/decorators/public.decorator';
import { ContactRequestDto } from './dto/contactRequest.dto';
import { ContactService } from './contact.service';
import ServiceResponseDto from './dto/serviceResponse.dto';
import { ContactRequestEntity } from './entity/contactRequest.entity';
import ApiResponse from 'src/utility/ApiResponse';
import { Request } from 'express';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}
  @Post('/contactrequest')
  async sendContactRequest(
    @Body() contactRequestDto: ContactRequestDto,
    @Req() request: Request,
  ) {
    const userId = request['user'].id;

    const responseFromService: ServiceResponseDto<ContactRequestEntity> =
      await this.contactService.createContactRequest(
        userId,
        contactRequestDto.destProfileId,
      );

    if (responseFromService.error) {
      throw responseFromService.error;
    }
    const response = new ApiResponse(
      HttpStatus.OK,
      responseFromService.message,
      request.path,
      responseFromService.data,
    );

    return response;
  }

  // with pagination
  @Get('/contactRequest')
  async getContactRequest(
    @Req() request: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    const userId = request['user']['id'];
    const result: ServiceResponseDto<Array<ContactRequestEntity>> =
      await this.contactService.getAllContactReqeust(
        userId,
        Number(page),
        Number(limit),
      );
    const response = new ApiResponse(
      200,
      result.message,
      request.path,
      result.data,
    );

    return response;
  }

  @Post('/rejectrequest')
  async rejectContactRequest(
    @Query('contactRequestId') contactRequestId: number,
    @Req() request: Request,
  ) {
    const userId = request['user']['id'];
    const result: ServiceResponseDto<ContactRequestEntity> =
      await this.contactService.rejectContactRequest(contactRequestId, userId);

    if (result.error) {
      throw result.error;
    }

    const response = new ApiResponse(
      HttpStatus.OK,
      result.message,
      request.path,
      result.data,
    );
    return response;
    // implement body
  }
  @Post('/acceptrequest')
  async acceptContactRequest(
    @Query('contactRequestId') contactRequestId: number,
    @Req() request: Request,
  ) {
    const userId = request['user'].id;

    const result: ServiceResponseDto<ContactRequestEntity> =
      await this.contactService.acceptContactRequest(userId, contactRequestId);

    if (result.error) {
      throw result.error;
    }

    const response = new ApiResponse(
      HttpStatus.OK,
      result.message,
      request.path,
      result.data,
    );

    return response;
  }

  @Get('/contact')
  async getContact(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() request: Request,
  ) {
    const userId = request['user'].id;
    const result = await this.contactService.getContactWithPagination(
      userId,
      page,
      limit,
    );
    if (result.error) {
      throw result.error;
    }

    const response = new ApiResponse(
      HttpStatus.OK,
      result.message,
      request.path,
      result.data,
    );

    return response;
  }
}
