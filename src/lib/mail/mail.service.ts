import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';

import { ConfirmationTemplate } from '@/lib/mail/templates/confirmation.template';
import { PasswordResetTemplate } from '@/lib/mail/templates/password-reset.template';
import { TwoFactorTemplate } from '@/lib/mail/templates/two-factor.template';

@Injectable()
export class MailService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly mailerService: MailerService,
	) {}

	public async sendConfirmationMail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
		const html = await render(ConfirmationTemplate({ domain, token }));

		return await this.sendMail(email, 'Подтверждение почты', html);
	}

	public async sendPasswordResetMail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
		const html = await render(PasswordResetTemplate({ domain, token }));

		return await this.sendMail(email, 'Сброс пароля', html);
	}

	public async sendTwoFactorMail(email: string, token: string) {
		const html = await render(TwoFactorTemplate({ token }));

		return await this.sendMail(email, 'Двухфакторная аутентификация', html);
	}

	private async sendMail(email: string, subject: string, html: string) {
		return await this.mailerService.sendMail({ to: email, subject, html });
	}
}
