import Link from 'next/link'

const metrics = [
  { label: 'Active subscriptions', value: '1,482', change: '+12.4%', detail: 'vs. last month', icon: '↻', tone: 'cyan' },
  { label: 'Monthly recurring revenue', value: '$142,500', change: '+8.2%', detail: 'ARR $1.71M', icon: '$', tone: 'blue' },
  { label: 'Collected · last 30 days', value: '$982,140', change: '+6.8%', detail: 'across 1,206 payments', icon: '↗', tone: 'green' },
  { label: 'Overdue invoices', value: '$18,450', change: '14 invoices', detail: 'Needs attention', icon: '!', tone: 'rose' },
]

const activity = [
  { initials: 'AC', name: 'Acme Corporation', plan: 'Enterprise Cloud Annual', amount: '$24,000.00', date: 'Today, 10:42 AM', status: 'Active', tone: 'green' },
  { initials: 'BS', name: 'Brightside Studio', plan: 'Core SaaS · Monthly', amount: '$1,760.00', date: 'Today, 9:18 AM', status: 'Quotation', tone: 'blue' },
  { initials: 'NB', name: 'Northstar Bakery', plan: 'Growth · Monthly', amount: '$840.00', date: 'Yesterday', status: 'Payment due', tone: 'amber' },
  { initials: 'VC', name: 'Vertex Consulting', plan: 'Enterprise Cloud Annual', amount: '$18,400.00', date: 'Yesterday', status: 'Active', tone: 'green' },
]

const navGroups = [
  { label: 'WORKSPACE', items: [{ icon: '⌂', name: 'Overview', href: '/dashboard', active: true }, { icon: '◉', name: 'Subscriptions', href: '/dashboard/subscriptions' }, { icon: '▤', name: 'Invoices', href: '/dashboard/invoices' }, { icon: '⇄', name: 'Payments', href: '/dashboard/payments' }, { icon: '♙', name: 'Customers', href: '/dashboard/customers' }] },
  { label: 'CONFIGURATION', items: [{ icon: '◇', name: 'Products', href: '/dashboard/products' }, { icon: '▦', name: 'Plans', href: '/dashboard/plans' }, { icon: '％', name: 'Discounts & tax', href: '/dashboard/settings' }, { icon: '♧', name: 'Staff management', href: '/dashboard/staff' }] },
]

function Arrow({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4.25 10h11.5m-4.75-4.75L15.75 10 11 14.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 lg:flex">
      <aside className="hidden lg:flex lg:w-[250px] lg:flex-col lg:border-r lg:border-white/[0.07] lg:bg-[#090e19] lg:px-4 lg:py-6">
        <Link href="/" className="mb-10 flex items-center gap-3 px-2" aria-label="BrightLoop home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 text-xl text-cyan-300">∞</span>
          <span><span className="block text-[17px] font-bold tracking-tight">Bright<span className="text-cyan-300">Loop</span></span><span className="block text-[9px] font-semibold uppercase tracking-[.18em] text-slate-500">Admin console</span></span>
        </Link>
        <nav aria-label="Admin navigation" className="flex-1 space-y-8">
          {navGroups.map((group) => <section key={group.label}>
            <h2 className="px-3 text-[10px] font-bold tracking-[.17em] text-slate-600">{group.label}</h2>
            <div className="mt-3 space-y-1">{group.items.map((item) => <Link key={item.name} href={item.href} aria-current={item.active ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${item.active ? 'border border-cyan-400/15 bg-cyan-400/[0.09] text-cyan-200 shadow-[inset_2px_0_0_#38bdf8]' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'}`}><span className="w-5 text-center text-base opacity-80">{item.icon}</span>{item.name}</Link>)}</div>
          </section>)}
        </nav>
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300"><span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /> Billing engine online</div>
          <p className="mt-2 text-[11px] text-slate-500">Next billing run <span className="text-slate-300">00:00 UTC</span></p>
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-950">JD</div>
          <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-200">Jordan Davis</p><p className="text-[10px] text-slate-500">Administrator</p></div>
          <Link href="/login" aria-label="Sign out" className="rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white">↗</Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="sticky top-0 z-10 border-b border-white/[0.07] bg-[#070b14]/85 backdrop-blur-xl">
          <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 sm:px-8">
            <div className="flex items-center gap-3"><span className="text-sm text-slate-500">Workspace</span><span className="text-slate-700">/</span><span className="text-sm font-semibold text-slate-100">Overview</span></div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-300 sm:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />All systems operational</div>
              <Link href="/dashboard/staff" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-xs font-bold text-[#03101c] shadow-[0_0_22px_rgba(56,189,248,.18)] transition hover:brightness-110"><span className="text-base leading-none">+</span><span className="hidden sm:inline">Invite staff</span><span className="sm:hidden">Invite</span></Link>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 sm:pt-10">
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-300/75">Saturday, October 31, 2026</p><h1 className="mt-2 font-display text-3xl font-bold tracking-[-.04em] text-white sm:text-[38px]">Good morning, Jordan<span className="text-cyan-300">.</span></h1><p className="mt-2 text-sm text-slate-400">Here’s what’s happening across your subscription business.</p></div>
            <Link href="/dashboard/reports" className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.035] px-4 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:text-white sm:self-auto">View finance reports <Arrow className="h-4 w-4" /></Link>
          </section>

          <section aria-label="Business performance" className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => <article key={metric.label} className="group relative overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0c1220]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.035)] transition hover:border-white/[0.13]">
              <div className={`absolute -right-8 -top-12 h-28 w-28 rounded-full blur-[55px] ${metric.tone === 'rose' ? 'bg-rose-500/15' : metric.tone === 'green' ? 'bg-emerald-400/15' : 'bg-cyan-400/10'}`} />
              <div className="relative flex items-start justify-between"><p className="text-xs font-medium text-slate-400">{metric.label}</p><span className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-semibold ${metric.tone === 'rose' ? 'bg-rose-400/10 text-rose-300' : metric.tone === 'green' ? 'bg-emerald-400/10 text-emerald-300' : 'bg-cyan-400/10 text-cyan-300'}`}>{metric.icon}</span></div>
              <p className="relative mt-5 font-display text-[27px] font-bold tracking-[-.04em] tabular-nums text-white">{metric.value}</p>
              <div className="relative mt-2 flex items-center gap-2 text-[11px]"><span className={`font-semibold ${metric.tone === 'rose' ? 'text-rose-300' : metric.tone === 'green' ? 'text-emerald-300' : 'text-cyan-300'}`}>{metric.change}</span><span className="text-slate-500">{metric.detail}</span></div>
            </article>)}
          </section>

          <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,.85fr)]">
            <article className="overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0c1220]/85 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-sm font-semibold text-white">Revenue overview</h2><p className="mt-1 text-xs text-slate-500">Recurring revenue and cash collected</p></div><div className="flex items-center gap-4 text-[10px] text-slate-400"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-cyan-300" />MRR</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-blue-500" />Collected</span><button className="rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-[10px] text-slate-300 hover:border-white/20" type="button">Last 6 months⌄</button></div></div>
              <div className="mt-6 flex items-baseline gap-2"><span className="font-display text-2xl font-bold tracking-tight text-white tabular-nums">$142,500</span><span className="text-[11px] text-emerald-300">+8.2% <span className="text-slate-500">this month</span></span></div>
              <div className="mt-5 h-[190px] w-full" role="img" aria-label="Revenue trend from May through October, rising from 118 thousand to 142 thousand dollars">
                <svg viewBox="0 0 700 190" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                  <defs><linearGradient id="mrrFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#38bdf8" stopOpacity=".2"/><stop offset="1" stopColor="#38bdf8" stopOpacity="0"/></linearGradient></defs>
                  {[25, 70, 115, 160].map((y) => <g key={y}><line x1="0" x2="700" y1={y} y2={y} stroke="rgba(148,163,184,.10)" strokeDasharray="3 6"/><text x="0" y={y - 5} fill="#64748b" fontSize="9">${y === 25 ? '150k' : y === 70 ? '140k' : y === 115 ? '130k' : '120k'}</text></g>)}
                  <path d="M52 148 C105 138 121 126 170 132 S244 111 288 115 S359 91 405 98 S479 68 523 78 S611 42 680 34 L680 170 L52 170 Z" fill="url(#mrrFill)"/>
                  <path d="M52 148 C105 138 121 126 170 132 S244 111 288 115 S359 91 405 98 S479 68 523 78 S611 42 680 34" fill="none" stroke="#67d7ff" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M52 155 C102 150 124 143 170 146 S247 131 288 138 S362 120 405 126 S477 105 523 112 S610 82 680 76" fill="none" stroke="#4779ff" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 5"/>
                  {[['MAY',52],['JUN',177],['JUL',302],['AUG',427],['SEP',552],['OCT',677]].map(([label, x]) => <text key={label} x={Number(x)} y="187" textAnchor="middle" fill="#64748b" fontSize="9">{label}</text>)}
                  <circle cx="680" cy="34" r="4" fill="#67d7ff" stroke="#0c1220" strokeWidth="2"/>
                </svg>
              </div>
            </article>

            <article className="rounded-2xl border border-white/[0.075] bg-[#0c1220]/85 p-5 sm:p-6">
              <div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold text-white">Collections health</h2><p className="mt-1 text-xs text-slate-500">Open invoice balance by age</p></div><Link href="/dashboard/invoices" aria-label="View invoices" className="rounded-lg p-1 text-slate-500 hover:text-white"><Arrow className="h-4 w-4" /></Link></div>
              <div className="mt-6 flex items-center gap-5"><div className="relative flex h-[132px] w-[132px] shrink-0 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#fb7185 0deg 78deg, #fb923c 78deg 161deg, #facc15 161deg 242deg, #263244 242deg 360deg)' }}><div className="absolute inset-[10px] flex flex-col items-center justify-center rounded-full bg-[#0c1220]"><span className="font-display text-xl font-bold text-white">$18.4k</span><span className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">outstanding</span></div></div>
                <div className="min-w-0 flex-1 space-y-3">{[{ label: '1–30 days', value: '$8,200', tone: 'bg-amber-300' }, { label: '31–60 days', value: '$5,100', tone: 'bg-orange-400' }, { label: '61+ days', value: '$5,150', tone: 'bg-rose-400' }].map((item) => <div key={item.label} className="flex items-center justify-between gap-2 text-[10px]"><span className="flex items-center gap-2 text-slate-400"><i className={`h-1.5 w-1.5 rounded-full ${item.tone}`} />{item.label}</span><span className="font-semibold tabular-nums text-slate-200">{item.value}</span></div>)}</div></div>
              <Link href="/dashboard/invoices?filter=overdue" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/[0.06] py-2.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/10">Review 14 overdue invoices <Arrow className="h-4 w-4" /></Link>
            </article>
          </section>

          <section className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(290px,.85fr)]">
            <article className="overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0c1220]/85">
              <div className="flex items-center justify-between px-5 py-5 sm:px-6"><div><h2 className="text-sm font-semibold text-white">Recent subscriptions</h2><p className="mt-1 text-xs text-slate-500">Latest customer activity</p></div><Link href="/dashboard/subscriptions" className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 hover:text-cyan-200">View all <Arrow className="h-4 w-4" /></Link></div>
              <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead><tr className="border-y border-white/[0.06] text-[9px] font-bold uppercase tracking-[.13em] text-slate-600"><th className="px-6 py-3">Customer</th><th className="px-4 py-3">Plan</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Updated</th><th className="px-5 py-3" /></tr></thead><tbody>{activity.map((row) => <tr key={row.name} className="border-b border-white/[0.045] last:border-0 hover:bg-white/[0.018]"><td className="px-6 py-3.5"><div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-slate-800 text-[9px] font-bold text-slate-300">{row.initials}</span><span className="whitespace-nowrap text-xs font-semibold text-slate-200">{row.name}</span></div></td><td className="px-4 py-3.5 text-xs text-slate-400">{row.plan}</td><td className="px-4 py-3.5 text-xs font-semibold tabular-nums text-slate-200">{row.amount}</td><td className="px-4 py-3.5"><span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[9px] font-semibold ${row.tone === 'green' ? 'bg-emerald-400/10 text-emerald-300' : row.tone === 'amber' ? 'bg-amber-300/10 text-amber-200' : 'bg-blue-400/10 text-blue-200'}`}>{row.status}</span></td><td className="whitespace-nowrap px-4 py-3.5 text-[10px] text-slate-500">{row.date}</td><td className="px-5 py-3.5 text-slate-600">···</td></tr>)}</tbody></table></div>
            </article>

            <article className="rounded-2xl border border-white/[0.075] bg-[#0c1220]/85 p-5 sm:p-6">
              <div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold text-white">Quick actions</h2><p className="mt-1 text-xs text-slate-500">Common tasks, one click away</p></div><span className="text-cyan-300">✦</span></div>
              <div className="mt-5 grid grid-cols-2 gap-2.5">{[{ icon: '+', title: 'New subscription', href: '/dashboard/subscriptions/new', color: 'cyan' }, { icon: '＋', title: 'Add product', href: '/dashboard/products', color: 'blue' }, { icon: '⇄', title: 'Record payment', href: '/dashboard/payments', color: 'green' }, { icon: '▤', title: 'Create invoice', href: '/dashboard/invoices', color: 'violet' }].map((action) => <Link key={action.title} href={action.href} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.04]"><span className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg ${action.color === 'green' ? 'bg-emerald-400/10 text-emerald-300' : action.color === 'blue' ? 'bg-blue-400/10 text-blue-300' : action.color === 'violet' ? 'bg-violet-400/10 text-violet-300' : 'bg-cyan-400/10 text-cyan-300'}`}>{action.icon}</span><span className="mt-3 block text-[10px] font-semibold text-slate-300 group-hover:text-white">{action.title}</span></Link>)}</div>
              <Link href="/dashboard/staff" className="mt-4 flex items-center justify-between rounded-xl border border-cyan-400/15 bg-gradient-to-r from-cyan-500/[0.08] to-blue-500/[0.05] p-3.5 transition hover:border-cyan-300/30"><span><span className="block text-xs font-semibold text-slate-100">Manage your team</span><span className="mt-1 block text-[10px] text-slate-500">Invite staff and manage access</span></span><Arrow className="h-4 w-4 text-cyan-300" /></Link>
            </article>
          </section>
          <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between"><span>BrightLoop Admin · Secure billing operations</span><span>Last data refresh: just now <span className="px-1.5 text-slate-700">·</span> Metrics update every 60 seconds</span></footer>
        </div>
      </main>
    </div>
  )
}
