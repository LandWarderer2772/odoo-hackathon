"use client";

import { useEffect, useState } from "react";
import LiquidBackdrop from "./LiquidBackdrop";
import styles from "./aetheria.module.css";

const features = [
  {
    icon: "person_search",
    title: "Autonomous license harvesting",
    body: "Find unassigned, orphaned, and dormant seats across Google Workspace, GitHub, Slack, and Zoom. Reassign or deprovision before the next invoice.",
    proof: "Zero-touch employee offboarding",
  },
  {
    icon: "radar",
    title: "Predictive renewal intelligence",
    body: "A 60-day renewal radar brings auto-renewals forward, compares vendor pricing, and prepares evidence-backed counter-offers.",
    proof: "Benchmarks across 2,400+ vendors",
  },
  {
    icon: "credit_card",
    title: "Shadow IT & virtual cards",
    body: "Set a dedicated spend limit for every tool. If a subscription changes its price or tries to renew without approval, your team is in control.",
    proof: "Dynamic CVV and spend controls",
  },
  {
    icon: "account_tree",
    title: "ERP & accounting sync",
    body: "Connect NetSuite, QuickBooks Online, and Workday. Map recurring invoices to the right general ledger code automatically.",
    proof: "Automated accruals and prepaids",
  },
];

const quotes = [
  {
    quote:
      "Aetheria trimmed $118k off our annual SaaS overhead in our first 45 days. We found 34 forgotten seats across Zoom and GitHub.",
    name: "Elena Rostova",
    role: "VP of Finance · NovaTech",
    initials: "ER",
  },
  {
    quote:
      "The renewal intelligence alone paid for Aetheria for the next 10 years. We went into our Salesforce renewal with exact market rates and saved 22%.",
    name: "Marcus Vance",
    role: "Head of Operations · HyperScale",
    initials: "MV",
  },
  {
    quote:
      "Virtual cards with hard renewal stops permanently killed our shadow IT headache. Rogue subscriptions no longer slip past reconciliation.",
    name: "Sophia Chen",
    role: "Corporate Controller · Prism Labs",
    initials: "SC",
  },
];

const tiers = [
  {
    name: "Growth",
    seats: "Up to 75 seats",
    description: "Core telemetry and license reclamation for scaling teams.",
    monthly: 299,
    annual: 239,
    features: [
      "Google & Slack license harvesting",
      "30-day renewal warnings",
      "Up to 15 virtual spend cards",
      "QuickBooks & Xero sync",
    ],
  },
  {
    name: "Scale",
    seats: "Up to 350 seats",
    description: "Autonomous optimization with vendor pricing leverage.",
    monthly: 699,
    annual: 559,
    popular: true,
    features: [
      "Full suite license deprovisioning",
      "60-day renewal intelligence",
      "Unlimited virtual spend cards",
      "NetSuite & Workday GL mapping",
      "Market contract benchmarks",
    ],
  },
  {
    name: "Enterprise",
    seats: "350+ seats",
    description: "A dedicated procurement partner and custom integrations.",
    custom: true,
    features: [
      "Dedicated SaaS procurement negotiator",
      "Custom ERP and on-prem connectors",
      "SOC 2 & ISO 27001 data isolation",
      "Contractual 5× ROI guarantee",
    ],
  },
];

function Icon({ children, className = "" }) {
  return <span aria-hidden="true" className={`material-symbols ${className}`}>{children}</span>;
}

function Wordmark() {
  return (
    <a className="wordmark" href="#top" aria-label="Aetheria home">
      <span className="brand-mark"><Icon>cloud_sync</Icon></span>
      <span>Aetheria</span>
    </a>
  );
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <button
      className="theme-toggle"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={onToggle}
    >
      <Icon>{isDark ? "dark_mode" : "light_mode"}</Icon>
      <span>{isDark ? "Dark" : "Light"}</span>
      <span className="toggle-track">
        <span
          className="toggle-thumb"
          style={{ transform: isDark ? "translateX(0)" : "translateX(12px)" }}
        />
      </span>
    </button>
  );
}

function Telemetry() {
  return (
    <section className="telemetry glass-panel" id="platform" aria-labelledby="telemetry-title">
      <div className="telemetry-heading">
        <div>
          <div className="eyebrow"><span className="live-dot" /> LIVE AUDIT SNAPSHOT</div>
          <h2 id="telemetry-title">Global SaaS telemetry <span className="amp">&</span> seat harvest</h2>
          <p>Continuous visibility across 114 connected services</p>
        </div>
        <div className="sync-status"><Icon>sync</Icon> Synced 4m ago</div>
      </div>
      <div className="metric-grid">
        <article className="metric-card"><div className="metric-label"><span>Total active SaaS spend</span><Icon>payments</Icon></div><strong>$84,290<span className="metric-unit">/mo</span></strong><small>Across 114 verified contracts</small></article>
        <article className="metric-card"><div className="metric-label"><span>Detected waste & idle seats</span><Icon className="rose">warning</Icon></div><strong className="negative">−$16,420<span className="metric-unit">/mo</span></strong><small><span className="rose-text">19.4%</span> · 42 dormant enterprise licenses</small></article>
        <article className="metric-card"><div className="metric-label"><span>Autonomous savings YTD</span><Icon className="green">verified</Icon></div><strong className="positive">$148,900</strong><small><span className="green-text">↗ 28.4%</span> · KPMG benchmarked</small></article>
      </div>
      <div className="spend-chart-card">
        <div className="chart-copy"><div className="metric-label">36-MONTH SPEND & REALLOCATION</div><div className="chart-target">−$41,200 <span>optimized target</span></div><div className="chart-legend"><i /> Current trajectory <i className="legend-blue" /> With Aetheria</div></div>
        <div className="chart-wrap" role="img" aria-label="Chart showing SaaS spend decreasing over 36 months with Aetheria compared with the current trajectory">
          <div className="chart-y-labels"><span>$100k</span><span>$75k</span><span>$50k</span><span>$25k</span></div>
          <svg viewBox="0 0 620 150" preserveAspectRatio="none" aria-hidden="true">
            <defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--blue)" stopOpacity=".24"/><stop offset="100%" stopColor="var(--blue)" stopOpacity="0"/></linearGradient></defs>
            <path className="gridline" d="M0 20H620M0 58H620M0 96H620M0 134H620" />
            <path className="chart-area" d="M0 25 C80 32 100 42 155 48 S260 57 310 74 S410 87 466 104 S555 115 620 128 L620 150 L0 150Z" />
            <path className="chart-line muted-line" d="M0 25 C90 22 120 29 180 26 S270 27 330 21 S430 28 490 23 S565 25 620 19" />
            <path className="chart-line main-line" d="M0 25 C80 32 100 42 155 48 S260 57 310 74 S410 87 466 104 S555 115 620 128" />
            <circle cx="620" cy="128" r="5" className="chart-point" />
          </svg>
          <div className="chart-x-labels"><span>Today</span><span>6 mo</span><span>12 mo</span><span>24 mo</span><span>36 mo</span></div>
        </div>
      </div>
      <div className="vendor-list" aria-label="Connected software services">
        <Vendor icon="design_services" name="Figma Enterprise" meta="142 seats · Renews Nov 2025" amount="$10,650" note="94% active" status="Optimized" />
        <Vendor icon="group_remove" name="Salesforce CRM" meta="80 licenses · 61% active" amount="$24,000" note="31 idle seats · $9,300/mo" status="Review seats" warning />
        <Vendor icon="forum" name="Slack Enterprise Grid" meta="320 seats · Renews in 18 days" amount="$4,800" note="Contract renegotiation active" status="Negotiating" />
        <Vendor icon="cloud_circle" name="AWS Cloud Infrastructure" meta="Usage-based · 14% surge" amount="$38,120" note="Unallocated EC2 reservations" status="Inspect" warning />
      </div>
    </section>
  );
}

function Vendor({ icon, name, meta, amount, note, status, warning }) {
  return <div className="vendor-row"><div className="vendor-icon"><Icon>{icon}</Icon></div><div className="vendor-name"><strong>{name}</strong><span>{meta}</span></div><div className="vendor-amount"><strong>{amount}</strong><span>/mo</span></div><div className="vendor-note">{note}</div><span className={`status-pill${warning ? " status-warning" : ""}`}><span />{status}</span></div>;
}

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [employees, setEmployees] = useState(250);
  const [billing, setBilling] = useState("annual");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("aetheria-theme");
    const initial = saved === "light" || saved === "dark" ? saved : "light";
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
    document.documentElement.classList.toggle("dark", initial === "dark");
    document.body.dataset.theme = initial;

    return () => {
      document.documentElement.classList.add("dark");
      delete document.documentElement.dataset.theme;
      delete document.body.dataset.theme;
    };
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle("dark", next === "dark");
    document.body.dataset.theme = next;
    window.localStorage.setItem("aetheria-theme", next);
  }

  const savings = Math.round(employees * 250).toLocaleString("en-US");
  const hours = Math.round(employees * 1.36).toLocaleString("en-US");

  return (
    <main id="top" className={styles.aetheria} data-theme={theme}>
      <LiquidBackdrop enabled={theme === "light"} />
      <header className="site-header">
        <div className="nav-shell">
          <Wordmark />
          <button className="mobile-menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon>{menuOpen ? "close" : "menu"}</Icon></button>
          <nav className={`nav-links${menuOpen ? " nav-open" : ""}`} aria-label="Main navigation">
            <a href="#platform" onClick={() => setMenuOpen(false)}>Platform</a><a href="#features" onClick={() => setMenuOpen(false)}>Solutions</a><a href="#impact" onClick={() => setMenuOpen(false)}>Impact</a><a href="#pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
          </nav>
          <div className="nav-actions"><ThemeToggle theme={theme} onToggle={toggleTheme} /><a className="button button-small button-primary" href="#pricing">Get started <Icon>arrow_outward</Icon></a></div>
        </div>
      </header>

      <section className="hero section-shell">
        <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
        <div className="hero-copy"><div className="announcement"><span className="live-dot" /> AUTONOMOUS SAAS LICENSE REALLOCATION <span className="announcement-version">3.0 <Icon>arrow_forward</Icon></span></div>
          <h1>Master corporate subscriptions with <span>pure clarity.</span></h1>
          <p className="hero-lede">Aetheria finds ghost licenses, gets ahead of renewals, and brings company-wide software spend into one calm command center.</p>
          <div className="hero-actions"><a className="button button-primary" href="#impact">Launch your 14-day audit <Icon>arrow_forward</Icon></a><a className="button button-glass" href="#platform"><Icon>play_circle</Icon> Explore the platform</a></div>
          <div className="trust-row"><span>Trusted by finance teams at</span><div className="customer-logos"><b><Icon>polyline</Icon> LINEAR</b><b><Icon>interests</Icon> FIGMA</b><b><Icon>account_balance_wallet</Icon> RAMP</b><b><Icon>change_history</Icon> VERCEL</b><b><Icon>bolt</Icon> SUPABASE</b></div></div>
        </div>
        <div className="hero-stamp"><span className="stamp-icon"><Icon>verified_user</Icon></span><span><b>Spend, under control.</b><small>Signals you can act on.</small></span><span className="stamp-arrow"><Icon>north_east</Icon></span></div>
      </section>

      <div className="section-shell telemetry-shell"><Telemetry /></div>

      <section className="section-shell content-section" id="features">
        <div className="section-heading"><div><div className="eyebrow">ONE CONNECTED INTELLIGENCE LAYER</div><h2>Engineered for total<br /><span className="text-gradient">financial tranquility.</span></h2></div><p>Four connected capabilities replace procurement spreadsheets with clear signals and practical automation.</p></div>
        <div className="feature-grid">{features.map((feature, index) => <article className="feature-card glass-panel" key={feature.title}><div className="feature-top"><div className="feature-icon"><Icon>{feature.icon}</Icon></div><span className="feature-index">0{index + 1}</span></div><h3>{feature.title}</h3><p>{feature.body}</p><div className="feature-proof"><Icon>check_circle</Icon>{feature.proof}<Icon className="proof-arrow">arrow_outward</Icon></div></article>)}</div>
      </section>

      <section className="impact-section" id="impact"><div className="section-shell impact-layout"><div className="impact-copy"><div className="eyebrow"><span className="live-dot" /> A CLEARER RETURN ON SPEND</div><h2>How much could<br />you <span className="text-gradient">get back?</span></h2><p>Estimate annual SaaS savings based on your team size, using customer telemetry as a guide.</p><a className="text-link" href="#pricing">See plans and pricing <Icon>arrow_forward</Icon></a></div><div className="calculator glass-panel"><div className="calc-top"><div><span className="metric-label">YOUR COMPANY</span><h3>Company headcount</h3></div><span className="employee-count">{employees.toLocaleString()} <small>employees</small></span></div><input aria-label="Company headcount" type="range" min="25" max="1500" step="25" value={employees} onChange={(event) => setEmployees(Number(event.target.value))} style={{ "--range-progress": `${((employees - 25) / 1475) * 100}%` }} /><div className="range-labels"><span>25 · Early stage</span><span>500 · Scale-up</span><span>1,500+ · Enterprise</span></div><div className="calc-results"><div><span className="metric-label">EST. ANNUAL SaaS SAVINGS</span><strong>${savings}</strong><small>From idle seats and renewal savings</small></div><div><span className="metric-label">FINANCE HOURS SAVED</span><strong>{hours}<i> hrs</i></strong><small>Less reconciliation and expense policing</small></div></div><a className="button button-primary calc-button" href="#pricing">Claim your audit report <Icon>arrow_forward</Icon></a></div></div></section>

      <section className="section-shell content-section testimonials-section"><div className="section-heading"><div><div className="eyebrow">VALIDATED BY OPERATORS</div><h2>Clear numbers.<br /><span className="text-gradient">Confident decisions.</span></h2></div><p>Finance leaders use Aetheria to find savings hiding in plain sight and negotiate from a position of knowledge.</p></div><div className="quote-grid">{quotes.map((item) => <figure className="quote-card glass-panel" key={item.name}><div className="stars" aria-label="5 out of 5 stars">★★★★★</div><blockquote>“{item.quote}”</blockquote><figcaption><span className="avatar">{item.initials}</span><span><b>{item.name}</b><small>{item.role}</small></span><Icon>format_quote</Icon></figcaption></figure>)}</div></section>

      <section className="section-shell content-section pricing-section" id="pricing"><div className="section-heading pricing-heading"><div><div className="eyebrow">TRANSPARENT, SELF-FUNDING INVESTMENT</div><h2>Spend less. Get <span className="text-gradient">more clarity.</span></h2><p>Every tier targets at least 4× ROI within 90 days, or your subscription is reimbursed.</p></div><div className="billing-toggle" role="group" aria-label="Billing frequency"><button className={billing === "monthly" ? "selected" : ""} onClick={() => setBilling("monthly")}>Monthly</button><button className={billing === "annual" ? "selected" : ""} onClick={() => setBilling("annual")}>Annually <span>Save 20%</span></button></div></div><div className="pricing-grid">{tiers.map((tier) => <article className={`price-card glass-panel${tier.popular ? " popular" : ""}`} key={tier.name}>{tier.popular && <div className="popular-tag"><Icon>auto_awesome</Icon> MOST POPULAR</div>}<div className="plan-eyebrow">{tier.seats}</div><h3>{tier.name}</h3><p className="plan-description">{tier.description}</p><div className="price">{tier.custom ? <strong>Custom</strong> : <><strong>${billing === "annual" ? tier.annual : tier.monthly}</strong><span>/ user / month</span></>}</div>{!tier.custom && billing === "annual" && <div className="billed-note">Billed annually</div>}<a className={`button ${tier.popular ? "button-primary" : "button-glass"} plan-button`} href="#impact">{tier.custom ? "Talk to a strategist" : tier.popular ? "Start 14-day full access" : "Start free trial"}<Icon>arrow_forward</Icon></a><div className="plan-divider"/><ul>{tier.features.map((item) => <li key={item}><Icon>check_circle</Icon>{item}</li>)}</ul></article>)}</div><p className="pricing-footnote"><Icon>verified_user</Icon> No commitment · Connect in 5 minutes · Cancel anytime</p></section>

      <section className="section-shell"><div className="closing-cta"><div className="cta-glow"/><div className="eyebrow"><span className="live-dot" /> READY WHEN YOU ARE</div><h2>Reclaim thousands in<br /><span>unseen software spend.</span></h2><p>Connect your identity provider and ERP in read-only mode. Aetheria will surface unused seats and upcoming renewals for your team to review.</p><div className="hero-actions"><a className="button button-primary" href="#pricing">Start your free 14-day audit <Icon>arrow_forward</Icon></a><a className="button button-glass" href="#platform"><Icon>calendar_today</Icon> Book a walkthrough</a></div><div className="compliance-row"><span><Icon>verified_user</Icon> SOC 2 Type II</span><span><Icon>shield</Icon> ISO 27001</span><span><Icon>lock</Icon> GDPR & CCPA</span><span><Icon>key</Icon> 256-bit encryption</span></div></div></section>

      <footer className="site-footer"><div className="footer-shell"><div><Wordmark /><p>© 2025 Aetheria Inc. Subscription intelligence, made clear.</p></div><nav aria-label="Footer navigation"><a href="#features">Security</a><a href="#features">Privacy</a><a href="#pricing">Terms</a><a href="#platform">API status</a><a href="#features">Compliance</a></nav><ThemeToggle theme={theme} onToggle={toggleTheme} /></div></footer>
    </main>
  );
}
