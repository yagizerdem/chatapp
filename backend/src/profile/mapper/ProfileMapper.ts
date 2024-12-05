import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  ignore,
  mapFrom,
  Mapper,
  MappingProfile,
} from '@automapper/core';
import { ProfileEntity } from '../entity/profile.entity';
import ProfileDto from '../dto/profile.dto';

export class ProfileMapping extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, ProfileEntity, ProfileDto);
      createMap(mapper, ProfileDto, ProfileEntity);
    };
  }
}
