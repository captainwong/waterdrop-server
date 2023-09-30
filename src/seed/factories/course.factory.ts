import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Course } from '@/modules/course/entities/course.entity';
import { Avatars } from '../const/avatars';
import { TWeek } from '@/modules/course/dto/common-type.dto';
import * as dayjs from 'dayjs';
import { ProgrammingLanguages } from '../const/courses/programming-languages';
import { CategoryList } from '@/modules/product/dto/category-type';
import { ChineseCourses } from '../const/courses/chinese';
import { CookCourses } from '../const/courses/cook';
import { DanceCourses } from '../const/courses/dance';
import { EnglishCourses } from '../const/courses/english';
import { MathCourses } from '../const/courses/math';
import { MusicNames } from '../const/courses/music';
import { OtherCourses } from '../const/courses/other';
import { PaintingCourses } from '../const/courses/painting';
import { ScienceCousrses } from '../const/courses/science';
import { SportCourses } from '../const/courses/sport';

interface IWeekday {
  key: TWeek;
  label: string;
}

const WEEKDAYS: IWeekday[] = [
  {
    key: 'monday',
    label: '周一',
  },
  {
    key: 'tuesday',
    label: '周二',
  },
  {
    key: 'wednesday',
    label: '周三',
  },
  {
    key: 'thursday',
    label: '周四',
  },
  {
    key: 'friday',
    label: '周五',
  },
  {
    key: 'saturday',
    label: '周六',
  },
  {
    key: 'sunday',
    label: '周日',
  },
];

const randomReservableTimeSlots = (faker: Faker) => {
  const resavableTimeSlots = [];
  const weekdays = faker.helpers.arrayElements(WEEKDAYS, 5);
  const durations = [45, 60, 90, 120];

  weekdays.forEach((weekday) => {
    const slots = [];
    const h = ('0' + faker.number.int({ min: 8, max: 11 })).slice(-2);
    const start = dayjs(`2020-01-01T00:${h}:00.000Z`);
    const end = start.add(faker.helpers.arrayElement(durations), 'minutes');
    let key = 1;

    slots.push({
      key,
      start: start.format('HH:mm:ss'),
      end: end.format('HH:mm:ss'),
    });

    const maxEnd = end;
    for (let i = 0; i < faker.number.int({ min: 1, max: 3 }); i++) {
      const start = maxEnd.add(
        faker.helpers.arrayElement(durations),
        'minutes',
      );
      const end = start.add(faker.helpers.arrayElement(durations), 'minutes');
      key++;
      slots.push({
        key,
        start: start.format('HH:mm:ss'),
        end: end.format('HH:mm:ss'),
      });
    }

    resavableTimeSlots.push({
      weekday: weekday.key,
      slots,
    });
  });

  return resavableTimeSlots;
};

const randomProgrammingCourseName = (faker: Faker) => {
  return (
    faker.helpers.arrayElement(ProgrammingLanguages) +
    faker.helpers.arrayElement(['入门', '深入理解', '实战']) +
    '教程'
  );
};

const randomCourseName = (faker: Faker) => {
  const courseKeys = CategoryList.map((item) => item.key);
  for (let i = 0; i < 5; i += 1) {
    courseKeys.push('programming');
  }
  const category = faker.helpers.arrayElement(courseKeys);
  switch (category) {
    case 'programming':
      return { category, name: randomProgrammingCourseName(faker) };
    case 'chinese':
      return { category, name: faker.helpers.arrayElement(ChineseCourses) };
    case 'cook':
      return { category, name: faker.helpers.arrayElement(CookCourses) };
    case 'dance':
      return { category, name: faker.helpers.arrayElement(DanceCourses) };
    case 'english':
      return { category, name: faker.helpers.arrayElement(EnglishCourses) };
    case 'math':
      return { category, name: faker.helpers.arrayElement(MathCourses) };
    case 'music':
      return { category, name: faker.helpers.arrayElement(MusicNames) };
    case 'painting':
      return { category, name: faker.helpers.arrayElement(PaintingCourses) };
    case 'science':
      return { category, name: faker.helpers.arrayElement(ScienceCousrses) };
    case 'sport':
      return { category, name: faker.helpers.arrayElement(SportCourses) };
    case 'other':
    default:
      return {
        category: 'other',
        name: faker.helpers.arrayElement(OtherCourses),
      };
  }
};

export const CourseFactory = setSeederFactory(Course, (faker: Faker) => {
  const entity = new Course();
  const { category, name } = randomCourseName(faker);
  entity.baseAbility = faker.lorem.sentence();
  entity.cover = faker.helpers.arrayElement(Avatars);
  entity.desc = faker.lorem.sentence();
  entity.duration = faker.number.int({ min: 60, max: 120 });
  entity.group = faker.lorem.sentence();
  entity.limit = faker.number.int({ min: 20, max: 60 });
  entity.name = name;
  entity.category = category;
  entity.note = faker.lorem.sentence();
  entity.refund = '概不退款';
  entity.reservation = faker.lorem.sentence();
  entity.resavableTimeSlots = randomReservableTimeSlots(faker);
  return entity;
});
