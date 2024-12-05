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
import { UserEntity } from '../entity/user.entity';
import { registerDto } from '../dto/register.dto';

@Injectable()
export class userProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        registerDto,
        UserEntity,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
