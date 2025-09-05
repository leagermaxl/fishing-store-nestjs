import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { getMailerConfig } from '@/configs/mailer.config';
import { MailService } from '@/lib/mail/mail.service';

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMailerConfig,
		}),
	],
	providers: [MailService],
})
export class MailModule {}
