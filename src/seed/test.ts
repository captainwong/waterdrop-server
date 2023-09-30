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
