import { OmitType, PartialType } from '@nestjs/mapped-types';

import { CreateProductRequest } from '@/product/dto/create-product.dto';

export class UpdateProductRequest extends PartialType(
	OmitType(CreateProductRequest, ['attributes', 'variants']),
) {}
