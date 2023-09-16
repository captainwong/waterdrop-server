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

  @Mutation(() => Boolean, { description: 'Update user by id' })
  async updateUser(@Args('id') id: number, @Args('params') params: UserInputDto): Promise<Boolean> {
    return await this.userService.update(id, params) ? true : false;
  }

  @Mutation(() => Boolean, { description: 'Delete user by id' })
  async deleteUser(@Args('id') id: number): Promise<Boolean> {
    return await this.userService.remove(id) ? true : false;
  }
}
