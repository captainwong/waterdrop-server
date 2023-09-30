import { OrganizationImage } from '@/modules/organization/entities/organization-image.entity';
import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Avatars } from '../const/avatars';

export const OrganizationImageFactory = setSeederFactory(
  OrganizationImage,
  (faker: Faker) => {
    const img = new OrganizationImage();
    img.remark = faker.lorem.sentence();
    img.url = faker.helpers.arrayElement(Avatars);
    return img;
  },
);
