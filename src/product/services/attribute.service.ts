import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductAttribute } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateAttributeRequest } from '@/product/dto/attribute/create-attribute.dto';
import { UpdateAttributeRequest } from '@/product/dto/attribute/update-attribute.dto';
import { ATTRIBUTES_NOT_FOUND } from '@/product/product.constants';

@Injectable()
export class AttributeService {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll(): Promise<ProductAttribute[]> {
		const attributes = await this.prismaService.productAttribute.findMany();

		if (!attributes) {
			throw new NotFoundException(ATTRIBUTES_NOT_FOUND);
		}

		return attributes;
	}

	async findById(id: string): Promise<ProductAttribute> {
		const attribute = await this.prismaService.productAttribute.findUnique({ where: { id } });

		if (!attribute) {
			throw new NotFoundException(ATTRIBUTES_NOT_FOUND);
		}

		return attribute;
	}

	async create(dto: CreateAttributeRequest): Promise<ProductAttribute> {
		const { productId, typeId, value } = dto;

		const newAttribute = await this.prismaService.productAttribute.create({
			data: {
				productId,
				typeId,
				value,
			},
		});

		return newAttribute;
	}

	async update(id: string, dto: UpdateAttributeRequest): Promise<null> {
		const { productId, typeId, value } = dto;

		const attribute = await this.prismaService.productAttribute.update({
			where: { id },
			data: { productId, typeId, value },
		});

		if (!attribute) {
			throw new NotFoundException(ATTRIBUTES_NOT_FOUND);
		}

		return null;
	}

	async delete(id: string): Promise<null> {
		const attribute = await this.prismaService.productAttribute.delete({
			where: { id },
		});

		if (!attribute) {
			throw new NotFoundException(ATTRIBUTES_NOT_FOUND);
		}

		return null;
	}
}
