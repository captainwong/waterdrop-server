import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions, runSeeders } from 'typeorm-extension';
import { config } from 'dotenv';
import { Card } from '@/modules/card/entities/card.entity';
import { Course } from '@/modules/course/entities/course.entity';
import { OrganizationImage } from '@/modules/organization/entities/organization-image.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { Product } from '@/modules/product/entities/product.entity';
import { Student } from '@/modules/student/entities/student.entity';
import { CardFactory } from './factories/card.factory';
import { CourseFactory } from './factories/course.factory';
import { OrganizationImageFactory } from './factories/organization-images.factory';
import { OrganizationFactory } from './factories/organization.factory';
import { ProductFactory } from './factories/product.factory';
import { StudentFactory } from './factories/student.factory';
import MainSeeder from './seeders/main.seeder';
import { Teacher } from '@/modules/teacher/entities/teacher.entity';
import { User } from '@/modules/user/entities/user.entity';
import { UsersFactory } from './factories/user.factory';
import { TeacherFactory } from './factories/teacher.factory';

config();

const options: DataSourceOptions & SeederOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'test',
  entities: [
    Card,
    Course,
    OrganizationImage,
    Organization,
    Product,
    Student,
    Teacher,
    User,
  ],
  logging: false,

  // additional config options brought by typeorm-extension
  factories: [
    CardFactory,
    CourseFactory,
    OrganizationImageFactory,
    OrganizationFactory,
    ProductFactory,
    StudentFactory,
    UsersFactory,
    TeacherFactory,
  ],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
