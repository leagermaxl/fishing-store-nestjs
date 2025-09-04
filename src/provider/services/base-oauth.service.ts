import { BadGatewayException, Injectable, UnauthorizedException } from '@nestjs/common';
import deepmerge from 'deepmerge';

import {
	FAILED_GET_USER_FROM_TOKEN,
	FAILED_GET_USER_TOKEN,
	NOT_TOKENS_FOR_USER,
} from '@/provider/provider.constants';
import { BaseProviderOptions } from '@/provider/services/types/base-provider-options.type';
import { UserInfo } from '@/provider/services/types/user-info.type';

@Injectable()
export class BaseOAuthService {
	private BASE_URL: string;
	public constructor(private readonly options: BaseProviderOptions) {}

	public getAuthUrl() {
		const query = new URLSearchParams({
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectUrl(),
			response_type: 'code',
			scope: (this.options.scopes || []).join(' '),
			access_type: 'offline',
			prompt: 'select_account',
		});
		return `${this.options.authorize_url}?${query}`;
	}

	protected extractUserInfo(data: any): Promise<UserInfo> {
		return {
			...data,
			provider: this.options.name,
		};
	}

	public async findUserByCode(code: string): Promise<UserInfo> {
		const client_id = this.options.client_id;
		const client_secret = this.options.client_secret;

		const tokenQuery = new URLSearchParams({
			client_id,
			client_secret,
			code,
			grant_type: 'authorization_code',
			redirect_uri: this.getRedirectUrl(),
		});

		const tokenResponse = await fetch(this.options.access_url, {
			method: 'POST',
			body: tokenQuery,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json',
			},
		});
		if (!tokenResponse.ok) {
			throw new BadGatewayException(FAILED_GET_USER_TOKEN);
		}

		const token = await tokenResponse.json();

		if (!token.access_token) {
			throw new BadGatewayException(NOT_TOKENS_FOR_USER);
		}

		const userInfoArray: any[] = [];
		for (const profile_url of this.options.profile_urls) {
			const userResponse = await fetch(profile_url, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token.access_token}`,
				},
			});

			if (!userResponse.ok) {
				throw new UnauthorizedException(FAILED_GET_USER_FROM_TOKEN);
			}

			const user = await userResponse.json();

			if (Array.isArray(user)) {
				const urlSplit = profile_url.split('/');
				const keyName = urlSplit[urlSplit.length - 1];

				userInfoArray.push({ [keyName]: user });
			} else {
				userInfoArray.push(user);
			}
		}

		const userInfo = deepmerge.all(userInfoArray);
		const userData = await this.extractUserInfo(userInfo);

		return {
			...userData,
			access_token: token.access_token,
			refresh_token: token.refresh_token,
			expires_at: token.expires_in || token.expires_at,
			provider: this.options.name,
		};
	}

	public getRedirectUrl() {
		return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`;
	}

	set baseUrl(value: string) {
		this.BASE_URL = value;
	}

	get name() {
		return this.options.name;
	}

	get access_url() {
		return this.options.access_url;
	}

	get profile_urls() {
		return this.options.profile_urls;
	}
	get scopes() {
		return this.options.scopes;
	}
}
