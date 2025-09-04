import { applyDecorators, UseGuards } from '@nestjs/common';

import { Roles } from '@/auth/decorators/roles.decorator';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';

export function Authorization(...roles: string[]) {
	if (roles.length > 0) {
		return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
	}
	return applyDecorators(UseGuards(AuthGuard));
}
