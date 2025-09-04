import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post('register')
	public async register(@Req() req: Request, @Body() dto: RegisterDto) {
		return await this.authService.register(req, dto);
	}

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
}
