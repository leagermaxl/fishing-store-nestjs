import { IsDateString, IsNotEmpty } from 'class-validator';

export class DateType {
	@IsDateString()
	@IsNotEmpty()
	from: Date;

	@IsDateString()
	@IsNotEmpty()
	to: Date;
}
