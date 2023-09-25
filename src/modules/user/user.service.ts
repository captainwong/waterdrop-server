import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserInputDto } from './dto/user-input.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // FIXME: 无法使用
  // async findAll(query: PaginateQuery): Promise<Paginated<User>> {
  //   //return await this.userRepository.find();
  //   return paginate(query, this.userRepository, {
  //     sortableColumns: ['id', 'name'],
  //     defaultSortBy: [['id', 'ASC']],
  //     searchableColumns: ['name'],
  //     select: ['id', 'name', 'desc', 'tel', 'account'],
  //   });
  // }

  async findOne(id: string): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findOneByTel(tel: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { tel: tel } });
    return user;
  }

  async create(user: UserInputDto): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
    }
  }

  async update(id: string, dto: UserInputDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      return null;
    }
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async updateSmsCode(id: string, code: string): Promise<User> {
    await this.userRepository.update(id, {
      smsCode: code,
      smsCodeCreatedAt: new Date(),
    });
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }
}
