import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { PartialProductInputDto } from './dto/product-input.dto';
import { CurrentTokenId } from '@/common/decorators/current-token-id.decorator';
import {
  CategoryResults,
  ProductResult,
  ProductResults,
} from './dto/product-result';
import {
  CREATE_PRODUCT_FAILED,
  PRODUCT_NOT_EXISTS,
  SUCCESS,
} from '@/common/const/code';
import { PageInput } from '@/common/dto/page-input.dto';
import { Result } from '@/common/dto/result.dto';
import { CodeMsg } from '@/common/const/message';
import { TokenEntity } from '@/common/decorators/token-entity.decorator';
import { TokenEntityGuard } from '@/common/guards/token-entity.guard';
import { ProductStatus } from '@/common/const/enum';
import { CurrentOrganizationId } from '@/common/decorators/current-organization.decorator';
import { CategoryList } from './dto/category-type';
import Decimal from 'decimal.js';

@TokenEntity('user')
@UseGuards(GqlAuthGuard, TokenEntityGuard)
@Resolver()
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => CategoryResults, { description: 'Find categories' })
  async getProductCategories(): Promise<CategoryResults> {
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: CategoryList,
    };
  }

  @Mutation(() => Result, { description: 'Create product' })
  async createOrUpdateProduct(
    @CurrentTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('dto') dto: PartialProductInputDto,
    @Args('id', { nullable: true }) id?: string,
  ): Promise<Result> {
    console.log('createOrUpdateProduct', userId, id);
    if (!id) {
      const product = await this.productService.create({
        ...dto,
        createdBy: userId,
        cards: [],
        status: ProductStatus.NOT_FOR_SAIL,
        price: dto.price ? new Decimal(dto.price).toString() : '0',
        originalPrice: dto.originalPrice
          ? new Decimal(dto.originalPrice).toString()
          : '0',
        organization: {
          id: organizationId,
        },
      });
      return product
        ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
        : {
            code: CREATE_PRODUCT_FAILED,
            message: CodeMsg(CREATE_PRODUCT_FAILED),
          };
    } else {
      const product = await this.productService.findOne(id);
      if (!product) {
        return {
          code: PRODUCT_NOT_EXISTS,
          message: CodeMsg(PRODUCT_NOT_EXISTS),
        };
      }

      const newProduct = {
        ...dto,
        cards: [],
        updatedBy: userId,
      };

      if (dto.cards?.length > 0) {
        newProduct.cards = dto.cards;
      } else {
        newProduct.cards = product.cards;
      }

      const res = await this.productService.update(id, newProduct);
      return res
        ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
        : {
            code: PRODUCT_NOT_EXISTS,
            message: CodeMsg(PRODUCT_NOT_EXISTS),
          };
    }
  }

  @Query(() => ProductResult, { description: 'Find product by id' })
  async getProductInfo(@Args('id') id: string): Promise<ProductResult> {
    const product = await this.productService.findOne(id);
    return product
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: product }
      : { code: PRODUCT_NOT_EXISTS, message: CodeMsg(PRODUCT_NOT_EXISTS) };
  }

  @Query(() => ProductResults, { description: 'Find products' })
  async getProducts(
    @CurrentTokenId('userId') userId: string,
    @Args('page') pageInput: PageInput,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<ProductResults> {
    const { page, pageSize } = pageInput;
    const [products, total] = await this.productService.findAll(
      page,
      pageSize,
      userId,
      name,
    );
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: products,
      page: {
        page,
        pageSize,
        total,
      },
    };
  }

  @Mutation(() => Result, { description: 'Delete organization by id' })
  async deleteProduct(
    @CurrentTokenId('userId') userId: string,
    @Args('id') id: string,
  ): Promise<Result> {
    console.log('deleteProduct', id, userId);
    const res = await this.productService.remove(id, userId);
    return res
      ? { code: SUCCESS, message: CodeMsg(SUCCESS) }
      : {
          code: PRODUCT_NOT_EXISTS,
          message: CodeMsg(PRODUCT_NOT_EXISTS),
        };
  }
}
