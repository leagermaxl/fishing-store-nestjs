import { PartialType } from '@nestjs/mapped-types';

import { CreateAttributeRequest } from '@/product/dto/attribute/create-attribute.dto';

export class UpdateAttributeRequest extends PartialType(CreateAttributeRequest) {}
