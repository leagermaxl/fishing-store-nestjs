export class CreateVariantsDto {
	price: number;
	inStock: number;
	discountId?: string;
	attributes?: { name: string; value: string }[];
}
