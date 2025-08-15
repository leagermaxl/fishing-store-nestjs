import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../category.constants';

export class UpdateCategoryRequest {
	@IsString()
	@IsNotEmpty()
	@MinLength(NAME_MIN_LENGTH)
	@MaxLength(NAME_MAX_LENGTH)
	name: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	@IsUUID()
	parentId?: string;
}
