import { Injectable, NotFoundException } from '@nestjs/common';
import { Discount, Product, ProductVariant } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DISCOUNTS_NOT_FOUND } from './discount.constants';
import { CreateDiscountRequest } from './dto/create-discount.dto';
import { UpdateDiscountRequest } from './dto/update-discount.dto';

export interface DiscountFull extends Discount {
	products?: Product[];
	variants?: ProductVariant[];
}

@Injectable()
export class DiscountService {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll(active: boolean = false, isFull: boolean = false): Promise<DiscountFull[]> {
		const now = new Date();

		const discounts = await this.prismaService.discount.findMany({
			where: active
				? {
						startDate: { lte: now },
						endDate: { gte: now },
					}
				: undefined,
			...(isFull && { include: { products: true, variants: true } }),
		});

		if (!discounts) {
			throw new NotFoundException(DISCOUNTS_NOT_FOUND);
		}

		return discounts;
	}

	async findById(id: string, isFull: boolean = false): Promise<DiscountFull> {
		const discount = await this.prismaService.discount.findUnique({
			where: { id },
			...(isFull && { include: { products: true, variants: true } }),
		});

		if (!discount) {
			throw new NotFoundException(DISCOUNTS_NOT_FOUND);
		}

		return discount;
	}

	async create(dto: CreateDiscountRequest): Promise<Discount> {
		const { name, percentage, date } = dto;

		const discount = await this.prismaService.discount.create({
			data: {
				name,
				percentage,
				startDate: date.from ? new Date(date.from) : undefined,
				endDate: date.to ? new Date(date.to) : undefined,
			},
		});

		return discount;
	}

	async update(id: string, dto: UpdateDiscountRequest): Promise<null> {
		const { name, percentage, date } = dto;

		const discount = await this.prismaService.discount.update({
			where: { id },
			data: {
				name,
				percentage,
				startDate: date ? new Date(date.from) : undefined,
				endDate: date ? new Date(date.to) : undefined,
			},
		});

		if (!discount) {
			throw new NotFoundException(DISCOUNTS_NOT_FOUND);
		}

		return null;
	}

	async delete(id: string): Promise<null> {
		const discount = await this.prismaService.discount.delete({
			where: { id },
		});

		if (!discount) {
			throw new NotFoundException(DISCOUNTS_NOT_FOUND);
		}

		return null;
	}
}
