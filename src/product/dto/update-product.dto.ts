import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	ValidateNested,
} from 'class-validator';
import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../product.constants';
import { ImageDto } from './product.types';
export class UpdateProductRequest {
	@IsString()
	@IsNotEmpty()
	@MinLength(NAME_MIN_LENGTH)
	@MaxLength(NAME_MAX_LENGTH)
	name: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@MaxLength(DESCRIPTION_MAX_LENGTH)
	description: string;

	@IsString()
	@IsNotEmpty()
	categoryId: string;

	@IsArray()
	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => ImageDto)
	images: ImageDto[];

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	discountId?: string;
}
