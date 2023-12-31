import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { GqlAuthGuard } from '@/common/guards/gql-auth.guard';
import { PartialProductInputDto } from './dto/product-input.dto';
import { CurrentGqlTokenId } from '@/common/decorators/current-gql-token-id.decorator';
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
import { BatchOnSaleInput } from './dto/batch-on-sale';

@TokenEntity('user')
@UseGuards(GqlAuthGuard)
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

  @UseGuards(TokenEntityGuard)
  @Mutation(() => Result, { description: 'Create product' })
  async createOrUpdateProduct(
    @CurrentGqlTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('dto') dto: PartialProductInputDto,
    @Args('id', { nullable: true }) id?: string,
  ): Promise<Result> {
    console.log('createOrUpdateProduct', userId, id);
    if (CategoryList.findIndex((item) => dto.category === item.key) === -1) {
      console.warn('no valid category, set to other', dto.category);
      dto.category = CategoryList[CategoryList.length - 1].key;
    }
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

  @UseGuards(TokenEntityGuard)
  @Mutation(() => Result, {
    description: 'Make products on sale or not for sale',
  })
  async productBatchOnSale(
    @CurrentGqlTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('dto') dto: BatchOnSaleInput,
  ): Promise<Result> {
    console.log('productBatchOnSale', { userId, organizationId, dto });
    await this.productService.batchUpdate(
      userId,
      organizationId,
      dto.products,
      dto.onSale,
    );
    return { code: SUCCESS, message: CodeMsg(SUCCESS) };
  }

  @TokenEntity('student')
  @UseGuards(TokenEntityGuard)
  @Query(() => ProductResult, { description: 'Find product by id' })
  async getProductInfo(@Args('id') id: string): Promise<ProductResult> {
    const product = await this.productService.findOne(id);
    return product
      ? { code: SUCCESS, message: CodeMsg(SUCCESS), data: product }
      : { code: PRODUCT_NOT_EXISTS, message: CodeMsg(PRODUCT_NOT_EXISTS) };
  }

  @UseGuards(TokenEntityGuard)
  @Query(() => ProductResults, { description: 'Find products' })
  async getProducts(
    @CurrentGqlTokenId('userId') userId: string,
    @CurrentOrganizationId('organizationId') organizationId: string,
    @Args('page') pageInput: PageInput,
    @Args('name', { nullable: true }) name?: string,
    @Args('category', { nullable: true }) category?: string,
  ): Promise<ProductResults> {
    const { page, pageSize } = pageInput;
    const [products, total] = await this.productService.findAll(
      page,
      pageSize,
      organizationId,
      userId,
      category,
      name,
      null,
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

  @UseGuards(TokenEntityGuard)
  @Mutation(() => Result, { description: 'Delete organization by id' })
  async deleteProduct(
    @CurrentGqlTokenId('userId') userId: string,
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

  @TokenEntity('student')
  @UseGuards(TokenEntityGuard)
  @Query(() => ProductResults, { description: 'Find products for mobile' })
  async getProductsH5(
    @Args('latitude') latitude: number,
    @Args('longitude') longitude: number,
    @Args('page') pageInput: PageInput,
    @Args('category', { nullable: true }) category?: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<ProductResults> {
    console.log('getProductsH5', {
      latitude,
      longitude,
      pageInput,
      category,
      name,
    });
    const { page, pageSize } = pageInput;
    const { entities, raw, total } =
      await this.productService.findAllByDistance(
        latitude,
        longitude,
        page,
        pageSize,
        null,
        null,
        category,
        name,
        ProductStatus.ON_SAIL,
      );
    // console.log({ entities, raw });
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: entities.map((product, index) => {
        const distance = raw[index].distance;
        let ds = '';
        if (distance < 1000) {
          ds = `${distance.toFixed(0)}m`;
        } else if (distance < 10000) {
          ds = `${(distance / 1000).toFixed(1)}km`;
        } else {
          ds = `${(distance / 1000).toFixed(0)}km`;
        }
        return {
          ...product,
          distance: ds,
        };
      }),
      page: {
        page,
        pageSize,
        total,
      },
    };
  }

  @TokenEntity('student')
  @UseGuards(TokenEntityGuard)
  @Query(() => ProductResults, {
    description: 'Find at most 5 products by organization id for mobile',
  })
  async getProductsByOrgH5(
    @Args('organizationId') organizationId: string,
  ): Promise<ProductResults> {
    console.log('getProductsByOrgH5', {
      organizationId,
    });
    const [products, total] = await this.productService.findAll(
      1,
      5,
      organizationId,
      null,
      null,
      null,
      ProductStatus.ON_SAIL,
    );
    return {
      code: SUCCESS,
      message: CodeMsg(SUCCESS),
      data: products,
      page: {
        page: 1,
        pageSize: 5,
        total,
      },
    };
  }
}
