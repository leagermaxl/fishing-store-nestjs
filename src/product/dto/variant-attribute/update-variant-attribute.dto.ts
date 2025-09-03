import { PartialType } from '@nestjs/mapped-types';

import { CreateVariantAttributeRequest } from '@/product/dto/variant-attribute/create-variant-attribute.dto';

export class UpdateVariantAttributeRequest extends PartialType(CreateVariantAttributeRequest) {}
