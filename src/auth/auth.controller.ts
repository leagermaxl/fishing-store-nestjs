import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
} from '@nestjs/common';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Request, Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { AuthProvider } from '@/auth/decorators/auth-provider.decorator';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { ProviderService } from '@/provider/provider.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService,
	) {}

	@Recaptcha()
	@HttpCode(HttpStatus.CREATED)
	@Post('register')
	public async register(@Req() req: Request, @Body() dto: RegisterDto) {
		return await this.authService.register(req, dto);
	}

	@Recaptcha()
	@HttpCode(HttpStatus.OK)
	@Post('login')
	public async login(@Req() req: Request, @Body() dto: LoginDto) {
		return await this.authService.login(req, dto);
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post('logout')
	public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		return await this.authService.logout(req, res);
	}

	@AuthProvider()
	@Post('oauth/:provider')
	public connect(@Param('provider') provider: string) {
		const providerInstance = this.providerService.findByService(provider);
		if (!providerInstance) {
			throw new BadRequestException('bad request');
		}
		return { url: providerInstance.getAuthUrl() };
	}

	@AuthProvider()
	@Get('oauth/callback/:provider')
	public async callback(
		@Param('provider') provider: string,
		@Query('code') code: string,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const providerInstance = this.providerService.findByService(provider);
		if (!providerInstance) {
			throw new BadRequestException('bad request');
		}

		await this.authService.extractProfileFromCode(code, providerInstance, req);
		return res.redirect('http://localhost:4200/users/profile');
	}
}
