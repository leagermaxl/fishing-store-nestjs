import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { EmailConfirmationModule } from '@/auth/email-confirmation/email-confirmation.module';
import { TwoFactorService } from '@/auth/two-factor/two-factor.service';
import { getProviderOptions } from '@/configs/provider.config';
import { getRecaptchaConfig } from '@/configs/recaptcha.config';
import { MailService } from '@/lib/mail/mail.service';
import { ProviderModule } from '@/provider/provider.module';
import { UserService } from '@/user/user.service';

@Module({
	imports: [
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getRecaptchaConfig,
		}),
		ProviderModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getProviderOptions,
		}),
		forwardRef(() => EmailConfirmationModule),
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, TwoFactorService, MailService],
	exports: [AuthService],
})
export class AuthModule {}
