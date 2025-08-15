import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateVariantRequest {
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	productId: string;

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
	@IsUUID()
	discountId?: string;
}
