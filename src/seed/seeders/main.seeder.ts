/* eslint-disable @typescript-eslint/no-unused-vars */
import { Organization } from '@/modules/organization/entities/organization.entity';
import { User } from '@/modules/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Faker, zh_CN, en } from '@faker-js/faker';
import { OrganizationImage } from '@/modules/organization/entities/organization-image.entity';
import { Student } from '@/modules/student/entities/student.entity';
import { Teacher } from '@/modules/teacher/entities/teacher.entity';
import { Course } from '@/modules/course/entities/course.entity';
import { Card } from '@/modules/card/entities/card.entity';
import { Product } from '@/modules/product/entities/product.entity';

const faker = new Faker({
  locale: [zh_CN, en],
});

const createUsers = async (
  count: number,
  factoryManager: SeederFactoryManager,
) => {
  console.time('creating users...');
  const userFactory = factoryManager.get(User);
  userFactory.setLocale(['zh_CN', 'en']);
  const me = await userFactory.make();
  me.name = 'admin';
  me.tel = '13385401630';
  me.password = '123456';
  me.id = '3d44569f-a9b9-4266-aafd-7a85f7c03419';
  await userFactory.save(me);

  if (count < 2) return [me];
  count -= 1;
  let users = [me];
  users = users.concat(await userFactory.saveMany(count));
  console.timeEnd('creating users...');
  return users;
};

const makeOrgImgs = async (
  count: number,
  factoryManager: SeederFactoryManager,
) => {
  console.time('creating org images...');
  const orgImgs = await Promise.all(
    Array(count)
      .fill('')
      .map(async () => {
        return await factoryManager.get(OrganizationImage).make();
      }),
  );
  console.timeEnd('creating org images...');
  return orgImgs;
};

const createOrgs = async (
  count: number,
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  users: User[],
) => {
  console.time('creating orgs...');
  const organizationFactory = factoryManager.get(Organization);
  organizationFactory.setLocale(['zh_CN', 'en']);
  let imgs = await makeOrgImgs(count * 9, factoryManager);

  const takeImgs = () => {
    const _imgs = imgs.slice(0, 3);
    imgs = imgs.slice(3);
    return _imgs;
  };

  const myOrgs = await Promise.all(
    Array(1)
      .fill('')
      .map(async () => {
        const org = await organizationFactory.make({
          name: '总店',
          createdBy: users[0].id,
          frontImgs: takeImgs(),
          roomImgs: takeImgs(),
          otherImgs: takeImgs(),
        });

        return org;
      }),
  );

  const orgs = await Promise.all(
    Array(count - 1)
      .fill('')
      .map(async () => {
        const org = await organizationFactory.make({
          createdBy: faker.helpers.arrayElement(users).id,
          frontImgs: takeImgs(),
          roomImgs: takeImgs(),
          otherImgs: takeImgs(),
        });

        return org;
      }),
  );

  let allOrgs = myOrgs.concat(orgs);
  const orgRepository = dataSource.getRepository(Organization);
  allOrgs = await orgRepository.save(allOrgs);
  console.timeEnd('creating orgs...');
  return allOrgs;
};

const createStudents = async (
  count: number,
  factoryManager: SeederFactoryManager,
) => {
  console.time('creating students...');
  const factory = factoryManager.get(Student);
  factory.setLocale(['zh_CN', 'en']);
  const me = await factory.make({
    account: 'captainwong',
    password: '123456',
    id: '02bed139-a8c8-48c9-a333-8f5f42844902',
  });
  await factory.save(me);

  if (count < 2) return [me];
  count -= 1;
  const students = await factory.saveMany(count);
  students.push(me);
  console.timeEnd('creating students...');
  return students;
};

const createTeachers = async (
  count: number,
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  orgs: Organization[],
) => {
  console.time('creating teachers...');
  const factory = factoryManager.get(Teacher);
  factory.setLocale(['zh_CN', 'en']);

  const myTeachers = await Promise.all(
    Array(Math.floor(count / 2))
      .fill('')
      .map(async () => {
        const teacher = await factory.make({
          organization: orgs[0],
        });
        return teacher;
      }),
  );
  const teachers = await Promise.all(
    Array(Math.floor(count / 2 + 1))
      .fill('')
      .map(async () => {
        const teacher = await factory.make({
          organization: faker.helpers.arrayElement(orgs),
        });
        return teacher;
      }),
  );
  let allTeachers = myTeachers.concat(teachers);
  const repo = dataSource.getRepository(Teacher);
  allTeachers = await repo.save(allTeachers);
  console.timeEnd('creating teachers...');
  return allTeachers;
};

const createCourseCards = async (
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  course: Course,
) => {
  // console.time('creating course cards...');
  const factory = factoryManager.get(Card);
  factory.setLocale(['zh_CN', 'en']);
  let allCards: Card[] = [];
  const repo = dataSource.getRepository(Card);
  const cards = await Promise.all(
    Array(faker.number.int({ min: 1, max: 3 }))
      .fill('')
      .map(async () => {
        const card = await factory.make({
          createdBy: course.createdBy,
          course: course,
          organization: course.organization,
        });
        return card;
      }),
  );
  allCards = allCards.concat(await repo.save(cards));
  course.cards = allCards;
  // console.timeEnd('creating course cards...');
  return course;
};

const createCourses = async (
  count: number,
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  orgs: Organization[],
) => {
  console.time('creating courses...');
  const factory = factoryManager.get(Course);
  factory.setLocale(['zh_CN', 'en']);
  const myCourses = await Promise.all(
    Array(Math.floor(count / 2))
      .fill('')
      .map(async () => {
        const course = await factory.make({
          organization: orgs[0],
          createdBy: orgs[0].createdBy,
        });
        return course;
      }),
  );
  const courses = await Promise.all(
    Array(Math.floor(count / 2 + 1))
      .fill('')
      .map(async () => {
        const org = faker.helpers.arrayElement(orgs);
        const course = await factory.make({
          organization: org,
          createdBy: org.createdBy,
        });
        return course;
      }),
  );
  let allCourses = myCourses.concat(courses);
  const repo = dataSource.getRepository(Course);
  allCourses = await repo.save(allCourses);

  const res: Course[] = [];
  for (const course of allCourses) {
    const courseWithCards = await createCourseCards(
      dataSource,
      factoryManager,
      course,
    );
    res.push(courseWithCards);
  }
  console.timeEnd('creating courses...');
  return res;
};

const createProducts = async (
  dataSource: DataSource,
  factoryManager: SeederFactoryManager,
  orgs: Organization[],
) => {
  console.time('creating products...');
  const factory = factoryManager.get(Product);
  factory.setLocale(['zh_CN', 'en']);
  let allProducts: Product[] = [];
  const repo = dataSource.getRepository(Product);
  for (const org of orgs) {
    const products = await Promise.all(
      Array(faker.number.int({ min: 3, max: 5 }))
        .fill('')
        .map(async () => {
          const product = await factory.make({
            createdBy: org.createdBy,
            organization: org,
          });
          return product;
        }),
    );
    allProducts = allProducts.concat(await repo.save(products));
  }
  console.timeEnd('creating products...');
  return allProducts;
};

const linkProductsAndCards = async (
  dataSource: DataSource,
  products: Product[],
  allCourses: Course[],
) => {
  console.time('linking products and cards...');
  const repo = dataSource.getRepository(Product);
  for (const product of products) {
    const courses = allCourses.filter(
      (course) => course.organization.id === product.organization.id,
    );
    const course = faker.helpers.arrayElement(courses);
    product.category = course.category;
    product.name = course.name;
    product.cards = [faker.helpers.arrayElement(course.cards)];
    await repo.save(product);
  }
  console.timeEnd('linking products and cards...');
};

export default class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.time('seeding done!');
    const FAKE_USERS = 3;
    const FAKE_ORGS = FAKE_USERS * 5;
    const FAKE_STUDENTS = 2;
    const FAKE_TEACHERS = FAKE_ORGS * 5;
    const FAKE_COURSES = FAKE_ORGS * 20;

    const users = await createUsers(FAKE_USERS, factoryManager);
    const orgs = await createOrgs(FAKE_ORGS, dataSource, factoryManager, users);
    await createStudents(FAKE_STUDENTS, factoryManager);
    await createTeachers(FAKE_TEACHERS, dataSource, factoryManager, orgs);
    const courses = await createCourses(
      FAKE_COURSES,
      dataSource,
      factoryManager,
      orgs,
    );
    const products = await createProducts(dataSource, factoryManager, orgs);
    await linkProductsAndCards(dataSource, products, courses);
    console.timeEnd('seeding done!');
    return true;
  }
}
