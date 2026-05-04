import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { motion } from 'framer-motion'
import { Camera, ScanLine, Keyboard } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { qrBarcodeDatabase } from '@/utils/mockData'
import type { BarcodeResult } from '@/types'

interface QRScannerProps {
  open: boolean
  onClose: () => void
  onResult: (result: BarcodeResult) => void
}

export default function QRScanner({ open, onClose, onResult }: QRScannerProps) {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan')
  const [scanning, setScanning] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [error, setError] = useState('')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const divId = 'qr-reader'

  const startScanner = async () => {
    setError('')
    setScanning(true)
    try {
      const scanner = new Html5Qrcode(divId)
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          handleCode(decodedText)
          stopScanner()
        },
        undefined,
      )
    } catch {
      setError('Camera access denied. Use manual entry instead.')
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
        scannerRef.current.clear()
      } catch {
        /* scanner may already be stopped */
      }
      scannerRef.current = null
    }
    setScanning(false)
  }

  const handleCode = (code: string) => {
    const match = qrBarcodeDatabase[code]
    onResult({
      code,
      ingredient: match?.name,
      category: match?.category as BarcodeResult['category'],
    })
  }

  const handleManual = () => {
    if (!manualCode.trim()) return
    handleCode(manualCode.trim())
    setManualCode('')
  }

  useEffect(() => {
    if (!open) {
      stopScanner()
      setMode('scan')
      setError('')
    }
  }, [open])

  useEffect(() => {
    if (open && mode === 'scan') {
      const timer = setTimeout(startScanner, 300)
      return () => clearTimeout(timer)
    } else {
      stopScanner()
    }
  }, [open, mode])

  return (
    <Modal open={open} onClose={onClose} title="Scan Barcode / QR Code" size="md">
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('scan')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
            mode === 'scan'
              ? 'bg-green-500/15 text-green-400 border border-green-500/30'
              : 'bg-bg-elevated text-text-muted hover:text-text-secondary border border-border'
          }`}
        >
          <Camera size={16} />
          Camera
        </button>
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-all ${
            mode === 'manual'
              ? 'bg-green-500/15 text-green-400 border border-green-500/30'
              : 'bg-bg-elevated text-text-muted hover:text-text-secondary border border-border'
          }`}
        >
          <Keyboard size={16} />
          Manual
        </button>
      </div>

      {mode === 'scan' ? (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-square">
            <div id={divId} className="w-full h-full" />

            {scanning && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-8 border-2 border-green-400/60 rounded-2xl" />
                {['top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8'].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-5 h-5 border-2 border-green-400 rounded-sm`} />
                ))}
                <motion.div
                  animate={{ y: ['2rem', 'calc(100% - 4rem)'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                  className="absolute left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"
                />
              </div>
            )}

            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-bg-surface">
                <div className="text-center text-text-muted">
                  <ScanLine size={48} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Starting camera...</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <p className="text-xs text-text-muted text-center">
            Try demo codes: <span className="font-mono text-green-400">DEMO001</span>, <span className="font-mono text-green-400">DEMO002</span>, <span className="font-mono text-green-400">DEMO003</span>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Enter a barcode number or product code manually.
          </p>
          <Input
            label="Barcode / Product Code"
            placeholder="e.g. DEMO001 or 5000112637922"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManual()}
          />

          <div className="bg-bg-elevated rounded-xl p-3 space-y-1.5">
            <p className="text-xs font-medium text-text-secondary mb-2">Demo codes to try:</p>
            {['DEMO001 → Cherry Tomatoes', 'DEMO002 → Whole Milk', 'DEMO003 → Free Range Eggs', 'DEMO004 → Sourdough Bread'].map((demo) => (
              <button
                key={demo}
                onClick={() => setManualCode(demo.split(' ')[0])}
                className="block w-full text-left text-xs text-text-muted hover:text-green-400 transition-colors py-0.5"
              >
                <span className="font-mono">{demo}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button variant="primary" className="flex-1" onClick={handleManual} disabled={!manualCode.trim()}>
              Look Up
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
