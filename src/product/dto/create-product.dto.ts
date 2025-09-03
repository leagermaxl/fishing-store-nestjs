import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';

import { AttributeDto, ImageDto, VariantDto } from '@/product/dto/product.types';
import {
	DESCRIPTION_MAX_LENGTH,
	NAME_MAX_LENGTH,
	NAME_MIN_LENGTH,
} from '@/product/product.constants';

export class CreateProductRequest {
	@IsString()
	@IsNotEmpty()
	@MinLength(NAME_MIN_LENGTH)
	@MaxLength(NAME_MAX_LENGTH)
	name: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@MaxLength(DESCRIPTION_MAX_LENGTH)
	description?: string;

	@IsString()
	@IsNotEmpty()
	@IsUUID()
	categoryId: string;

	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ImageDto)
	images: ImageDto[];

	@IsString()
	@IsNotEmpty()
	@IsUUID()
	@IsOptional()
	discountId?: string;

	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => AttributeDto)
	attributes: AttributeDto[];

	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => VariantDto)
	variants: VariantDto[];
}
