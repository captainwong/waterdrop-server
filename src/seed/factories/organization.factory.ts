import { Organization } from '@/modules/organization/entities/organization.entity';
import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Avatars } from '../const/avatars';
import { Location } from '../const/location';
import { Tags } from '../const/tags';
import { CompanyDescs } from '../const/descs';

export const OrganizationFactory = setSeederFactory(
  Organization,
  (faker: Faker) => {
    const organization = new Organization();
    organization.address = faker.location.streetAddress();
    organization.businessLicense = faker.helpers.arrayElement(Avatars);
    organization.desc = faker.helpers
      .arrayElements(CompanyDescs, { min: 5, max: 10 })
      .join('<br />');
    organization.identityCardBackImg = faker.helpers.arrayElement(Avatars);
    organization.identityCardFrontImg = faker.helpers.arrayElement(Avatars);
    organization.latitude = faker.location
      .latitude(Location.latitudeMax, Location.latitudeMin, 6)
      .toString();
    organization.longitude = faker.location
      .longitude(Location.longitudeMax, Location.longitudeMin, 6)
      .toString();
    organization.logo = faker.helpers.arrayElement(Avatars);
    organization.name = faker.company.name();
    organization.tags = faker.helpers
      .arrayElements(Tags, { min: 1, max: 3 })
      .join(',');
    organization.tel = faker.phone.number();

    return organization;
  },
);
