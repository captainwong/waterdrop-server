import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Student } from '@/modules/student/entities/student.entity';
import { Avatars } from '../const/avatars';

export const StudentFactory = setSeederFactory(Student, (faker: Faker) => {
  const entity = new Student();
  entity.account = faker.internet.userName();
  entity.avatar = faker.helpers.arrayElement(Avatars);
  entity.name = faker.person.fullName();
  entity.password = faker.internet.password();
  entity.tel = faker.phone.number();
  return entity;
});
