import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  UserPlus,
  FileText,
  ClipboardCheck,
  TrendingUp,
  ShieldCheck,
  Eye,
  Clock,
  ChevronDown,
  User,
  Home as HomeIcon,
  Car,
  GraduationCap,
  CheckCircle2,
  X,
  Check,
} from 'lucide-react';

const loanProducts = [
  {
    icon: User,
    name: 'Personal Loan',
    desc: 'Flexible financing for your personal needs.',
    longDesc: 'A personal loan is an unsecured loan that you can use for almost any purpose — medical expenses, travel, wedding, home renovation, or debt consolidation. Since it does not require collateral, the approval depends on your credit score, income, and repayment capacity.',
    features: ['No collateral required', 'Quick approval process', 'Flexible tenure options', 'Minimal documentation'],
    eligibility: ['Age: 21–60 years', 'Salaried or self-employed', 'Minimum annual income varies by lender', 'Good CIBIL score recommended'],
  },
  {
    icon: HomeIcon,
    name: 'Home Loan',
    desc: 'Financing options for your home purchase.',
    longDesc: 'A home loan helps you finance the purchase, construction, or renovation of a residential property. The property itself serves as collateral, which typically allows for lower interest rates and longer repayment tenures compared to unsecured loans.',
    features: ['Long repayment tenure up to 20 years', 'Competitive interest rates', 'Tax benefits on principal and interest', 'Funds for purchase, construction, or renovation'],
    eligibility: ['Age: 21–65 years', 'Salaried or self-employed with stable income', 'Property must be approved and legally clear', 'Good credit history required'],
  },
  {
    icon: Car,
    name: 'Car Loan',
    desc: 'Get closer to owning your next vehicle.',
    longDesc: 'A car loan helps you finance the purchase of a new or used vehicle. The vehicle itself serves as collateral for the loan, making it easier to qualify compared to an unsecured personal loan while offering competitive interest rates.',
    features: ['Finance up to 80–90% of vehicle cost', 'New or used vehicle financing', 'Flexible tenure from 1 to 7 years', 'Quick disbursal after approval'],
    eligibility: ['Age: 21–65 years', 'Salaried or self-employed', 'Stable income source required', 'Valid driving license for vehicle ownership'],
  },
  {
    icon: GraduationCap,
    name: 'Education Loan',
    desc: 'Financial support for your education.',
    longDesc: 'An education loan helps students finance their higher studies in India or abroad. It covers tuition fees, accommodation, books, and other education-related expenses. Repayment typically begins after a moratorium period following course completion.',
    features: ['Covers tuition, living, and study material costs', 'Moratorium period during study', 'Competitive rates for students', 'Available for India and abroad studies'],
    eligibility: ['Student must have confirmed admission', 'Co-applicant (parent/guardian) required', 'Age: typically 18–35 years', 'Recognized institution and course'],
  },
];

const steps = [
  { icon: UserPlus, title: 'Create Your Account', desc: 'Sign up and set up your profile to get started with your loan application.' },
  { icon: FileText, title: 'Complete Your Application', desc: 'Fill out the online application form with your personal, financial, and loan details.' },
  { icon: ClipboardCheck, title: 'Application Review', desc: 'Your application is reviewed by our team to assess your eligibility.' },
  { icon: TrendingUp, title: 'Track Your Application', desc: 'Monitor the status of your application from your dashboard at any time.' },
];

const benefits = [
  { icon: FileText, title: 'Simple Application', desc: 'Complete your loan application through a straightforward online process.' },
  { icon: ShieldCheck, title: 'Secure Information', desc: 'Your personal and application information is handled securely.' },
  { icon: Eye, title: 'Application Tracking', desc: 'Keep track of your loan application status from your dashboard.' },
  { icon: Clock, title: 'Convenient Access', desc: 'Manage your application anytime from one place.' },
];

const faqs = [
  {
    q: 'What information do I need to apply?',
    a: 'You will need your personal details, employment and income information, financial details, and information about the loan you are requesting. Having this information ready before you start will make the process faster.',
  },
  {
    q: 'How can I check my application status?',
    a: 'After signing in, go to your dashboard or the My Applications page. You will see the current status of each application you have submitted.',
  },
  {
    q: 'Can I view my previous applications?',
    a: 'Yes. All your past and current applications are listed on the My Applications page, where you can review their details and status at any time.',
  },
  {
    q: 'How long does the application process take?',
    a: 'The time it takes to review an application varies depending on the loan type and the information provided. You can track progress from your dashboard throughout the process.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-display text-base font-semibold text-slate-900">{q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm leading-relaxed text-slate-600">{a}</div>
      )}
    </div>
  );
}

function LoanModal({ product, onClose }: { product: typeof loanProducts[number]; onClose: () => void }) {
  const Icon = product.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg animate-fade-in overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-600/10">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-900">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
          <p className="text-sm leading-relaxed text-slate-600">{product.longDesc}</p>

          <h4 className="mt-5 font-display text-sm font-semibold text-slate-900">Key Features</h4>
          <ul className="mt-2 space-y-1.5">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                {f}
              </li>
            ))}
          </ul>

          <h4 className="mt-5 font-display text-sm font-semibold text-slate-900">Eligibility</h4>
          <ul className="mt-2 space-y-1.5">
            {product.eligibility.map((e) => (
              <li key={e} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                {e}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
          <Link to="/dashboard/apply" className="btn-primary flex-1 justify-center">
            Apply for a Loan
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedLoan, setSelectedLoan] = useState<typeof loanProducts[number] | null>(null);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-white to-white" />
        <div className="section-container relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your Loan, Made Simple.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Apply for a loan online, submit your details securely, and track your application
              from start to finish.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link to="/dashboard/apply" className="btn-primary">
                Apply for a Loan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Secure Application
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Track Anytime
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Simple Process
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Products */}
      <section id="loans" className="bg-slate-50 py-20">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Find the Right Loan for You
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Explore our loan options designed to meet your needs.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loanProducts.map((product) => (
              <div key={product.name} className="card flex flex-col p-6 transition-shadow hover:shadow-card-hover">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-600/10">
                  <product.icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-slate-900">
                  {product.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{product.desc}</p>
                <button
                  type="button"
                  onClick={() => setSelectedLoan(product)}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-700"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Applying for a loan with LoanEase takes just a few simple steps.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="card h-full p-6 transition-shadow hover:shadow-card-hover">
                <span className="font-display text-2xl font-bold text-sky-200">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="mt-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
                  <step.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-50 py-20">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Why Choose Us?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              We make the loan application process simple, secure, and convenient.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="card p-6 transition-shadow hover:shadow-card-hover">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-600/10">
                  <benefit.icon className="h-6 w-6" strokeWidth={2} />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-slate-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Have questions? Here are answers to some common ones.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16">
        <div className="section-container text-center">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Complete your loan application online in just a few simple steps.
          </p>
          <Link to="/dashboard/apply" className="btn-primary mt-8">
            Apply for a Loan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {selectedLoan && <LoanModal product={selectedLoan} onClose={() => setSelectedLoan(null)} />}
    </div>
  );
}
