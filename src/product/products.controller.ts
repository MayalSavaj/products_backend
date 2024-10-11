import { Controller, Post, Get, UploadedFile, UseInterceptors, Body, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './create-product.dto';
import { Product } from '../product/product.entity';
import { ParseIntPipe, ParseBoolPipe } from '@nestjs/common';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createProductDto: CreateProductDto
    ): Promise<Product> {
        const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
        return this.productsService.create({
            ...createProductDto,
            image: imageUrl,
        });
    }

    @Get()
    async findAll(
        @Query('search') searchTerm?: string,
        @Query('minPrice', new ParseIntPipe({ optional: true })) minPrice?: number,
        @Query('maxPrice', new ParseIntPipe({ optional: true })) maxPrice?: number,
        @Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean,
        @Query('sortField') sortField?: string,
        @Query('sortOrder') sortOrder?: 'ASC' | 'DESC'
    ): Promise<Product[]> {
        const filters: { priceRange?: [number, number]; isActive?: boolean } = {};

        if (minPrice !== undefined || maxPrice !== undefined) {
            const min = minPrice !== undefined ? minPrice : 0;
            const max = maxPrice !== undefined ? maxPrice : Number.MAX_VALUE;
            filters.priceRange = [min, max];
        }

        if (isActive !== undefined) {
            filters.isActive = isActive;
        }

        let sort;
        if (sortField) {
            sort = {
                field: sortField,
                name: sortOrder ? sortOrder.toUpperCase() : 'ASC',
            };
        }

        return this.productsService.findAll(searchTerm, filters, sort);
    }

}
