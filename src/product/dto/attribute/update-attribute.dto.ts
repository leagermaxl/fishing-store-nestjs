import { PartialType } from '@nestjs/mapped-types';
import { CreateAttributeRequest } from './create-attribute.dto';

export class UpdateAttributeRequest extends PartialType(CreateAttributeRequest) {}
