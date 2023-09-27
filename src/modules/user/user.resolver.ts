import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserInputDto } from './dto/user-input.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { UserResult } from './dto/user-result';
import {
  CREATE_USER_FAILED,
  SUCCESS,
  USER_NOT_EXISTS,
} from '@/common/const/code';
import { CodeMsg } from '@/common/const/message';
import { CurrentTokenId } from '@/common/decorators/current-token-id.decorator';

@TokenEntity('user')
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserResult, { description: 'Create user' })
  async createUser(@Args('dto') dto: UserInputDto): Promise<UserResult> {
    console.log('createUser', dto);
    const user = await this.userService.create(dto);
    return user
      ? {
          code: SUCCESS,
          message: CodeMsg(SUCCESS),
          data: user,
        }
      : {
          code: CREATE_USER_FAILED,
          message: CodeMsg(CREATE_USER_FAILED),
        };
  }

  @Query(() => UserResult, { description: 'Find user by id' })
  async getUser(@Args('id') id: string): Promise<UserResult> {
    const user = await this.userService.findOne(id);
    return user
      ? {
          code: SUCCESS,
          message: CodeMsg(SUCCESS),
          data: user,
        }
      : {
          code: USER_NOT_EXISTS,
          message: CodeMsg(USER_NOT_EXISTS),
        };
  }

  @UseGuards(GqlAuthGuard, TokenEntityGuard)
  @Query(() => UserResult, { description: 'Find user by token' })
  async getUserByToken(@CurrentTokenId('id') id: string): Promise<UserResult> {
    const user = await this.userService.findOne(id);
    return user
      ? {
          code: SUCCESS,
          message: CodeMsg(SUCCESS),
          data: user,
        }
      : {
          code: USER_NOT_EXISTS,
          message: CodeMsg(USER_NOT_EXISTS),
        };
  }

  @Query(() => UserResult, { description: 'Find user by tel' })
  async getUserByTel(@Args('tel') tel: string): Promise<UserResult> {
    const user = await this.userService.findOneByTel(tel);
    return user
      ? {
          code: SUCCESS,
          message: CodeMsg(SUCCESS),
          data: user,
        }
      : {
          code: USER_NOT_EXISTS,
          message: CodeMsg(USER_NOT_EXISTS),
        };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserResult, { description: 'Update user by token' })
  async updateUserByToken(
    @CurrentTokenId('id') id: string,
    @Args('dto') dto: UserInputDto,
  ): Promise<UserResult> {
    const user = await this.userService.update(id, dto);
    return user
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: user }
      : {
          code: USER_NOT_EXISTS,
          message: CodeMsg(USER_NOT_EXISTS),
        };
  }

  @Mutation(() => Boolean, { description: 'Delete user by id' })
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    return (await this.userService.remove(id)) ? true : false;
  }
}
