import { BaseOAuthService } from '@/provider/services/base-oauth.service';
import { ProviderOptions } from '@/provider/services/types/provider-options.type';
import { UserInfo } from '@/provider/services/types/user-info.type';

export class GoogleProvider extends BaseOAuthService {
	public constructor(options: ProviderOptions) {
		super({
			name: 'google',
			authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
			access_url: 'https://oauth2.googleapis.com/token',
			profile_urls: ['https://www.googleapis.com/oauth2/v3/userinfo'],
			client_id: options.client_id,
			client_secret: options.client_secret,
			scopes: options.scopes,
		});
	}

	public extractUserInfo(data: GoogleProfile): Promise<UserInfo> {
		return super.extractUserInfo({
			email: data.email,
			name: data.name,
			picture: data.picture,
		});
	}
}
export interface GoogleProfile extends Record<string, any> {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	hd: string;
}
