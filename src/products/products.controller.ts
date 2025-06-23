import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthorizationGuard } from 'src/utils/gurads/authorization.guard';
import { Roles } from 'src/utils/common/user-roles.enum';
import { AuthenticationGuard } from 'src/utils/gurads/authentication.guard';
import { AuthorizedRoles } from 'src/utils/decorators/authorize-roles.decorator';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { ProductEntity } from './entities/product.entity';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @AuthorizedRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto,@CurrentUser()currentUser:UserEntity):Promise<ProductEntity> {
    return await this.productsService.create(createProductDto,currentUser);
  }

  @Get()
  async findAll(@Query() query: { page?: string; limit?: string }): Promise<{
    products: ProductEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    return await this.productsService.findAll({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductEntity | string> {
    return await this.productsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<ProductEntity | string> {
    return await this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    return await this.productsService.remove(+id);
  }
}
