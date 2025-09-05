import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { ConfirmationDto } from '@/auth/email-confirmation/dto/confirmation.dto';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';

@Controller('auth/email-confirmation')
export class EmailConfirmationController {
	public constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

	@HttpCode(HttpStatus.OK)
	@Post('new-verification')
	public async newVerification(@Req() req: Request, @Body() dto: ConfirmationDto) {
		return this.emailConfirmationService.newVerification(req, dto);
	}
}
