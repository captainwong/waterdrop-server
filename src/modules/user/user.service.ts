import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { Result } from '@/common/dto/result.dto';
import { SUCCESS } from '@/common/const/code';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<User>> {
    //return await this.userRepository.find();
    return paginate(query, this.userRepository, {
      sortableColumns: ['id', 'name'],
      defaultSortBy: [['id', 'ASC']],
      searchableColumns: ['name'],
      select: ['id', 'name', 'desc', 'tel', 'account'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findOneByTel(tel: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { tel: tel } });
    return user;
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
    }
  }

  async update(id: string, user: UpdateUserDto): Promise<Result> {
    await this.userRepository.update(id, user);
    return {
      code: SUCCESS,
    };
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
