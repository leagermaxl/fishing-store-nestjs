export type BaseProviderOptions = {
	name: string;
	authorize_url: string;
	access_url: string;
	profile_urls: string[];
	scopes: string[];
	client_id: string;
	client_secret: string;
};
