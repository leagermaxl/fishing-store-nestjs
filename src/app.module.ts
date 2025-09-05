import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/auth/auth.module';
import { EmailConfirmationModule } from '@/auth/email-confirmation/email-confirmation.module';
import { PasswordRecoveryModule } from '@/auth/password-recovery/password-recovery.module';
import { CategoryModule } from '@/category/category.module';
import { DiscountModule } from '@/discount/discount.module';
import { MailModule } from '@/lib/mail/mail.module';
import { LoggerMiddleware } from '@/middlewares/logger.middleware';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductModule } from '@/product/product.module';
import { ProviderModule } from '@/provider/provider.module';
import { UserModule } from '@/user/user.module';
import { TwoFactorModule } from './auth/two-factor/two-factor.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		ProductModule,
		CategoryModule,
		DiscountModule,
		UserModule,
		AuthModule,
		ProviderModule,
		MailModule,
		EmailConfirmationModule,
		PasswordRecoveryModule,
		TwoFactorModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
