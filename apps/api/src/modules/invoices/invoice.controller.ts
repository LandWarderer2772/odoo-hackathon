import { FastifyReply, FastifyRequest } from 'fastify';
import { invoiceService } from './invoice.service.js';
import {
  createInvoiceSchema,
  invoiceQuerySchema,
  generateDueInvoicesSchema,
  updateInvoiceStatusSchema,
} from './invoice.schema.js';
import { successResponse } from '../../utils/response.js';
import { ForbiddenError } from '../../utils/errors.js';

export class InvoiceController {
  async listInvoices(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const query = invoiceQuerySchema.parse(request.query);
    const result = await invoiceService.listInvoices(businessId, query);
    return reply.send(successResponse(result));
  }

  async getInvoiceById(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const result = await invoiceService.getInvoiceById(businessId, id);
    return reply.send(successResponse(result));
  }

  async createInvoice(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const validated = createInvoiceSchema.parse(request.body);
    const result = await invoiceService.createInvoice(businessId, validated);
    return reply.status(201).send(successResponse(result, 'Invoice created successfully'));
  }

  async confirmInvoice(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const result = await invoiceService.confirmInvoice(businessId, id);
    return reply.send(successResponse(result, 'Invoice confirmed and issued'));
  }

  async cancelInvoice(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const body = (request.body as { reason?: string }) || {};
    const result = await invoiceService.cancelInvoice(businessId, id, body.reason);
    return reply.send(successResponse(result, 'Invoice cancelled'));
  }

  async generateDueInvoices(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const validated = generateDueInvoicesSchema.parse(request.body || {});
    const cutoffDate = validated.cutoffDate ? new Date(validated.cutoffDate) : new Date();

    const result = await invoiceService.generateDueInvoices(businessId, cutoffDate);
    return reply.send(successResponse(result, result.message));
  }

  async getInvoicePdf(request: FastifyRequest, reply: FastifyReply) {
    const businessId = request.businessId || request.user?.businessId;
    if (!businessId) {
      throw new ForbiddenError('Business tenant context required');
    }

    const { id } = request.params as { id: string };
    const html = await invoiceService.renderInvoiceHtml(businessId, id);

    reply.header('Content-Type', 'text/html; charset=utf-8');
    reply.header('Content-Disposition', `inline; filename="invoice-${id}.html"`);
    return reply.send(html);
  }
}

export const invoiceController = new InvoiceController();
