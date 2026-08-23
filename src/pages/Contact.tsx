import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  query: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = { firstName: '', lastName: '', email: '', query: '' };

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.firstName.trim()) next.firstName = 'Please enter your first name.';
    if (!form.lastName.trim()) next.lastName = 'Please enter your last name.';
    if (!form.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email address.';
    }
    if (!form.query.trim()) {
      next.query = 'Please enter your query.';
    } else if (form.query.trim().length < 10) {
      next.query = 'Query should be at least 10 characters.';
    }
    return next;
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
      setForm(initialForm);
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white py-16">
        <div className="section-container">
          <div className="mx-auto max-w-3xl">
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              How Can We Help?
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Our support team is here to help with your loan application and account.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="section-container">
          <div className="mx-auto max-w-2xl">
            <div className="card p-6 sm:p-8">
              {submitted && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">Message sent successfully.</p>
                    <p className="text-sm text-emerald-700">
                      Thank you for reaching out. Our support team will get back to you shortly.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="label-field">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className={`input-field ${errors.firstName ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                      value={form.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      placeholder="Your first name"
                    />
                    {errors.firstName && <p className="mt-1.5 text-xs text-rose-600">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="label-field">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className={`input-field ${errors.lastName ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                      value={form.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      placeholder="Your last name"
                    />
                    {errors.lastName && <p className="mt-1.5 text-xs text-rose-600">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="label-field">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`input-field ${errors.email ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-rose-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="query" className="label-field">
                    Query
                  </label>
                  <textarea
                    id="query"
                    rows={5}
                    className={`input-field resize-none ${errors.query ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                    value={form.query}
                    onChange={(e) => handleChange('query', e.target.value)}
                    placeholder="Write your query here..."
                  />
                  {errors.query && <p className="mt-1.5 text-xs text-rose-600">{errors.query}</p>}
                </div>

                <button type="submit" className="btn-primary w-full sm:w-auto">
                  <Send className="h-4 w-4" />
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
