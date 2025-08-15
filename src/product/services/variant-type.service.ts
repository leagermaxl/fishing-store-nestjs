import { Injectable, NotFoundException } from '@nestjs/common';
import { VariantType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVariantTypeRequest } from '../dto/variant-type/create-variant-type.dto';
import { UpdateVariantTypeRequest } from '../dto/variant-type/update-variant-type.dto';
import { VARIANT_TYPES_NOT_FOUND } from '../product.constants';

@Injectable()
export class VariantTypeService {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll(): Promise<VariantType[]> {
		const variantTypes = await this.prismaService.variantType.findMany();

		if (!variantTypes) {
			throw new NotFoundException(VARIANT_TYPES_NOT_FOUND);
		}

		return variantTypes;
	}

	async findById(id: string): Promise<VariantType> {
		const variantType = await this.prismaService.variantType.findUnique({ where: { id } });

		if (!variantType) {
			throw new NotFoundException(VARIANT_TYPES_NOT_FOUND);
		}

		return variantType;
	}

	async create(dto: CreateVariantTypeRequest): Promise<VariantType> {
		const { name, categoryId } = dto;

		const variantType = await this.prismaService.variantType.create({ data: { name, categoryId } });

		return variantType;
	}

	async update(id: string, dto: UpdateVariantTypeRequest): Promise<null> {
		const { name, categoryId } = dto;

		const variantType = await this.prismaService.variantType.update({
			where: { id },
			data: { name, categoryId },
		});

		if (!variantType) {
			throw new NotFoundException(VARIANT_TYPES_NOT_FOUND);
		}

		return null;
	}

	async delete(id: string): Promise<null> {
		const variantType = await this.prismaService.variantType.delete({
			where: { id },
		});

		if (!variantType) {
			throw new NotFoundException(VARIANT_TYPES_NOT_FOUND);
		}

		return null;
	}
}
