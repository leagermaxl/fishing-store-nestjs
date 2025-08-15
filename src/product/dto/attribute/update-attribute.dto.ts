import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateAttributeRequest {
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	productId: string;

	@IsString()
	@IsNotEmpty()
	@IsUUID()
	typeId: string;

	@IsString()
	@IsNotEmpty()
	value: string;
}
