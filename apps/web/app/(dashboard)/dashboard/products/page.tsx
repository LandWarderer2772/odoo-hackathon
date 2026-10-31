'use client'

import React, { useEffect, useState } from 'react'
import { api, Product } from '@/lib/api'

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // New product form
  const [name, setName] = useState('')
  const [type, setType] = useState<'SERVICE' | 'GOODS'>('SERVICE')
  const [salesPrice, setSalesPrice] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [notes, setNotes] = useState('')
  const [variantName, setVariantName] = useState('')
  const [variantPriceExtra, setVariantPriceExtra] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const data = await api.getProducts('brightloop')
      setProducts(data)
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const newProduct = await api.createProduct({
        name,
        type,
        salesPrice,
        costPrice: costPrice || '0.00',
        notes,
        variants: variantName ? [{ name: variantName, priceExtra: variantPriceExtra || '0.00' }] : [],
      })
      setProducts([newProduct, ...products])
      setShowCreateModal(false)
      setName('')
      setSalesPrice('')
      setCostPrice('')
      setNotes('')
      setVariantName('')
      setVariantPriceExtra('')
    } catch (err: any) {
      alert(err.message || 'Failed to create product')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
            Catalog Management
          </span>
          <h1 className="text-3xl font-bold text-white tracking-tight mt-1">Products & Variants</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your service offerings, hardware goods, and variant-specific price extras.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:brightness-110 transition"
        >
          <span>+</span>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Product List */}
      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-white/5 border border-white/10" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-slate-500 border border-dashed border-white/10 rounded-2xl">
            No products found. Click &quot;Add New Product&quot; to create your first catalog item.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-white/10 bg-[#0c1220] p-6 space-y-4 hover:border-cyan-400/30 transition shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {p.type}
                    </span>
                    <span className="text-xl font-bold text-white">${p.salesPrice}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-3">{p.name}</h3>
                  {p.notes && <p className="text-xs text-slate-400 mt-1">{p.notes}</p>}

                  {p.variants && p.variants.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Variants & Surcharges:
                      </span>
                      <div className="space-y-1">
                        {p.variants.map((v) => (
                          <div
                            key={v.id}
                            className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-slate-900/60"
                          >
                            <span className="text-slate-300">{v.name}</span>
                            <span className="font-mono text-cyan-300 font-bold">
                              {Number(v.priceExtra) > 0 ? `+$${v.priceExtra}` : 'Included'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                  <span>Cost: ${p.costPrice || '0.00'}</span>
                  <span className="text-emerald-400 font-medium">● Active in catalog</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c1220] p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white">Create New Catalog Product</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Enterprise Cloud Analytics"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Product Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="SERVICE">SERVICE</option>
                    <option value="GOODS">GOODS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sales Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(e.target.value)}
                    placeholder="120.00"
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Internal Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Description or internal billing notes"
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl border border-white/5 bg-slate-900/50 space-y-3">
                <span className="text-xs font-bold text-cyan-300">Optional Initial Variant</span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={variantName}
                    onChange={(e) => setVariantName(e.target.value)}
                    placeholder="Variant name (e.g. Pro)"
                    className="rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={variantPriceExtra}
                    onChange={(e) => setVariantPriceExtra(e.target.value)}
                    placeholder="Price extra (+$70.00)"
                    className="rounded-lg border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-cyan-400 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-300 transition"
                >
                  {submitting ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
