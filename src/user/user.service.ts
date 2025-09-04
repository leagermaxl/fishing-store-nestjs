import { Injectable, NotFoundException } from '@nestjs/common';
import { Account, User } from '@prisma/client';
import { hash } from 'argon2';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { USER_NOT_FOUND } from '@/user/user.constants';

export interface UserWithAccounts extends User {
	accounts: Account[];
}

@Injectable()
export class UserService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findById(id: string): Promise<UserWithAccounts> {
		const user = await this.prismaService.user.findUnique({
			where: { id },
			include: { accounts: true },
		});
		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		}

		return user;
	}

	public async findByEmail(email: string): Promise<UserWithAccounts | null> {
		const user = await this.prismaService.user.findUnique({
			where: { email },
			include: { accounts: true },
		});

		return user;
	}

	public async create(dto: CreateUserDto): Promise<UserWithAccounts> {
		const { email, name, password, picture, isVerified, methods } = dto;

		const user = this.prismaService.user.create({
			data: {
				email,
				name,
				password: await hash(password),
				picture,
				isVerified,
				methods,
				accounts: { create: [] },
			},
			include: { accounts: true },
		});

		return user;
	}

	public async update(id: string, dto: UpdateUserDto): Promise<UserWithAccounts> {
		const { email, name, password, picture, isVerified, methods } = dto;

		const user = this.prismaService.user.update({
			where: { id },
			data: {
				email,
				name,
				password: password && (await hash(password)),
				picture,
				isVerified,
				methods,
			},
			include: { accounts: true },
		});

		return user;
	}
}
