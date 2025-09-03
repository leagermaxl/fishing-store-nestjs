import { Module } from '@nestjs/common';

import { AttributeController } from '@/product/controllers/attribute.controller';
import { ProductController } from '@/product/controllers/product.controller';
import { VariantAttributeController } from '@/product/controllers/variant-attribute.controller';
import { VariantTypeController } from '@/product/controllers/variant-type.controller';
import { VariantController } from '@/product/controllers/variant.controller';
import { AttributeService } from '@/product/services/attribute.service';
import { ProductService } from '@/product/services/product.service';
import { VariantAttributeService } from '@/product/services/variant-attribute.service';
import { VariantTypeService } from '@/product/services/variant-type.service';
import { VariantService } from '@/product/services/variant.service';

@Module({
	controllers: [
		AttributeController,
		VariantController,
		VariantAttributeController,
		VariantTypeController,
		ProductController,
	],
	providers: [
		AttributeService,
		VariantService,
		VariantAttributeService,
		VariantTypeService,
		ProductService,
	],
})
export class ProductModule {}
