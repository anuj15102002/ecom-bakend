import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewsEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products/products.service';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(ReviewsEntity)private readonly reviewsRepository: Repository<ReviewsEntity>,
              private readonly productService: ProductsService){}


  async create(createReviewDto: CreateReviewDto, currentUser: UserEntity) {
    // Validate product existence
    const product = await this.productService.findOne(createReviewDto.productId);
    // Create review entity
    const review = this.reviewsRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      product: product,
      addedBy: currentUser,
    });
    // Save and return
    return await this.reviewsRepository.save(review);
  }

  async findAll(): Promise<ReviewsEntity[]> {
    return await this.reviewsRepository.find({
      relations: ['product', 'addedBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ReviewsEntity> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['product', 'addedBy'],
    });
    if (!review) throw new NotFoundException(`Review with id ${id} not found`);
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<ReviewsEntity> {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException(`Review with id ${id} not found`);
    Object.assign(review, updateReviewDto);
    return await this.reviewsRepository.save(review);
  }

  async remove(id: number): Promise<string> {
    const review = await this.reviewsRepository.findOne({ where: { id } });
    if (!review) throw new NotFoundException(`Review with id ${id} not found`);
    await this.reviewsRepository.remove(review);
    return `Review with id ${id} has been removed`;
  }
}
