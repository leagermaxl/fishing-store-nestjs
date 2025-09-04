import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { USER_NOT_AUTHORIZED } from '@/auth/auth.constants';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
	public constructor(private readonly userService: UserService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const userId = request.session.userId;
		if (!userId) {
			throw new UnauthorizedException(USER_NOT_AUTHORIZED);
		}

		const user = await this.userService.findById(userId);
		request.user = user;

		return true;
	}
}
