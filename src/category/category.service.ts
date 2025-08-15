import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CATEGORIES_NOT_FOUND, PARENT_CATEGORY_NOT_FOUND } from './category.constants';
import { CreateCategoryRequest } from './dto/create-category.dto';
import { UpdateCategoryRequest } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll(isFull: boolean = false): Promise<Category[]> {
		const categories = await this.prismaService.category.findMany({
			...(isFull && {
				include: {
					children: true,
					products: {
						include: {
							variants: { include: { attributes: true } },
							attributes: true,
						},
					},
					variantTypes: {
						include: {
							productAttributes: true,
							productVariantAttributes: true,
						},
					},
				},
			}),
		});

		if (!categories) {
			throw new NotFoundException(CATEGORIES_NOT_FOUND);
		}

		return categories;
	}

	async findById(id: string, isFull: boolean = false): Promise<Category> {
		const category = await this.prismaService.category.findUnique({
			where: { id },
			...(isFull && {
				include: {
					children: true,
					products: {
						include: {
							variants: { include: { attributes: true } },
							attributes: true,
						},
					},
					variantTypes: {
						include: {
							productAttributes: true,
							productVariantAttributes: true,
						},
					},
				},
			}),
		});

		if (!category) {
			throw new NotFoundException(CATEGORIES_NOT_FOUND);
		}

		return category;
	}

	async create(dto: CreateCategoryRequest): Promise<Category> {
		const { name, parentId } = dto;

		if (parentId) {
			const parentExists = await this.prismaService.category.findUnique({
				where: { id: parentId },
			});

			if (!parentExists) {
				throw new NotFoundException(PARENT_CATEGORY_NOT_FOUND);
			}
		}

		const category = await this.prismaService.category.create({
			data: {
				name,
				parentId,
			},
		});

		return category;
	}

	async update(id: string, dto: UpdateCategoryRequest): Promise<null> {
		const { name, parentId } = dto;

		if (parentId) {
			const parentExists = await this.prismaService.category.findUnique({
				where: { id: parentId },
			});

			if (!parentExists) {
				throw new NotFoundException(PARENT_CATEGORY_NOT_FOUND);
			}
		}

		const category = await this.prismaService.category.update({
			where: { id },
			data: { name, parentId },
		});

		if (!category) {
			throw new NotFoundException(CATEGORIES_NOT_FOUND);
		}

		return null;
	}

	async delete(id: string): Promise<null> {
		const category = await this.prismaService.category.delete({
			where: { id },
		});

		if (!category) {
			throw new NotFoundException(CATEGORIES_NOT_FOUND);
		}

		return null;
	}
}
