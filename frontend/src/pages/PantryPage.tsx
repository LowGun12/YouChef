import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanLine, Plus, Search, Package, Trash2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { usePantryStore } from '@/stores/pantryStore'
import { mockPantryItems } from '@/utils/mockData'
import PantryCard from '@/features/pantry/components/PantryCard'
import QRScanner from '@/features/pantry/components/QRScanner'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import type { IngredientCategory, BarcodeResult } from '@/types'

const CATEGORIES: IngredientCategory[] = ['produce', 'dairy', 'meat', 'grains', 'condiments', 'frozen', 'beverages', 'other']

const addSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['produce', 'dairy', 'meat', 'grains', 'condiments', 'frozen', 'beverages', 'other']),
  quantity: z.coerce.number().positive().optional(),
  unit: z.string().optional(),
})

type AddForm = z.infer<typeof addSchema>

export default function PantryPage() {
  const { items, setItems, addItem, removeItem } = usePantryStore()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<IngredientCategory | 'all'>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [scannedData, setScannedData] = useState<BarcodeResult | null>(null)

  // Seed on first load
  const pantryItems = items.length > 0 ? items : mockPantryItems

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AddForm>({
    resolver: zodResolver(addSchema),
    defaultValues: { category: 'other' },
  })

  const filtered = useMemo(() => {
    return pantryItems.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = activeCategory === 'all' || item.category === activeCategory
      return matchSearch && matchCat
    })
  }, [pantryItems, search, activeCategory])

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<IngredientCategory, number>> = {}
    pantryItems.forEach((i) => {
      counts[i.category] = (counts[i.category] ?? 0) + 1
    })
    return counts
  }, [pantryItems])

  const onAdd = (data: AddForm) => {
    addItem({
      id: `local-${Date.now()}`,
      userId: 'local',
      name: data.name,
      category: data.category,
      quantity: data.quantity,
      unit: data.unit || undefined,
      addedAt: new Date().toISOString(),
    })
    if (items.length === 0) setItems([...mockPantryItems])
    reset()
    setShowAddModal(false)
  }

  const handleScanResult = (result: BarcodeResult) => {
    setScannedData(result)
    setShowScanner(false)
    setShowAddModal(true)
    if (result.ingredient) {
      setValue('name', result.ingredient)
      setValue('category', (result.category as IngredientCategory) ?? 'other')
    }
  }

  const handleRemove = (id: string) => {
    if (items.length === 0) {
      // Operating on mock data — seed first, then remove
      setItems(mockPantryItems.filter((i) => i.id !== id))
    } else {
      removeItem(id)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">My Pantry</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {pantryItems.length} item{pantryItems.length !== 1 ? 's' : ''} tracked
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<ScanLine size={15} />}
            onClick={() => setShowScanner(true)}
          >
            Scan
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={15} />}
            onClick={() => { setScannedData(null); setShowAddModal(true) }}
          >
            Add item
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search pantry..."
          icon={<Search size={15} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
            activeCategory === 'all'
              ? 'bg-green-500/15 text-green-400 border-green-500/30'
              : 'bg-bg-surface text-text-muted border-border hover:border-border-strong'
          }`}
        >
          All ({pantryItems.length})
        </button>
        {CATEGORIES.filter((c) => categoryCounts[c]).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border capitalize transition-all ${
              activeCategory === cat
                ? 'bg-green-500/15 text-green-400 border-green-500/30'
                : 'bg-bg-surface text-text-muted border-border hover:border-border-strong'
            }`}
          >
            {cat} ({categoryCounts[cat]})
          </button>
        ))}
      </div>

      {/* Items grid */}
      {filtered.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <PantryCard key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-bg-elevated rounded-2xl flex items-center justify-center mb-4">
            <Package size={28} className="text-text-muted" />
          </div>
          <p className="text-text-secondary font-medium mb-1">
            {search ? 'No items match your search' : 'Your pantry is empty'}
          </p>
          <p className="text-sm text-text-muted">
            {search ? 'Try a different keyword' : 'Scan a barcode or add items manually'}
          </p>
        </div>
      )}

      {/* QR Scanner */}
      <QRScanner
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onResult={handleScanResult}
      />

      {/* Add Item Modal */}
      <Modal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setScannedData(null); reset() }}
        title={scannedData ? 'Add scanned item' : 'Add pantry item'}
      >
        {scannedData && (
          <div className="mb-4 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-sm">
            <p className="text-green-400 font-medium">Barcode found: <span className="font-mono">{scannedData.code}</span></p>
            {!scannedData.ingredient && (
              <p className="text-text-muted text-xs mt-1">Unknown product — please fill in the details below.</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
          <Input
            label="Item name"
            placeholder="e.g. Cherry Tomatoes"
            error={errors.name?.message}
            {...register('name')}
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Category</label>
            <select
              className="input-base"
              {...register('category')}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-bg-elevated capitalize">{c}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="Quantity"
                type="number"
                placeholder="e.g. 6"
                error={errors.quantity?.message}
                {...register('quantity')}
              />
            </div>
            <div className="flex-1">
              <Input
                label="Unit"
                placeholder="e.g. pcs, g, ml"
                {...register('unit')}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="submit" variant="primary" className="flex-1">
              Add to pantry
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setShowAddModal(false); setScannedData(null); reset() }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
