import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscountRequest } from './create-discount.dto';

export class UpdateDiscountRequest extends PartialType(CreateDiscountRequest) {}
