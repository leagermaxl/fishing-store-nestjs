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

import { CreateVariantTypeRequest } from '@/product/dto/variant-type/create-variant-type.dto';
import { UpdateVariantTypeRequest } from '@/product/dto/variant-type/update-variant-type.dto';
import { VariantTypeService } from '@/product/services/variant-type.service';

@Controller('product/type')
export class VariantTypeController {
	constructor(private readonly variantTypeService: VariantTypeService) {}

	@HttpCode(HttpStatus.OK)
	@Get()
	async getAll() {
		return await this.variantTypeService.findAll();
	}

	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async getById(@Param('id') id: string) {
		return await this.variantTypeService.findById(id);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(@Body() dto: CreateVariantTypeRequest) {
		return await this.variantTypeService.create(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch()
	async update(@Param('id') id: string, @Body() dto: UpdateVariantTypeRequest) {
		return await this.variantTypeService.update(id, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete()
	async delete(@Param('id') id: string) {
		return await this.variantTypeService.delete(id);
	}
}
