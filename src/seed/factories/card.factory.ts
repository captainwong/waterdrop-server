import { setSeederFactory } from 'typeorm-extension';
import { Faker } from '@faker-js/faker';
import { Card } from '@/modules/card/entities/card.entity';
import { CardType } from '@/common/const/enum';

export const CardFactory = setSeederFactory(Card, (faker: Faker) => {
  const entity = new Card();
  entity.duration = faker.number.int({ min: 10, max: 100 });
  entity.type = faker.helpers.arrayElement([CardType.COUNT, CardType.DURATION]);
  if (entity.type === CardType.COUNT) {
    entity.name = '次卡';
    entity.count = faker.number.int({ min: 10, max: 100 });
  } else {
    entity.name = '日卡';
    entity.count = 0;
  }

  return entity;
});
