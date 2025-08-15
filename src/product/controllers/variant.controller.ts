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
} from '@nestjs/common';
import { CreateVariantRequest } from '../dto/variant/create-variant.dto';
import { UpdateVariantRequest } from '../dto/variant/update-variant.dto';
import { VariantService } from '../services/variant.service';

@Controller('product/variant')
export class VariantController {
	constructor(private readonly variantService: VariantService) {}

	@HttpCode(HttpStatus.OK)
	@Get()
	async getAll() {
		return await this.variantService.findAll();
	}

	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async getById(@Param('id') id: string) {
		return await this.variantService.findById(id);
	}

	@HttpCode(HttpStatus.OK)
	@Get('product/:productId')
	async getByProductId(@Param('productId') productId: string) {
		return await this.variantService.findByProductId(productId);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post('')
	async create(@Body() dto: CreateVariantRequest) {
		return await this.variantService.create(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateVariantRequest) {
		return await this.variantService.update(id, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return await this.variantService.delete(id);
	}
}
