import { Module } from '@nestjs/common';
import { AttributeController } from './controllers/attribute.controller';
import { ProductController } from './controllers/product.controller';
import { VariantAttributeController } from './controllers/variant-attribute.controller';
import { VariantTypeController } from './controllers/variant-type.controller';
import { VariantController } from './controllers/variant.controller';
import { AttributeService } from './services/attribute.service';
import { ProductService } from './services/product.service';
import { VariantAttributeService } from './services/variant-attribute.service';
import { VariantTypeService } from './services/variant-type.service';
import { VariantService } from './services/variant.service';

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
