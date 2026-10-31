import { FastifyReply, FastifyRequest } from 'fastify';
import { productService } from './product.service.js';
import {
  createProductSchema,
  updateProductSchema,
  createVariantSchema,
  updateVariantSchema,
} from './product.schema.js';
import { successResponse } from '../../utils/response.js';
import { ForbiddenError } from '../../utils/errors.js';

export class ProductController {
  async createProduct(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const validated = createProductSchema.parse(request.body);
    const result = await productService.createProduct(businessId, validated, request.tenantDb);
    return reply.status(201).send(successResponse(result, 'Product created successfully'));
  }

  async listProducts(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const query = request.query as { type?: 'SERVICE' | 'GOODS'; activeOnly?: string };
    const result = await productService.listProducts(
      businessId,
      {
        type: query.type,
        activeOnly: query.activeOnly === 'true',
      },
      request.tenantDb
    );
    return reply.send(successResponse(result));
  }

  async getProductById(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id } = request.params as { id: string };
    const result = await productService.getProductById(businessId, id, request.tenantDb);
    return reply.send(successResponse(result));
  }

  async updateProduct(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id } = request.params as { id: string };
    const validated = updateProductSchema.parse(request.body);
    const result = await productService.updateProduct(businessId, id, validated, request.tenantDb);
    return reply.send(successResponse(result, 'Product updated successfully'));
  }

  async deleteProduct(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id } = request.params as { id: string };
    const result = await productService.deleteProduct(businessId, id, request.tenantDb);
    return reply.send(successResponse(result, 'Product deactivated successfully'));
  }

  async addVariant(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id: productId } = request.params as { id: string };
    const validated = createVariantSchema.parse(request.body);
    const result = await productService.addVariant(businessId, productId, validated, request.tenantDb);
    return reply.status(201).send(successResponse(result, 'Variant added successfully'));
  }

  async updateVariant(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id: productId, variantId } = request.params as { id: string; variantId: string };
    const validated = updateVariantSchema.parse(request.body);
    const result = await productService.updateVariant(
      businessId,
      productId,
      variantId,
      validated,
      request.tenantDb
    );
    return reply.send(successResponse(result, 'Variant updated successfully'));
  }

  async deleteVariant(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business context required');
    }

    const { id: productId, variantId } = request.params as { id: string; variantId: string };
    const result = await productService.deleteVariant(businessId, productId, variantId, request.tenantDb);
    return reply.send(successResponse(result));
  }
}

export const productController = new ProductController();
