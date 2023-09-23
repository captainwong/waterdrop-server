import { SetMetadata } from '@nestjs/common';

export const ENTITY_KEY = 'entity';

export const Entity = (entity: string) => SetMetadata(ENTITY_KEY, entity);
