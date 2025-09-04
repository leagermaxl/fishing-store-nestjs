import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { PROVIDER_NOT_EXIST } from '@/provider/provider.constants';
import { ProviderService } from '@/provider/provider.service';

@Injectable()
export class AuthProviderGuard implements CanActivate {
	public constructor(private readonly providerService: ProviderService) {}

	public canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest<Request>();

		const provider = this.providerService.findByService(request.params.provider);
		if (!provider) {
			throw new BadRequestException(PROVIDER_NOT_EXIST);
		}

		return true;
	}
}
