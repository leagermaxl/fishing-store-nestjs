import { PrismaClient } from '@prisma/client';
import {
	attributes,
	categories,
	discounts,
	products,
	variants,
	variantsAttributes,
	variantTypes,
} from './constants';

const prisma = new PrismaClient();

async function up() {
	await prisma.category.createMany({
		data: categories,
	});

	await prisma.variantType.createMany({
		data: variantTypes,
	});

	if (discounts && discounts.length > 0) {
		await prisma.discount.createMany({
			data: discounts.map((discount) => ({
				...discount,
				startDate: discount.startDate ? new Date(discount.startDate) : null,
				endDate: discount.endDate ? new Date(discount.endDate) : null,
			})),
		});
		console.log('Discounts created successfully');
	} else {
		console.log('No discounts found to create');
	}

	await prisma.product.createMany({
		data: products,
	});
	console.log('Products created successfully');

	await prisma.productAttribute.createMany({
		data: attributes,
	});
	console.log('Product attributes created successfully');

	await prisma.productVariant.createMany({
		data: variants,
	});
	console.log('Product variants created successfully');

	await prisma.productVariantAttribute.createMany({
		data: variantsAttributes,
	});
	console.log('Product variant attributes created successfully');
}

async function down() {
	await prisma.$executeRaw`TRUNCATE TABLE "product_variant_attributes" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "product_variants" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "product_attributes" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "products" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "discounts" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "variant_types" RESTART IDENTITY CASCADE`;
	await prisma.$executeRaw`TRUNCATE TABLE "categories" RESTART IDENTITY CASCADE`;
	console.log('All data cleared');
}

async function main() {
	try {
		await down();
		await up();
		console.log('Seeding completed successfully');
	} catch (error) {
		console.error('Seeding failed:', error);
		throw error;
	}
}

main()
	.catch((e) => {
		console.error('Error during seeding:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
