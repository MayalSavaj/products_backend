import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { CreateProductDto } from './create-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const newProduct = this.productRepository.create(createProductDto);
        return await this.productRepository.save(newProduct);
    }

    async findAll(
        searchTerm: string,
        filters: { priceRange?: [number, number]; isActive?: boolean },
        sort?: { field: string; name: 'ASC' | 'DESC' }
    ): Promise<Product[]> {
        const query = this.productRepository.createQueryBuilder('product');

        if (searchTerm) {
            query.andWhere('product.name LIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
        }

        if (filters.priceRange) {
            query.andWhere('product.price BETWEEN :min AND :max', { min: filters.priceRange[0], max: filters.priceRange[1] });
        }

        if (filters.isActive !== undefined) {
            query.andWhere('product.isActive = :isActive', { isActive: filters.isActive });
        }

        if (sort) {
            query.orderBy(`product.${sort.field}`, sort.name);
        }

        return await query.getMany();
    }

}
