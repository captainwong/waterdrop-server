import { User } from '@/modules/user/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Avatars } from '../const/avatars';

export const UsersFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.account = faker.internet.userName();
  user.avatar = faker.helpers.arrayElement(Avatars);
  user.desc = faker.lorem.sentence();
  user.name = faker.person.fullName();
  user.password = faker.internet.password();
  user.tel = faker.phone.number();
  user.smsCode = '1234';
  user.smsCodeCreatedAt = new Date();
  return user;
});
