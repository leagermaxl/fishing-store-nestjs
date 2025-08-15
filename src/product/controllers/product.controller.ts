import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { CreateProductRequest } from '../dto/create-product.dto';
import { UpdateProductRequest } from '../dto/update-product.dto';
import { ProductService } from '../services/product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@HttpCode(HttpStatus.OK)
	@Get()
	async getAll(@Query('full') full: boolean) {
		return await this.productService.findAll(full);
	}

	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async getById(@Param('id') id: string, @Query('full') full: boolean) {
		return await this.productService.findById(id, full);
	}

	@HttpCode(HttpStatus.OK)
	@Get('category/:categoryId')
	async getByCategory(@Param('categoryId') categoryId: string, @Query('full') full: boolean) {
		return await this.productService.findByCategory(categoryId, full);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(@Body() dto: CreateProductRequest) {
		return await this.productService.create(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateProductRequest) {
		return await this.productService.update(id, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return await this.productService.delete(id);
	}
}
