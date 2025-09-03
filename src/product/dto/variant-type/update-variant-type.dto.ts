import { PartialType } from '@nestjs/mapped-types';

import { CreateVariantTypeRequest } from '@/product/dto/variant-type/create-variant-type.dto';

export class UpdateVariantTypeRequest extends PartialType(CreateVariantTypeRequest) {}
