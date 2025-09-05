import {
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthMethod, User } from '@prisma/client';
import { verify } from 'argon2';
import { Request, Response } from 'express';

import {
	FAILED_DESTROY_SESSION,
	FAILED_SAVE_SESSION,
	USER_ALREADY_EXIST,
	USER_NOT_VERIFIED,
} from '@/auth/auth.constants';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { TwoFactorService } from '@/auth/two-factor/two-factor.service';
import { PrismaService } from '@/prisma/prisma.service';
import { BaseOAuthService } from '@/provider/services/base-oauth.service';
import { USER_NOT_FOUND } from '@/user/user.constants';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
		private readonly prismaService: PrismaService,
		@Inject(forwardRef(() => EmailConfirmationService))
		private readonly emailConfirmationService: EmailConfirmationService,
		private readonly twoFactorService: TwoFactorService,
	) {}

	public async register(req: Request, dto: RegisterDto) {
		const { email, name, password } = dto;

		const existUser = await this.userService.findByEmail(email);
		if (existUser) {
			throw new ConflictException(USER_ALREADY_EXIST);
		}

		const user = await this.userService.create({
			email,
			password,
			name,
			picture: '',
			methods: [AuthMethod.CREDENTIALS],
			isVerified: false,
		});

		await this.emailConfirmationService.sendVerificationToken(user.email);

		return { message: 'Mail for confirm account send to your email.' };
	}

	public async login(req: Request, dto: LoginDto) {
		const { email, password, code } = dto;

		const existUser = await this.userService.findByEmail(email);

		if (!existUser || !existUser.password) {
			throw new NotFoundException(USER_NOT_FOUND);
		}

		const isValid = await verify(existUser.password, password);
		if (!isValid) {
			throw new NotFoundException(USER_NOT_FOUND);
		}

		if (!existUser.isVerified) {
			await this.emailConfirmationService.sendVerificationToken(existUser.email);
			throw new UnauthorizedException(USER_NOT_VERIFIED);
		}

		if (existUser.isTwoFactor) {
			if (!code) {
				await this.twoFactorService.sendTwoFactorToken(existUser.email);

				return { message: 'Check mail and use two factor code.' };
			}

			await this.twoFactorService.validateTwoFactor(existUser.email, code);
		}

		return this.saveSession(req, existUser);
	}

	public async logout(req: Request, res: Response) {
		return new Promise((resolve, reject) => {
			return req.session.destroy((err) => {
				if (err) {
					return reject(new InternalServerErrorException(FAILED_SAVE_SESSION));
				}

				res.clearCookie(this.configService.getOrThrow<string>('COOKIE_SECRET'));
				resolve(null);
			});
		});
	}

	public async extractProfileFromCode(
		code: string,
		providerInstance: BaseOAuthService,
		req: Request,
	) {
		const profile = await providerInstance.findUserByCode(code);

		const account = await this.prismaService.account.findFirst({
			where: { User: { email: profile.email }, provider: profile.provider },
		});

		const existUser = account?.userId ? await this.userService.findById(account.userId) : null;

		if (existUser) {
			return this.saveSession(req, existUser);
		}

		let user = await this.userService.findByEmail(profile.email);
		if (user) {
			await this.userService.update(user.id, {
				methods: [...user.methods, AuthMethod[profile.provider.toUpperCase()]],
			});
		} else {
			user = await this.userService.create({
				email: profile.email,
				name: profile.name,
				password: '',
				picture: profile.picture,
				isVerified: false,
				methods: [AuthMethod[profile.provider.toUpperCase()]],
			});
		}

		if (!account) {
			await this.prismaService.account.create({
				data: {
					userId: user.id,
					provider: profile.provider,
					type: 'oauth',
					accessToken: profile.access_token,
					refreshToken: profile.refresh_token,
					expiresIn: parseInt(profile.expires_at!),
				},
			});
		}

		return this.saveSession(req, user);
	}

	public async saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.userId = user.id;

			return req.session.save((err) => {
				if (err) {
					return reject(new InternalServerErrorException(FAILED_DESTROY_SESSION));
				}

				resolve({ user });
			});
		});
	}
}
