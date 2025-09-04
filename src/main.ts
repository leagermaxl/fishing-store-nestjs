import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import RedisStore from 'connect-redis';
import CookieParser from 'cookie-parser';
import session from 'express-session';
import Redis from 'ioredis';

import { AppModule } from '@/app.module';
import { ms, StringValue } from '@/lib/common/utils/ms.util';
import { parseBoolean } from '@/lib/common/utils/parse-boolean.util';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService);
	const redis = new Redis(config.getOrThrow<string>('REDIS_URI'));

	app.use(CookieParser(config.getOrThrow<string>('COOKIE_SECRET')));

	app.useGlobalPipes(new ValidationPipe());

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
				secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
				sameSite: 'lax',
			},
			store: new RedisStore({
				client: redis,
				prefix: config.getOrThrow<string>('SESSION_FOLDER'),
			}),
		}),
	);

	const corsOptions: CorsOptions = {
		origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
		credentials: true,
		exposedHeaders: ['set-cookie'],
	};
	app.enableCors(corsOptions);

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}
bootstrap();
