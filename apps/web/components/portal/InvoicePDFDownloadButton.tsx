'use client'

import React from 'react'
import { Invoice } from '@/lib/api'

interface InvoicePDFDownloadButtonProps {
  invoice: Invoice
}

export function InvoicePDFDownloadButton({ invoice }: InvoicePDFDownloadButtonProps) {
  const handlePrintOrDownload = () => {
    const printWindow = window.open('', '_blank', 'width=800,height=900')
    if (!printWindow) return

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber} - BrightLoop</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #0f172a; line-height: 1.5; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .brand { font-size: 24px; font-weight: 800; color: #1d61e7; }
            .inv-meta { text-align: right; font-family: monospace; font-size: 14px; }
            .parties { display: flex; justify-content: space-between; margin: 30px 0; }
            .party-box { width: 45%; }
            .party-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { text-align: left; padding: 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-transform: uppercase; }
            td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .totals { margin-top: 30px; margin-left: auto; width: 300px; font-size: 14px; }
            .total-row { display: flex; justify-content: space-between; padding: 6px 0; }
            .total-row.grand { font-size: 18px; font-weight: 800; border-top: 2px solid #0f172a; padding-top: 10px; }
            .footer { margin-top: 50px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 20px; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">BrightLoop</div>
              <div style="font-size: 12px; color: #64748b;">Autonomous Subscription Platform</div>
            </div>
            <div class="inv-meta">
              <div style="font-size: 20px; font-weight: 700;">${invoice.invoiceNumber}</div>
              <div>Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}</div>
              <div>Due: ${new Date(invoice.dueDate).toLocaleDateString()}</div>
              <div>Status: <strong>${invoice.status}</strong></div>
            </div>
          </div>

          <div class="parties">
            <div class="party-box">
              <div class="party-title">Billed By:</div>
              <div><strong>Brightloop Software Inc.</strong></div>
              <div>123 Cloud Way, Tech City</div>
              <div>contact@brightloop.com</div>
            </div>
            <div class="party-box">
              <div class="party-title">Billed To:</div>
              <div><strong>${invoice.customerCompany || invoice.customerName || 'Acme Corp'}</strong></div>
              <div>Attn: ${invoice.customerName || 'David Banner'}</div>
              <div>account-receivable@client.com</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${
                invoice.items && invoice.items.length > 0
                  ? invoice.items
                      .map(
                        (item) => `
                    <tr>
                      <td>${item.description}</td>
                      <td style="text-align: center;">${item.quantity}</td>
                      <td style="text-align: right; font-family: monospace;">$${item.unitPrice}</td>
                      <td style="text-align: right; font-family: monospace;">$${item.subtotal}</td>
                    </tr>
                  `
                      )
                      .join('')
                  : `
                    <tr>
                      <td>Recurring Cloud SaaS Subscription Plan</td>
                      <td style="text-align: center;">1</td>
                      <td style="text-align: right; font-family: monospace;">$${invoice.amountTotal}</td>
                      <td style="text-align: right; font-family: monospace;">$${invoice.amountTotal}</td>
                    </tr>
                  `
              }
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span style="font-family: monospace;">$${invoice.amountTotal}</span>
            </div>
            <div class="total-row">
              <span>Amount Paid:</span>
              <span style="font-family: monospace; color: #16a34a;">-$${invoice.amountPaid}</span>
            </div>
            <div class="total-row grand">
              <span>Balance Due:</span>
              <span style="font-family: monospace; color: ${
                parseFloat(invoice.balanceDue) > 0 ? '#dc2626' : '#16a34a'
              };">$${invoice.balanceDue}</span>
            </div>
          </div>

          <div class="footer">
            Payment Terms: Net 30 Days. Direct Bank Wire routing information available in Portal. Thank you for your business.
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <button
      onClick={handlePrintOrDownload}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-400/30 transition-all cursor-pointer"
      title="Download or Print PDF Invoice"
    >
      <span>PDF / Print</span>
    </button>
  )
}
