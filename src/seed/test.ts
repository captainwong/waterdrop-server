import { CategoryList } from '@/modules/product/dto/category-type';
import { hash } from '@/utils/hash';
import { Faker, zh_CN, en } from '@faker-js/faker';

const faker = new Faker({
  locale: [zh_CN, en],
});

const discount = faker.number.float({ min: 50, max: 90, precision: 2 }) / 100;
console.log({ discount });

let fprice = faker.number.float({ min: 100, max: 10000, precision: 2 });
console.log({ fprice });
const originalPrice = fprice.toFixed(2).toString();
console.log({ fprice, originalPrice });
fprice = fprice * discount;
console.log({ fprice });

const price = fprice.toFixed(2).toString();

console.log({ fprice, originalPrice, price });

let name: string[] = [];

name.push('abc');
name.push('abc');
for (let i = 0; i < 5; i++) {
  const productName = faker.commerce.productName();
  name.push(productName);
  console.log({ name, productName });
}
name = name.filter((item, index) => name.indexOf(item) === index);

console.log({ name });

async function test() {
  const pwd = await hash('e10adc3949ba59abbe56e057f20f883e');
  console.log({ pwd });

  // const enums = CategoryList.reduce((key, name) => ({ key: item.key, text: item.name })),
  // console.log(enums, enums);

  // convert CategoryList to object with key and text
  const enums = CategoryList.reduce((acc, item) => {
    acc[item.key] = {
      text: item.name,
    };
    return acc;
  }, {});
  console.log('enums', enums);
}

test();
