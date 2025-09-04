import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { getRecaptchaConfig } from '@/configs/recaptcha.config';
import { UserService } from '@/user/user.service';

@Module({
	imports: [
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getRecaptchaConfig,
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, UserService],
})
export class AuthModule {}
