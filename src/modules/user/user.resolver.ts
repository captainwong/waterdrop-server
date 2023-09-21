import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserTypeDto } from './dto/user-type.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { Result } from '@/common/dto/result.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => Boolean, { description: 'Create user' })
  async createUser(@Args('params') params: CreateUserDto): Promise<boolean> {
    console.log('createUser', params);
    const user = await this.userService.create(params);
    return user ? true : false;
  }

  @Query(() => UserTypeDto, { description: 'Find user by id' })
  async findOne(@Args('id') id: number): Promise<UserTypeDto> {
    return await this.userService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => UserTypeDto, { description: 'Find user by id' })
  async getUserInfo(@Context() ctx: any): Promise<UserTypeDto> {
    // console.log('getUserInfo', ctx);
    const id = ctx.req.user.id;
    return await this.userService.findOne(id);
  }

  @Query(() => UserTypeDto, { description: 'Find user by tel' })
  async findOneByTel(@Args('tel') tel: string): Promise<UserTypeDto> {
    return await this.userService.findOneByTel(tel);
  }

  @Mutation(() => Result, { description: 'Update user by id' })
  async updateUserInfo(
    @Args('id') id: number,
    @Args('params') params: UpdateUserDto,
  ): Promise<Result> {
    return await this.userService.update(id, params);
  }

  @Mutation(() => Boolean, { description: 'Update user sms code by id' })
  async updateUserSmsCode(
    @Args('id') id: number,
    @Args('code') code: string,
  ): Promise<boolean> {
    return (await this.userService.updateSmsCode(id, code)) ? true : false;
  }

  @Mutation(() => Boolean, { description: 'Delete user by id' })
  async deleteUser(@Args('id') id: number): Promise<boolean> {
    return (await this.userService.remove(id)) ? true : false;
  }
}
