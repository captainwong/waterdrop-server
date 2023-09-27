import { Module } from '@nestjs/common';
import { OrganizationResolver } from './organization.resolver';
import { OrganizationService } from './organization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { ConfigModule } from '@nestjs/config';
import { OrganizationImage } from './entities/organization-image.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Organization, OrganizationImage]),
  ],
  providers: [OrganizationResolver, OrganizationService],
})
export class OrganizationModule {}
