import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { TokenType } from '@prisma/client';
import { Request } from 'express';
import { v4 as uuid } from 'uuid';

import {
	CONFIRMATION_TOKEN_EXPIRED,
	CONFIRMATION_TOKEN_NOT_FOUND,
	CONFIRMATION_TOKEN_USER_NOT_FOUND,
} from '@/auth/auth.constants';
import { AuthService } from '@/auth/auth.service';
import { ConfirmationDto } from '@/auth/email-confirmation/dto/confirmation.dto';
import { ms } from '@/lib/common/utils/ms.util';
import { MailService } from '@/lib/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class EmailConfirmationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly userService: UserService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
	) {}

	public async newVerification(req: Request, dto: ConfirmationDto) {
		const existToken = await this.prismaService.token.findUnique({
			where: { token: dto.token },
		});
		if (!existToken) {
			throw new NotFoundException(CONFIRMATION_TOKEN_NOT_FOUND);
		}

		const hasExpired = new Date(existToken.expiresIn) < new Date();
		if (hasExpired) {
			throw new BadRequestException(CONFIRMATION_TOKEN_EXPIRED);
		}

		const existUser = await this.userService.findByEmail(existToken.email);
		if (!existUser) {
			throw new NotFoundException(CONFIRMATION_TOKEN_USER_NOT_FOUND);
		}

		await this.userService.update(existUser.id, { isVerified: true });
		await this.prismaService.token.delete({ where: { id: existToken.id } });

		return this.authService.saveSession(req, existUser);
	}

	public async sendVerificationToken(email: string) {
		const verificationToken = await this.generateVerificationToken(email);
		await this.mailService.sendConfirmationMail(
			verificationToken.email,
			verificationToken.token,
		);

		return null;
	}

	public async generateVerificationToken(email: string) {
		const token = uuid();
		const expiresIn = new Date(Date.now() + ms('1h'));

		const existToken = await this.prismaService.token.findFirst({
			where: { email, type: TokenType.VERIFICATION },
		});
		if (existToken) {
			await this.prismaService.token.delete({ where: { id: existToken.id } });
		}

		const verificationToken = await this.prismaService.token.create({
			data: {
				email,
				expiresIn,
				token,
				type: TokenType.VERIFICATION,
			},
		});

		return verificationToken;
	}
}
