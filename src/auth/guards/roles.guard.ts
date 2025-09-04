import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User, UserRole } from '@prisma/client';

import { NOT_ENOUGH_RIGHTS } from '@/auth/auth.constants';
import { ROLES_KEY } from '@/auth/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	public canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		const request = context.switchToHttp().getRequest();
		const user: User = request.user;

		if (!roles) {
			return true;
		}

		if (!roles.includes(user.role)) {
			throw new ForbiddenException(NOT_ENOUGH_RIGHTS);
		}

		return true;
	}
}
