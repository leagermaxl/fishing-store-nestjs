import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class NewPasswordDto {
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@IsString()
	@IsNotEmpty()
	@IsUUID()
	token: string;
}
