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
import { CreateAttributeRequest } from '../dto/attribute/create-attribute.dto';
import { AttributeService } from '../services/attribute.service';

@Controller('product/attribute')
export class AttributeController {
	constructor(private readonly attributeService: AttributeService) {}

	@HttpCode(HttpStatus.OK)
	@Get()
	async getAll() {
		await this.attributeService.findAll();
	}

	@HttpCode(HttpStatus.OK)
	@Get(':id')
	async getById(@Param('id') id: string) {
		await this.attributeService.findById(id);
	}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	async create(@Body() dto: CreateAttributeRequest) {
		await this.attributeService.create(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: CreateAttributeRequest) {
		await this.attributeService.update(id, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		await this.attributeService.delete(id);
	}
}
