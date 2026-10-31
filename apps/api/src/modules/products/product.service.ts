import { and, eq } from 'drizzle-orm';
import { db, products, productVariants, Product, ProductVariant, Database } from '@brightloop/db';
import {
  CreateProductInput,
  UpdateProductInput,
  CreateVariantInput,
  UpdateVariantInput,
} from './product.schema.js';
import { NotFoundError } from '../../utils/errors.js';

export class ProductService {
  /**
   * Create a product and optional initial variants
   */
  async createProduct(businessId: string, input: CreateProductInput, targetDb: Database = db) {
    const [product] = await targetDb
      .insert(products)
      .values({
        businessId,
        name: input.name.trim(),
        type: input.type,
        salesPrice: input.salesPrice,
        costPrice: input.costPrice,
        notes: input.notes,
      })
      .returning();

    let createdVariants: ProductVariant[] = [];

    if (input.variants && input.variants.length > 0) {
      createdVariants = await targetDb
        .insert(productVariants)
        .values(
          input.variants.map((v) => ({
            productId: product.id,
            name: v.name.trim(),
            sku: v.sku,
            priceExtra: v.priceExtra || '0.00',
          }))
        )
        .returning();
    }

    return {
      ...product,
      variants: createdVariants,
    };
  }

  /**
   * List products strictly within business tenant
   */
  async listProducts(
    businessId: string,
    filter?: { type?: 'SERVICE' | 'GOODS'; activeOnly?: boolean },
    targetDb: Database = db
  ) {
    const whereConditions = [eq(products.businessId, businessId)];

    if (filter?.type) {
      whereConditions.push(eq(products.type, filter.type));
    }

    if (filter?.activeOnly) {
      whereConditions.push(eq(products.isActive, true));
    }

    return targetDb.query.products.findMany({
      where: and(...whereConditions),
      with: {
        variants: true,
      },
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
  }

  /**
   * Get single product with its variants, enforcing tenant isolation
   */
  async getProductById(businessId: string, productId: string, targetDb: Database = db) {
    const product = await targetDb.query.products.findFirst({
      where: and(eq(products.id, productId), eq(products.businessId, businessId)),
      with: {
        variants: true,
      },
    });

    if (!product) {
      throw new NotFoundError('Product not found in this business');
    }

    return product;
  }

  /**
   * Update product details
   */
  async updateProduct(
    businessId: string,
    productId: string,
    input: UpdateProductInput,
    targetDb: Database = db
  ) {
    await this.getProductById(businessId, productId, targetDb);

    const [updated] = await targetDb
      .update(products)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, productId), eq(products.businessId, businessId)))
      .returning();

    return updated;
  }

  /**
   * Soft delete / deactivate product
   */
  async deleteProduct(businessId: string, productId: string, targetDb: Database = db) {
    await this.getProductById(businessId, productId, targetDb);

    const [deactivated] = await targetDb
      .update(products)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, productId), eq(products.businessId, businessId)))
      .returning();

    return deactivated;
  }

  /**
   * Add variant to an existing product
   */
  async addVariant(
    businessId: string,
    productId: string,
    input: CreateVariantInput,
    targetDb: Database = db
  ) {
    await this.getProductById(businessId, productId, targetDb);

    const [variant] = await targetDb
      .insert(productVariants)
      .values({
        productId,
        name: input.name.trim(),
        sku: input.sku,
        priceExtra: input.priceExtra || '0.00',
      })
      .returning();

    return variant;
  }

  /**
   * Update variant
   */
  async updateVariant(
    businessId: string,
    productId: string,
    variantId: string,
    input: UpdateVariantInput,
    targetDb: Database = db
  ) {
    await this.getProductById(businessId, productId, targetDb);

    const variant = await targetDb.query.productVariants.findFirst({
      where: and(eq(productVariants.id, variantId), eq(productVariants.productId, productId)),
    });

    if (!variant) {
      throw new NotFoundError('Variant not found for this product');
    }

    const [updated] = await targetDb
      .update(productVariants)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(productVariants.id, variantId))
      .returning();

    return updated;
  }

  /**
   * Delete variant
   */
  async deleteVariant(
    businessId: string,
    productId: string,
    variantId: string,
    targetDb: Database = db
  ) {
    await this.getProductById(businessId, productId, targetDb);

    const variant = await targetDb.query.productVariants.findFirst({
      where: and(eq(productVariants.id, variantId), eq(productVariants.productId, productId)),
    });

    if (!variant) {
      throw new NotFoundError('Variant not found for this product');
    }

    await targetDb.delete(productVariants).where(eq(productVariants.id, variantId));
    return { message: 'Variant deleted successfully' };
  }
}

export const productService = new ProductService();
