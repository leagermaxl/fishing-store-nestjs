import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductVariantAttribute } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateVariantAttributeRequest } from '@/product/dto/variant-attribute/create-variant-attribute.dto';
import { UpdateVariantAttributeRequest } from '@/product/dto/variant-attribute/update-variant-attribute.dto';
import { VARIANT_ATTRIBUTES_NOT_FOUND } from '@/product/product.constants';

@Injectable()
export class VariantAttributeService {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll(): Promise<ProductVariantAttribute[]> {
		const variantAttributes = await this.prismaService.productVariantAttribute.findMany();

		if (!variantAttributes) {
			throw new NotFoundException(VARIANT_ATTRIBUTES_NOT_FOUND);
		}

		return variantAttributes;
	}

	async findById(id: string): Promise<ProductVariantAttribute> {
		const variantAttribute = await this.prismaService.productVariantAttribute.findUnique({
			where: { id },
		});

		if (!variantAttribute) {
			throw new NotFoundException(VARIANT_ATTRIBUTES_NOT_FOUND);
		}

		return variantAttribute;
	}

	async findByVariantId(variantId: string): Promise<ProductVariantAttribute[]> {
		const variantAttributes = await this.prismaService.productVariantAttribute.findMany({
			where: { variantId },
		});

		if (!variantAttributes) {
			throw new NotFoundException(VARIANT_ATTRIBUTES_NOT_FOUND);
		}

		return variantAttributes;
	}

	async create(dto: CreateVariantAttributeRequest): Promise<ProductVariantAttribute> {
		const { variantId, typeId, value } = dto;

		const variantAttribute = await this.prismaService.productVariantAttribute.create({
			data: { variantId, typeId, value },
		});

		return variantAttribute;
	}

	async update(id: string, dto: UpdateVariantAttributeRequest): Promise<null> {
		const { variantId, typeId, value } = dto;

		const variantAttribute = await this.prismaService.productVariantAttribute.update({
			where: { id },
			data: { variantId, typeId, value },
		});

		if (!variantAttribute) {
			throw new NotFoundException(VARIANT_ATTRIBUTES_NOT_FOUND);
		}

		return null;
	}

	async delete(id: string): Promise<null> {
		const variantAttribute = await this.prismaService.productVariantAttribute.delete({
			where: { id },
		});

		if (!variantAttribute) {
			throw new NotFoundException(VARIANT_ATTRIBUTES_NOT_FOUND);
		}

		return null;
	}
}
