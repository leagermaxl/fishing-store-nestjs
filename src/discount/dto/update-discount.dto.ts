import { PartialType } from '@nestjs/mapped-types';

import { CreateDiscountRequest } from '@/discount/dto/create-discount.dto';

export class UpdateDiscountRequest extends PartialType(CreateDiscountRequest) {}
