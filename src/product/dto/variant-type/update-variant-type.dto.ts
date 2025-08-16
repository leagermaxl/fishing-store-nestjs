import { PartialType } from '@nestjs/mapped-types';
import { CreateVariantTypeRequest } from './create-variant-type.dto';

export class UpdateVariantTypeRequest extends PartialType(CreateVariantTypeRequest) {}
