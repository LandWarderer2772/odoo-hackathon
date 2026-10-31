'use client'

import React from 'react'

export interface InvoicePDFDownloadButtonProps {
  invoiceId: string
  invoiceNumber?: string
}

export const InvoicePDFDownloadButton: React.FC<InvoicePDFDownloadButtonProps> = ({
  invoiceId,
  invoiceNumber,
}) => {
  const handleDownload = () => {
    const url = `http://localhost:4000/api/invoices/${invoiceId}/pdf`
    window.open(url, '_blank')
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      title={`Download PDF for ${invoiceNumber || invoiceId}`}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-400/40 text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(56,189,248,0.2)]"
    >
      <span>PDF</span>
      <span className="text-[10px]">↓</span>
    </button>
  )
}
