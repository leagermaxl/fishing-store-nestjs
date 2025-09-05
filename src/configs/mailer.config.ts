import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export function getMailerConfig(configService: ConfigService): MailerOptions {
	return {
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port: configService.getOrThrow<string>('MAIL_PORT'),
			secure: true,
			auth: {
				user: configService.getOrThrow<string>('MAIL_LOGIN'),
				pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
			},
		},
		defaults: {
			from: `"Lyubchenko Team" <` + `${configService.getOrThrow<string>('MAIL_LOGIN')}>`,
		},
	};
}
