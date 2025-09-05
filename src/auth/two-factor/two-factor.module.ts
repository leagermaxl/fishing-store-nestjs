import { Module } from '@nestjs/common';

import { TwoFactorService } from '@/auth/two-factor/two-factor.service';
import { MailService } from '@/lib/mail/mail.service';

@Module({
	providers: [TwoFactorService, MailService],
})
export class TwoFactorModule {}
