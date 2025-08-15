import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryRequest } from './dto/create-category.dto';
import { UpdateCategoryRequest } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@HttpCode(HttpStatus.OK)
	@Get()
	async getAll(@Query('full') full: boolean) {
		return await this.categoryService.findAll(full);
	}

	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async getById(@Param('id') id: string, @Query('full') full: boolean) {
		return await this.categoryService.findById(id, full);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(@Body() dto: CreateCategoryRequest) {
		return await this.categoryService.create(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateCategoryRequest) {
		return await this.categoryService.update(id, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch(':id')
	async delete(@Param('id') id: string) {
		return await this.categoryService.delete(id);
	}
}
