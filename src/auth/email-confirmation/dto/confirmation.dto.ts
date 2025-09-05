import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ConfirmationDto {
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	token: string;
}
