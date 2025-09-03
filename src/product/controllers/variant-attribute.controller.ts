import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';

import { CreateVariantAttributeRequest } from '@/product/dto/variant-attribute/create-variant-attribute.dto';
import { UpdateVariantAttributeRequest } from '@/product/dto/variant-attribute/update-variant-attribute.dto';
import { VariantAttributeService } from '@/product/services/variant-attribute.service';

@Controller('product/variant-attribute')
export class VariantAttributeController {
	constructor(private readonly variantAttributeService: VariantAttributeService) {}

	@HttpCode(HttpStatus.OK)
	@Get()
	async getAll() {
		return await this.variantAttributeService.findAll();
	}

	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async getById(@Param('id') id: string) {
		return await this.variantAttributeService.findById(id);
	}

	@HttpCode(HttpStatus.OK)
	@Get('variant/:variantId')
	async getByVariantId(@Param('variantId') variantId: string) {
		return await this.variantAttributeService.findByVariantId(variantId);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(@Body() dto: CreateVariantAttributeRequest) {
		return await this.variantAttributeService.create(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch()
	async update(@Param('id') id: string, @Body() dto: UpdateVariantAttributeRequest) {
		return await this.variantAttributeService.update(id, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch()
	async delete(@Param('id') id: string) {
		return await this.variantAttributeService.delete(id);
	}
}
