import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { NewPasswordDto } from '@/auth/password-recovery/dto/new-password.dto';
import { ResetPasswordDto } from '@/auth/password-recovery/dto/reset-password.dto';
import { PasswordRecoveryService } from '@/auth/password-recovery/password-recovery.service';

@Controller('auth/password-recovery')
export class PasswordRecoveryController {
	constructor(private readonly passwordRecoveryService: PasswordRecoveryService) {}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('reset')
	public async reset(@Body() dto: ResetPasswordDto) {
		return this.passwordRecoveryService.resetPassword(dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('new')
	public async new(@Body() dto: NewPasswordDto) {
		return this.passwordRecoveryService.newPassword(dto);
	}
}
