import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthMethod, User } from '@prisma/client';
import { verify } from 'argon2';
import { Request, Response } from 'express';

import {
	FAILED_DESTROY_SESSION,
	FAILED_SAVE_SESSION,
	USER_ALREADY_EXIST,
} from '@/auth/auth.constants';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { USER_NOT_FOUND } from '@/user/user.constants';
import { UserService } from '@/user/user.service';

@Injectable()
export class AuthService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
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

		return this.saveSession(req, user);
	}

	public async login(req: Request, dto: LoginDto) {
		const { email, password } = dto;

		const existUser = await this.userService.findByEmail(email);

		if (!existUser || !existUser.password) {
			throw new NotFoundException(USER_NOT_FOUND);
		}

		const isValid = await verify(existUser.password, password);
		if (!isValid) {
			throw new NotFoundException(USER_NOT_FOUND);
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
