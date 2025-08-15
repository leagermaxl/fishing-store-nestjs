import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductVariant } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVariantRequest } from '../dto/variant/create-variant.dto';
import { UpdateVariantRequest } from '../dto/variant/update-variant.dto';
import { VARIANTS_NOT_FOUND } from '../product.constants';
import { generateSKU } from '../utils/generateSku';
import { ProductService } from './product.service';

@Injectable()
export class VariantService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly productService: ProductService,
	) {}

	async findAll(): Promise<ProductVariant[]> {
		const variants = await this.prismaService.productVariant.findMany();

		if (!variants) {
			throw new NotFoundException(VARIANTS_NOT_FOUND);
		}

		return variants;
	}

	async findById(id: string): Promise<ProductVariant> {
		const variant = await this.prismaService.productVariant.findUnique({ where: { id } });

		if (!variant) {
			throw new NotFoundException(VARIANTS_NOT_FOUND);
		}

		return variant;
	}

	async findByProductId(productId: string): Promise<ProductVariant[]> {
		const variants = await this.prismaService.productVariant.findMany({ where: { productId } });

		if (!variants) {
			throw new NotFoundException(VARIANTS_NOT_FOUND);
		}

		return variants;
	}

	async create(dto: CreateVariantRequest): Promise<ProductVariant> {
		const { productId, inStock, price, discountId } = dto;

		const product = await this.productService.findById(productId, true);

		const variant = await this.prismaService.productVariant.create({
			data: {
				productId,
				inStock,
				price,
				discountId,
				sku: generateSKU(
					product.category!.name,
					product.name,
					product.attributes!.map((attr) => attr.value),
					5,
				),
			},
		});

		if (!variant) {
			throw new NotFoundException(VARIANTS_NOT_FOUND);
		}

		return variant;
	}

	async update(id: string, dto: UpdateVariantRequest): Promise<null> {
		const { productId, inStock, price, discountId } = dto;

		const product = await this.productService.findById(productId, true);

		const variant = await this.prismaService.productVariant.update({
			where: { id },
			data: {
				productId,
				inStock,
				price,
				discountId,
				sku:
					productId &&
					generateSKU(
						product.category!.name,
						product.name,
						product.attributes!.map((attr) => attr.value),
						5,
					),
			},
		});

		if (!variant) {
			throw new NotFoundException(VARIANTS_NOT_FOUND);
		}

		return null;
	}

	async delete(id: string): Promise<null> {
		const variant = await this.prismaService.productVariant.delete({
			where: { id },
		});

		if (!variant) {
			throw new NotFoundException(VARIANTS_NOT_FOUND);
		}

		return null;
	}
}
