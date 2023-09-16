import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInputDto } from './dto/user-input.dto';
import { UserTypeDto } from './dto/user-type.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) { }
  
  @Mutation(() => Boolean, {description: 'Create user'})
  async createUser(@Args('params') params: UserInputDto): Promise<boolean> {
    console.log('createUser', params);
    const user = await this.userService.create(params);
    return user ? true : false;
  }

  @Query(() => UserTypeDto, {description: 'Find user by id'})
  async findOne(@Args('id') id: number): Promise<UserTypeDto> {
    return await this.userService.findOne(id);
  }
}
