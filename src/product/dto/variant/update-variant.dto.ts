import { PartialType } from '@nestjs/mapped-types';

import { CreateVariantRequest } from '@/product/dto/variant/create-variant.dto';

export class UpdateVariantRequest extends PartialType(CreateVariantRequest) {}
