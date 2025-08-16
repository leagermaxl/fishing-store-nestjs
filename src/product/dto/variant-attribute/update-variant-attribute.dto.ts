import { PartialType } from '@nestjs/mapped-types';
import { CreateVariantAttributeRequest } from './create-variant-attribute.dto';

export class UpdateVariantAttributeRequest extends PartialType(CreateVariantAttributeRequest) {}
