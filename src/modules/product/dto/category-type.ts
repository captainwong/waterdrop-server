import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryType {
  @Field({ description: '分类名称' })
  name: string;

  @Field({ description: 'key' })
  key: string;
}

export const CategoryList = [
  {
    key: 'music',
    name: '音乐',
  },
  {
    key: 'art',
    name: '美术',
  },
  {
    key: 'dance',
    name: '舞蹈',
  },
  {
    key: 'english',
    name: '英语',
  },
  {
    key: 'chinese',
    name: '语文',
  },
  {
    key: 'math',
    name: '数学',
  },
  {
    key: 'science',
    name: '科学',
  },
  {
    key: 'cook',
    name: '烹饪',
  },
  {
    key: 'sport',
    name: '运动',
  },
  {
    key: 'programming',
    name: '编程',
  },
  {
    key: 'other',
    name: '其他',
  },
];
