import { DynamicModule, Module } from '@nestjs/common';

import {
	ProviderModuleAsyncOptions,
	ProviderModuleOptions,
	ProviderOptionsSymbol,
} from '@/provider/provider.constants';
import { ProviderService } from '@/provider/provider.service';

@Module({})
export class ProviderModule {
	public static register(options: ProviderModuleOptions): DynamicModule {
		return {
			module: ProviderModule,
			providers: [
				{
					useValue: options.services,
					provide: ProviderOptionsSymbol,
				},
				ProviderService,
			],
			exports: [ProviderService],
		};
	}

	public static registerAsync(options: ProviderModuleAsyncOptions): DynamicModule {
		return {
			module: ProviderModule,
			imports: options.imports,
			providers: [
				{
					provide: ProviderOptionsSymbol,
					inject: options.inject,
					useFactory: options.useFactory,
				},
				ProviderService,
			],
			exports: [ProviderService],
		};
	}
}
