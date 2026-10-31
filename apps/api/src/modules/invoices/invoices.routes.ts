import { FastifyPluginAsync } from 'fastify';
import { invoiceController } from './invoice.controller.js';
import { requireStaffOrAdmin } from '../../middleware/rbac.middleware.js';
import { resolveTenant } from '../../middleware/tenant.middleware.js';

export const invoiceRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', fastify.authenticate);
  fastify.addHook('preHandler', resolveTenant);

  // Invoice Query & Detail
  fastify.get('/', invoiceController.listInvoices);
  fastify.get('/:id', invoiceController.getInvoiceById);

  // PDF / HTML Printable view
  fastify.get('/:id/pdf', invoiceController.getInvoicePdf);
  fastify.get('/:id/print', invoiceController.getInvoicePdf);

  // Operations (Staff / Admin)
  fastify.post('/', { preHandler: [requireStaffOrAdmin] }, invoiceController.createInvoice);
  fastify.post('/:id/confirm', { preHandler: [requireStaffOrAdmin] }, invoiceController.confirmInvoice);
  fastify.post('/:id/cancel', { preHandler: [requireStaffOrAdmin] }, invoiceController.cancelInvoice);

  // Manual / Batch Recurring Billing Trigger
  fastify.post('/generate-due', { preHandler: [requireStaffOrAdmin] }, invoiceController.generateDueInvoices);
};
