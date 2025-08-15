import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateVariantAttributeRequest {
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	variantId: string;

	@IsString()
	@IsNotEmpty()
	@IsUUID()
	typeId: string;

	@IsString()
	@IsNotEmpty()
	value: string;
}
