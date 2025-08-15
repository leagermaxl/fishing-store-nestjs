import { IsNotEmpty, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../../product.constants';

export class CreateVariantTypeRequest {
	@IsString()
	@IsNotEmpty()
	@MinLength(NAME_MIN_LENGTH)
	@MaxLength(NAME_MAX_LENGTH)
	name: string;

	@IsString()
	@IsNotEmpty()
	@IsUUID()
	categoryId: string;
}
