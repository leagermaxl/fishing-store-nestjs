import { PartialType } from '@nestjs/mapped-types';
import { CreateVariantRequest } from './create-variant.dto';

export class UpdateVariantRequest extends PartialType(CreateVariantRequest) {}
