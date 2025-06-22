import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepository:Repository<CategoryEntity>,
  ){}
  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    

    let categoryExists =  await this.categoryRepository.count({where: {title: createCategoryDto.title}});

    if(categoryExists > 0)throw new BadRequestException('Category laready Exists')

    let cateogry = await this.categoryRepository.create(createCategoryDto);
    let savedCategory = await this.categoryRepository.save(cateogry);

    return savedCategory;
    
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      select: ['id', 'title', 'description'
      ]
    });
  }

  async findById(categoryId: number): Promise<CategoryEntity> {

    let category = await this.categoryRepository.findOne({
      where: {id: categoryId},
      select: ['id', 'title', 'description']
    });
    if(!category)throw new BadRequestException('User does not exist');
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

  async findCategoryByTitle(title:string){
    return this.categoryRepository.findOneBy({title});
  }
}
