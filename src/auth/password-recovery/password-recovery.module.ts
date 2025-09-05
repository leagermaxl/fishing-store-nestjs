import { Module } from '@nestjs/common';

import { PasswordRecoveryController } from '@/auth/password-recovery/password-recovery.controller';
import { PasswordRecoveryService } from '@/auth/password-recovery/password-recovery.service';
import { MailService } from '@/lib/mail/mail.service';
import { UserService } from '@/user/user.service';

@Module({
	controllers: [PasswordRecoveryController],
	providers: [PasswordRecoveryService, UserService, MailService],
})
export class PasswordRecoveryModule {}
