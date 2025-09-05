import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { TokenType } from '@prisma/client';

import {
	TWO_FACTOR_TOKEN_DOES_NOT_MATCH,
	TWO_FACTOR_TOKEN_EXPIRED,
	TWO_FACTOR_TOKEN_NOT_FOUND,
} from '@/auth/auth.constants';
import { ms } from '@/lib/common/utils/ms.util';
import { MailService } from '@/lib/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TwoFactorService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
	) {}

	public async validateTwoFactor(email: string, code: string) {
		const twoFactorToken = await this.prismaService.token.findFirst({
			where: { email, type: TokenType.TWO_FACTOR },
		});
		if (!twoFactorToken) {
			throw new NotFoundException(TWO_FACTOR_TOKEN_NOT_FOUND);
		}

		const hasExpired = new Date(twoFactorToken.expiresIn) < new Date();
		if (hasExpired) {
			throw new BadRequestException(TWO_FACTOR_TOKEN_EXPIRED);
		}

		if (twoFactorToken.token !== code) {
			throw new UnauthorizedException(TWO_FACTOR_TOKEN_DOES_NOT_MATCH);
		}

		await this.prismaService.token.delete({ where: { id: twoFactorToken.id } });

		return null;
	}

	public async sendTwoFactorToken(email: string) {
		const twoFactorToken = await this.generateTwoFactorToken(email);

		await this.mailService.sendTwoFactorMail(twoFactorToken.email, twoFactorToken.token);
	}

	public async generateTwoFactorToken(email: string) {
		const token = Math.floor(Math.random() * (1000000 - 100000) + 100000).toString();
		const expiresIn = new Date(Date.now() + ms('15m'));

		const existToken = await this.prismaService.token.findFirst({
			where: { email, type: TokenType.TWO_FACTOR },
		});
		if (existToken) {
			await this.prismaService.token.delete({ where: { id: existToken.id } });
		}

		const twoFactorToken = await this.prismaService.token.create({
			data: { email, expiresIn, token, type: TokenType.TWO_FACTOR },
		});

		return twoFactorToken;
	}
}
