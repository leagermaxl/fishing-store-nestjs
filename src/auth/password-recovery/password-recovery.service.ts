import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TokenType } from '@prisma/client';
import { v4 as uuid } from 'uuid';

import {
	PASSWORD_TOKEN_EXPIRED,
	PASSWORD_TOKEN_NOT_FOUND,
	PASSWORD_TOKEN_USER_NOT_FOUND,
} from '@/auth/auth.constants';
import { NewPasswordDto } from '@/auth/password-recovery/dto/new-password.dto';
import { ResetPasswordDto } from '@/auth/password-recovery/dto/reset-password.dto';
import { ms } from '@/lib/common/utils/ms.util';
import { MailService } from '@/lib/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly userService: UserService,
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
	) {}

	public async newPassword(dto: NewPasswordDto) {
		const existToken = await this.prismaService.token.findUnique({
			where: { token: dto.token },
		});
		if (!existToken) {
			throw new NotFoundException(PASSWORD_TOKEN_NOT_FOUND);
		}

		const hasExpired = new Date(existToken.expiresIn) < new Date();
		if (hasExpired) {
			throw new BadRequestException(PASSWORD_TOKEN_EXPIRED);
		}

		const existUser = await this.userService.findByEmail(existToken.email);
		if (!existUser) {
			throw new NotFoundException(PASSWORD_TOKEN_USER_NOT_FOUND);
		}

		await this.userService.update(existUser.id, { password: dto.password });
		await this.prismaService.token.delete({ where: { id: existToken.id } });

		return null;
	}

	public async resetPassword(dto: ResetPasswordDto) {
		const existUser = await this.userService.findByEmail(dto.email);
		if (!existUser) {
			throw new NotFoundException(PASSWORD_TOKEN_USER_NOT_FOUND);
		}

		const passwordResetToken = await this.generatePasswordResetToken(existUser.email);
		await this.mailService.sendPasswordResetMail(
			passwordResetToken.email,
			passwordResetToken.token,
		);

		return null;
	}

	public async generatePasswordResetToken(email: string) {
		const token = uuid();
		const expiresIn = new Date(Date.now() + ms('15m'));

		const existToken = await this.prismaService.token.findFirst({
			where: { email, type: TokenType.PASSWORD_RESET },
		});
		if (existToken) {
			await this.prismaService.token.delete({ where: { id: existToken.id } });
		}

		const passwordResetToken = await this.prismaService.token.create({
			data: { email, expiresIn, token, type: TokenType.PASSWORD_RESET },
		});

		return passwordResetToken;
	}
}
