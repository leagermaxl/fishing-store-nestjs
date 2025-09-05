import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '@/auth/auth.module';
import { EmailConfirmationController } from '@/auth/email-confirmation/email-confirmation.controller';
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service';
import { MailService } from '@/lib/mail/mail.service';
import { UserService } from '@/user/user.service';

@Module({
	imports: [forwardRef(() => AuthModule)],
	controllers: [EmailConfirmationController],
	providers: [EmailConfirmationService, MailService, UserService],
	exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
