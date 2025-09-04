import { AuthMethod } from '@prisma/client';
import {
	IsBoolean,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	MinLength,
} from 'class-validator';

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	@IsUrl()
	picture: string;

	@IsOptional()
	@IsBoolean()
	@IsNotEmpty()
	isVerified?: boolean;

	@IsEnum(AuthMethod, { each: true })
	@IsNotEmpty()
	methods: AuthMethod[];
}
