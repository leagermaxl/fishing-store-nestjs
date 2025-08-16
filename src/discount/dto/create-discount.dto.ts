import { Type } from 'class-transformer';
import {
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsString,
	Max,
	MaxLength,
	Min,
	MinLength,
	ValidateNested,
} from 'class-validator';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '../discount.constants';
import { DateType } from './discount.types';

export class CreateDiscountRequest {
	@IsString()
	@IsNotEmpty()
	@MinLength(NAME_MIN_LENGTH)
	@MaxLength(NAME_MAX_LENGTH)
	name: string;

	@IsNumber()
	@IsNotEmpty()
	@Min(0.0)
	@Max(100)
	percentage: number;

	@IsObject()
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => DateType)
	date: DateType;
}
