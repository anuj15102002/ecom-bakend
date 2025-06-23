import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {

  constructor(@InjectRepository(ProductEntity)private readonly productRepository: Repository<ProductEntity>,
              private readonly categoryService:CategoriesService){}


  
  async create(createProductDto: CreateProductDto, currentUser:UserEntity) {

    const category = await this.categoryService.findById(+createProductDto.categoryId);

    const product = await this.productRepository.create(createProductDto);
    product.category = category;
    product.addedBy = currentUser;

    return await this.productRepository.save(product);


  }

  async findAll(query: { page: number; limit: number }) {
    const { page = 1, limit = 10 } = query;
    const [products, total] = await this.productRepository.findAndCount({
      relations: ['category', 'addedBy'],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        category: {
          id: true,
          title: true,
        },
        addedBy: {
          id: true,
          name: true,
        },
      },
    });
    return { products, total, page, limit };
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'addedBy'],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        category: {
          id: true,
          title: true,
        },
        addedBy: {
          id: true,
          name: true,
        },
      },
    });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<string> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    await this.productRepository.remove(product);
    return `Product with id ${id} has been removed`;
  }
}
