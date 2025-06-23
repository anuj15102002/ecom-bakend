import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';


@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository:Repository<CategoryEntity>,
  ){}
  async create(createCategoryDto: CreateCategoryDto, currentUser:UserEntity): Promise<CategoryEntity> {
    try {
      console.log('hello');
      let category = this.categoryRepository.create(createCategoryDto);
      category.addedBy=currentUser;
      console.log("addedBy" + category.addedBy);
      console.log(currentUser);
      let savedCategory = await this.categoryRepository.save(category);
      return savedCategory;
    } catch (error) {
      
        throw new BadRequestException('Category with this title already exists.');
      
    }
  }

  async findAll(query: {
    page: number;
    limit: number;
  }): Promise<{
    categories: CategoryEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = query;
    const [categories, total] = await this.categoryRepository.findAndCount({
      relations: ['addedBy'],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
    return { categories, total, page, limit };
  }

  async findById(categoryId: number): Promise<CategoryEntity> {
    let category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['addedBy'],
      select: {
        id: true,
        title: true,
        description: true,
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
    if (!category) throw new BadRequestException('Category does not exist');
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    let categoryExists = await this.categoryRepository.findOne({where: {id: id}})
    if(!categoryExists)throw new BadRequestException('Category does not exist');

    Object.assign(categoryExists,updateCategoryDto);
    return await this.categoryRepository.save(categoryExists);
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
