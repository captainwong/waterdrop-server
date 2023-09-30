import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Product } from '@/modules/product/entities/product.entity';
import { ProductStatus } from '@/common/const/enum';
import { Avatars } from '../const/avatars';
import { CategoryList } from '@/modules/product/dto/category-type';

export const ProductFactory = setSeederFactory(Product, (faker: Faker) => {
  const entity = new Product();
  const discount = faker.number.float({ min: 50, max: 90, precision: 2 }) / 100;
  const price = faker.number.float({ min: 100, max: 10000, precision: 2 });
  const courseKeys = CategoryList.map((item) => item.key);
  const courseKey = faker.helpers.arrayElement(courseKeys);

  entity.originalPrice = price.toFixed(2).toString();
  entity.price = (price * discount).toFixed(2).toString();
  entity.status = ProductStatus.ON_SAIL;
  entity.banner = faker.helpers.arrayElement(Avatars);
  entity.category = courseKey;
  entity.cover = faker.helpers.arrayElement(Avatars);
  entity.desc = faker.lorem.sentence();
  entity.name = faker.commerce.productName();
  entity.limit = faker.number.int({ min: 20, max: 60 });
  entity.stock = faker.number.int({ min: 100, max: 600 });
  return entity;
});
