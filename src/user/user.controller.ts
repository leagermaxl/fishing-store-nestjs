import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';

import { Authorization } from '@/auth/decorators/auth.decorator';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { UserService } from '@/user/user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Authorization()
	@HttpCode(HttpStatus.OK)
	@Get('profile')
	public profile(@Authorized('email') email: string) {
		return { email };
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Patch(':id')
	public async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
		return await this.userService.update(id, dto);
	}
}
