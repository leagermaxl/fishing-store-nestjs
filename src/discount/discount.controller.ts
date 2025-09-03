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

import { DiscountService } from '@/discount/discount.service';
import { CreateDiscountRequest } from '@/discount/dto/create-discount.dto';
import { UpdateDiscountRequest } from '@/discount/dto/update-discount.dto';

@Controller('discount')
export class DiscountController {
	constructor(private readonly discountService: DiscountService) {}

	@HttpCode(HttpStatus.OK)
	@Get()
	async getAll(@Query('full') full: boolean) {
		return await this.discountService.findAll(full);
	}

	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async getById(@Param('id') id: string, @Query('full') full: boolean) {
		return await this.discountService.findById(id, full);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(@Body() dto: CreateDiscountRequest) {
		return await this.discountService.create(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateDiscountRequest) {
		return await this.discountService.update(id, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		return await this.discountService.delete(id);
	}
}
