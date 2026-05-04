import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChefHat, ScanLine, Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'

const features = [
  {
    icon: ScanLine,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    title: 'Scan & Track',
    desc: 'Scan barcodes or QR codes to instantly add items to your smart pantry.',
  },
  {
    icon: Sparkles,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    title: 'Smart Matching',
    desc: 'Discover recipes you can make right now based on what\'s in your pantry.',
  },
  {
    icon: ShieldCheck,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    title: 'Save Favourites',
    desc: 'Build your personal cookbook by saving recipes you love.',
  },
]

const perks = [
  'No food waste with smart ingredient tracking',
  'Hundreds of recipes across all cuisines',
  'Works on any device — mobile or desktop',
  'Free to get started',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-orange-500 rounded-lg flex items-center justify-center shadow-glow">
              <ChefHat size={14} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">UCook</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(34,197,94,0.06)' }} />
        <div className="absolute top-40 left-1/3 w-[300px] h-[300px] rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(249,115,22,0.06)' }} />

        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
              <Sparkles size={14} />
              Your smart kitchen companion
            </span>

            <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Cook smarter with{' '}
              <span className="gradient-text">what you have</span>
            </h1>

            <p className="text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
              UCook tracks your pantry and suggests recipes you can make right now.
              No more staring at the fridge wondering what to cook.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register">
                <Button variant="primary" size="lg" iconRight={<ArrowRight size={18} />}>
                  Start cooking free
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  I already have an account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold mb-3">Everything you need in the kitchen</h2>
            <p className="text-text-secondary">Powerful features wrapped in a clean, minimal interface.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-bg-surface border border-border rounded-2xl p-6 hover:border-border-strong transition-colors"
              >
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon size={20} className={f.color} />
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks list */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="gradient-border rounded-3xl p-8 text-center"
          >
            <h2 className="text-2xl font-extrabold mb-8">Why UCook?</h2>
            <ul className="space-y-3 text-left max-w-sm mx-auto">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm text-text-secondary">
                  <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                  {perk}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/register">
                <Button variant="primary" size="lg">
                  Create free account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center text-sm text-text-muted">
        <p>© {new Date().getFullYear()} UCook. Made with ❤️ for home cooks.</p>
      </footer>
    </div>
  )
}
