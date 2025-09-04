import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { getProviderOptions } from '@/configs/provider.config';
import { getRecaptchaConfig } from '@/configs/recaptcha.config';
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
	],
	controllers: [AuthController],
	providers: [AuthService, UserService],
})
export class AuthModule {}
