import { SetMetadata } from '@nestjs/common';

export const TOKEN_ENTITY_KEY = 'token_entity';

export const TokenEntity = (entity: string) =>
  SetMetadata(TOKEN_ENTITY_KEY, entity);
