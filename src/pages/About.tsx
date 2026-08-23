import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, CheckCircle2 } from 'lucide-react';

const sections = [
  {
    icon: Users,
    title: 'Who We Are',
    desc: 'LoanEase is a digital loan application platform built to simplify the way people apply for loans. We provide an online experience that guides you through each step of the application process, from submitting your details to tracking your application status.',
  },
  {
    icon: Target,
    title: 'Our Approach',
    desc: 'We believe the loan application process should be clear and straightforward. Our platform is designed to help you complete your application with confidence, providing a structured form, clear steps, and a dashboard to keep you informed at every stage.',
  },
  {
    icon: CheckCircle2,
    title: 'Why Customers Choose Us',
    desc: 'Customers choose LoanEase for its simple online process, secure handling of personal information, and the ability to track applications from a single dashboard. We focus on making the experience convenient and transparent from start to finish.',
  },
];

export default function About() {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              About LoanEase
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              LoanEase is a digital loan application platform designed to make the loan application
              process simple, convenient, and transparent.
            </p>
          </div>
        </div>
      </section>

      {/* Sections */}
      <section className="bg-slate-50 py-20">
        <div className="section-container">
          <div className="mx-auto max-w-4xl space-y-6">
            {sections.map((section) => (
              <div key={section.title} className="card p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-600/10">
                    <section.icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-slate-900">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                      {section.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-16">
        <div className="section-container text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Ready to apply for a loan?
          </h2>
          <p className="mt-3 text-slate-600">
            Start your application today and track it from your dashboard.
          </p>
          <Link to="/dashboard/apply" className="btn-primary mt-6">
            Apply for a Loan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
