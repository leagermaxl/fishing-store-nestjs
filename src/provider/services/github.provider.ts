import { BaseOAuthService } from '@/provider/services/base-oauth.service';
import { ProviderOptions } from '@/provider/services/types/provider-options.type';
import { UserInfo } from '@/provider/services/types/user-info.type';

export class GithubProvider extends BaseOAuthService {
	public constructor(options: ProviderOptions) {
		super({
			name: 'github',
			authorize_url: 'https://github.com/login/oauth/authorize',
			access_url: 'https://github.com/login/oauth/access_token',
			profile_urls: ['https://api.github.com/user', 'https://api.github.com/user/emails'],
			client_id: options.client_id,
			client_secret: options.client_secret,
			scopes: options.scopes,
		});
	}

	public extractUserInfo(data: GithubProfile): Promise<UserInfo> {
		return super.extractUserInfo({
			email: data.email ?? data.emails.find((e) => e.primary === true)?.email,
			name: data.name,
			picture: data.avatar_url,
		});
	}
}
export interface GithubProfile extends Record<string, any> {
	login: string;
	id: number;
	avatar_url: string;
	url: string;
	html_url: string;
	name: string;
	company: string | null;
	location: string;
	email: string | null;
	two_factor_authentication: boolean;
	emails: {
		email: string;
		primary: boolean;
		verified: boolean;
		visibility: string;
	}[];
}
