import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { AuthorizedRoles } from 'src/utils/decorators/authorize-roles.decorator';
import { AuthenticationGuard } from 'src/utils/gurads/authentication.guard';
import { AuthorizationGuard } from 'src/utils/gurads/authorization.guard';
import { Roles } from 'src/utils/common/user-roles.enum';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @AuthorizedRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard,AuthorizationGuard)
  @Post('/createCategory')
  create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() currentUser:UserEntity) {
    return this.categoriesService.create(createCategoryDto, currentUser);
  }

  @Throttle({ default: { ttl: 10000, limit: 3 }})
  @Get('all')
  async findAll(@Query() query: { page: string; limit: string }) {
    return await this.categoriesService.findAll({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
    });
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }

}
