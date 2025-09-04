import { applyDecorators, UseGuards } from '@nestjs/common';

import { AuthProviderGuard } from '@/auth/guards/auth-provider.guard';

export function AuthProvider() {
	return applyDecorators(UseGuards(AuthProviderGuard));
}
