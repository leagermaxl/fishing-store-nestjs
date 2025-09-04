import { FactoryProvider, ModuleMetadata } from '@nestjs/common';

import { BaseOAuthService } from '@/provider/services/base-oauth.service';

export const FAILED_GET_USER_TOKEN = 'Failed to get user token.';
export const NOT_TOKENS_FOR_USER = "Haven't tokens for user.";
export const FAILED_GET_USER_FROM_TOKEN = 'Failed to get user from this token.';
export const PROVIDER_NOT_EXIST = "Such provider don't exist.";

export const ProviderOptionsSymbol = Symbol();

export type ProviderModuleOptions = {
	baseUrl: string;
	services: BaseOAuthService[];
};

export type ProviderModuleAsyncOptions = Pick<ModuleMetadata, 'imports'> &
	Pick<FactoryProvider<ProviderModuleOptions>, 'useFactory' | 'inject'>;
