import { Category, Product } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUrl,
	Min,
	ValidateNested,
} from 'class-validator';

export type ProductWithCategory = Product & {
	category: Category | null;
};

export class ImageDto {
	@IsString()
	@IsNotEmpty()
	@IsUrl()
	value: string;
}

export class AttributeDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	value: string;
}

export class VariantDto {
	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	price: number;

	@IsNumber()
	@IsNotEmpty()
	@Min(0)
	inStock: number;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	discountId?: string;

	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => VariantAttributeDto)
	attributes: VariantAttributeDto[];
}

export class VariantAttributeDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	value: string;
}
