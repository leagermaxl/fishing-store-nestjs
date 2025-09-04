import { ConfigService } from '@nestjs/config';

import { ProviderModuleOptions } from '@/provider/provider.constants';
import { GithubProvider } from '@/provider/services/github.provider';
import { GoogleProvider } from '@/provider/services/google.provider';

export function getProviderOptions(configService: ConfigService): ProviderModuleOptions {
	return {
		baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
		services: [
			new GoogleProvider({
				client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
				client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
				scopes: ['email', 'profile'],
			}),
			new GithubProvider({
				client_id: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
				client_secret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
				scopes: ['user'],
			}),
		],
	};
}
