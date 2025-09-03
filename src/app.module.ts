import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CategoryModule } from '@/category/category.module';
import { DiscountModule } from '@/discount/discount.module';
import { LoggerMiddleware } from '@/middlewares/logger.middleware';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductModule } from '@/product/product.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		ProductModule,
		CategoryModule,
		DiscountModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
