import { Module } from '@nestjs/common';

import { DiscountController } from '@/discount/discount.controller';
import { DiscountService } from '@/discount/discount.service';

@Module({
	controllers: [DiscountController],
	providers: [DiscountService],
})
export class DiscountModule {}
