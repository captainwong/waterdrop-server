import { Module } from '@nestjs/common';
import { CardResolver } from './card.resolver';
import { CardService } from './card.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Card])],
  providers: [CardResolver, CardService],
})
export class CardModule {}
