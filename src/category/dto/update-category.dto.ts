import { PartialType } from '@nestjs/mapped-types';

import { CreateCategoryRequest } from '@/category/dto/create-category.dto';

export class UpdateCategoryRequest extends PartialType(CreateCategoryRequest) {}
