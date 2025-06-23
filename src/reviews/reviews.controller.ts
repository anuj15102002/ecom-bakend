import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthenticationGuard } from 'src/utils/gurads/authentication.guard';
import { AuthorizationGuard } from 'src/utils/gurads/authorization.guard';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { ReviewsEntity } from './entities/review.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @CurrentUser()CurrentUser:UserEntity):Promise<ReviewsEntity> {
    return await this.reviewsService.create(createReviewDto,CurrentUser);
  }

  @Get()
  async findAll(): Promise<ReviewsEntity[]> {
    return await this.reviewsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ReviewsEntity> {
    return await this.reviewsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto): Promise<ReviewsEntity> {
    return await this.reviewsService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<string> {
    return await this.reviewsService.remove(+id);
  }
}
