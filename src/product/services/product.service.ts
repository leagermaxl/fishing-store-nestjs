import { Injectable, NotFoundException } from '@nestjs/common';
import {
	Category,
	Discount,
	Prisma,
	Product,
	ProductAttribute,
	ProductVariant,
	VariantType,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductRequest } from '../dto/create-product.dto';
import { ProductWithCategory } from '../dto/product.types';
import { UpdateProductRequest } from '../dto/update-product.dto';
import { CreateVariantsDto } from '../dto/variant/create-variants.dto';
import { PRODUCTS_NOT_FOUND } from '../product.constants';
import { generateSKU } from '../utils/generateSku';

export interface ProductFull extends Product {
	category?: Category;
	variants?: ProductVariant[];
	attributes?: ProductAttribute[];
	discount?: Discount;
}

@Injectable()
export class ProductService {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll(isFull: boolean = false): Promise<ProductFull[]> {
		const products = await this.prismaService.product.findMany({
			...(isFull && {
				include: {
					variants: { include: { attributes: true } },
					attributes: true,
					discount: true,
				},
			}),
		});

		if (!products) {
			throw new NotFoundException(PRODUCTS_NOT_FOUND);
		}

		return products;
	}

	async findById(id: string, isFull: boolean = false): Promise<ProductFull> {
		const product = await this.prismaService.product.findUnique({
			where: { id },
			...(isFull && {
				include: {
					category: true,
					variants: { include: { attributes: true } },
					attributes: true,
					discount: true,
				},
			}),
		});

		if (!product) {
			throw new NotFoundException(PRODUCTS_NOT_FOUND);
		}

		return product;
	}

	async findByCategory(categoryId: string, isFull: boolean = false): Promise<ProductFull[]> {
		const product = await this.prismaService.product.findMany({
			where: { categoryId },
			...(isFull && {
				include: {
					variants: { include: { attributes: true } },
					attributes: true,
					discount: true,
				},
			}),
		});

		if (!product) {
			throw new NotFoundException(PRODUCTS_NOT_FOUND);
		}

		return product;
	}

	async create(dto: CreateProductRequest) {
		const newProduct = await this.createProduct(dto);

		return newProduct;
	}

	async update(id: string, dto: UpdateProductRequest): Promise<null> {
		const { name, description, categoryId, images, discountId } = dto;

		const imageArr = images?.map((imgObj) => imgObj.value);

		const product = await this.prismaService.product.update({
			where: { id },
			data: {
				name,
				description: description || null,
				categoryId,
				images: imageArr,
				discountId: discountId || null,
			},
		});

		if (!product) {
			throw new NotFoundException(PRODUCTS_NOT_FOUND);
		}

		return null;
	}

	async delete(id: string): Promise<null> {
		const product = await this.prismaService.product.findUnique({ where: { id } });
		if (!product) {
			throw new NotFoundException(PRODUCTS_NOT_FOUND);
		}
		await this.prismaService.product.delete({ where: { id } });

		return null;
	}

	private async createProduct(dto: CreateProductRequest) {
		const { name, description, categoryId, images, discountId, variants, attributes } = dto;

		const imagesArray = images.map((i) => i.value);

		const resultData: {
			product: Product;
			variantTypes?: VariantType[];
			attributes?: ProductAttribute[];
			variants?: ProductVariant[];
		} = { product: null as any, variantTypes: [] };

		const transactionResult = await this.prismaService.$transaction(async (tx) => {
			const newProduct = await tx.product.create({
				data: {
					name,
					description: description || null,
					categoryId,
					images: imagesArray,
					discountId: discountId || null,
				},
				include: { category: true },
			});
			resultData.product = newProduct;

			if (attributes?.length > 0) {
				const { typeMap, created } = await this.upsertVariantTypes(
					tx,
					[...new Set(attributes.map((a) => a.name))],
					categoryId,
				);

				const newAttributes = await this.createAttributes(tx, attributes, newProduct.id, typeMap);

				resultData.variantTypes?.push(...created);
				resultData.attributes = newAttributes;
			}

			if (variants?.length > 0) {
				const { typeMap, created } = await this.upsertVariantTypes(
					tx,
					[...new Set(variants.flatMap((v) => v.attributes.map((a) => a.name)))],
					categoryId,
				);

				const newVariants = await this.createVariants(tx, variants, typeMap, newProduct);

				resultData.variantTypes?.push(...created);
				resultData.variants = newVariants;
			}

			return resultData;
		});

		return transactionResult;
	}

	private async upsertVariantTypes(
		tx: Prisma.TransactionClient,
		names: string[],
		categoryId: string,
	) {
		const existing = await tx.variantType.findMany({
			where: { name: { in: names }, categoryId },
		});

		const map = new Map(existing.map((vt) => [vt.name, vt.id]));

		const newNames = names.filter((n) => !map.has(n));
		let created: VariantType[] = [];

		if (newNames.length > 0) {
			await tx.variantType.createMany({
				data: newNames.map((n) => ({ name: n, categoryId })),
				skipDuplicates: true,
			});

			const newlyCreated = await tx.variantType.findMany({
				where: { name: { in: newNames }, categoryId },
			});

			created = newlyCreated;

			newlyCreated.forEach((vt) => map.set(vt.name, vt.id));
		}

		return { typeMap: map, created };
	}

	private async createAttributes(
		tx: Prisma.TransactionClient,
		attributes: { name: string; value: string }[],
		productId: string,
		typeMap: Map<string, string>,
	) {
		const data = attributes.map((a) => ({
			value: a.value,
			typeId: typeMap.get(a.name) || '',
			productId,
		}));

		await tx.productAttribute.createMany({
			data,
			skipDuplicates: true,
		});

		return tx.productAttribute.findMany({
			where: { productId },
		});
	}

	private async createVariants(
		tx: Prisma.TransactionClient,
		variants: CreateVariantsDto[],
		typeMap: Map<string, string>,
		product: ProductWithCategory,
	) {
		const createdVariants: ProductVariant[] = [];
		for (const variant of variants) {
			const generatedSku = generateSKU(
				product.category!.name,
				product.name,
				variant.attributes!.map((a) => a.value),
				5,
			);
			const existing = await tx.productVariant.findUnique({
				where: { sku: generatedSku },
			});
			if (existing) {
				throw new Error(`Variant with SKU ${generatedSku} already exists`);
			}

			const createdVariant = await tx.productVariant.create({
				data: {
					sku: generatedSku,
					price: variant.price,
					inStock: variant.inStock,
					discountId: variant.discountId || null,
					productId: product.id,
				},
			});

			const attrData = variant.attributes!.map((attr) => ({
				variantId: createdVariant.id,
				value: attr.value,
				typeId: typeMap.get(attr.name) || '',
			}));

			if (attrData.length > 0) {
				await tx.productVariantAttribute.createMany({
					data: attrData,
					skipDuplicates: true,
				});
			}
			createdVariants.push(createdVariant);
		}

		return createdVariants;
	}
}
