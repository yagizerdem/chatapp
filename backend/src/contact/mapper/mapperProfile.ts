import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  ignore,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { ContactRequestEntity } from '../entity/contactRequest.entity';
import { ContactRequestDto } from '../dto/contactRequest.dto';

@Injectable()
export class userProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, ContactRequestDto, ContactRequestEntity);
    };
  }
}
