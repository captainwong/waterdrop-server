import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Avatars } from '../const/avatars';
import { Teacher } from '@/modules/teacher/entities/teacher.entity';
import { Tags } from '../const/tags';

export const TeacherFactory = setSeederFactory(Teacher, (faker: Faker) => {
  const entity = new Teacher();
  entity.createdAt = new Date();
  entity.name = faker.person.fullName();
  entity.photo = faker.helpers.arrayElement(Avatars);
  entity.teachingAge = faker.number.int({ min: 1, max: 30 });
  entity.education = faker.lorem.sentence();
  entity.seniority = faker.lorem.sentence();
  entity.experience = faker.lorem.sentence();
  entity.award = faker.lorem.sentence();
  entity.tags = faker.helpers.arrayElements(Tags, { min: 1, max: 3 }).join(',');
  return entity;
});
