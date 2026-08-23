import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, CheckCircle2, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof Errors]) setErrors((p) => ({ ...p, [field]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!form.name.trim()) next.name = 'Please enter your full name.';
    if (!form.email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email address.';
    }
    if (!form.password) {
      next.password = 'Please enter a password.';
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters.';
    }
    if (!form.confirm) {
      next.confirm = 'Please confirm your password.';
    } else if (form.confirm !== form.password) {
      next.confirm = 'Passwords do not match.';
    }
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: { data: { full_name: form.name.trim() } },
    });
    setLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('customers').insert({
        user_id: data.user.id,
        full_name: form.name.trim(),
        email: form.email.trim(),
      });

      if (profileError) {
        console.error('Profile creation error:', profileError.message);
      }
    }

    navigate('/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-slate-900 p-12 lg:flex">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative">
          <Link to="/" className="font-display text-xl font-bold text-white">
            Loan<span className="text-sky-400">Ease</span>
          </Link>
        </div>
        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight text-white">
            Start your loan <br />
            application today.
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            Create an account to submit loan applications, track their status, and manage your
            application history from one convenient dashboard.
          </p>
          <ul className="mt-8 space-y-3">
            {['Simple online application', 'Track your application status', 'Secure and convenient'].map(
              (item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-sky-400" />
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
        <p className="relative text-xs text-slate-500">
          &copy; {new Date().getFullYear()} LoanEase. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="mb-8 lg:hidden">
            <Link to="/" className="font-display text-xl font-bold text-slate-900">
              Loan<span className="text-sky-600">Ease</span>
            </Link>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Get started with your online loan application.
          </p>

          {authError && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <p className="text-sm text-rose-700">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label htmlFor="reg-name" className="label-field">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-name"
                  type="text"
                  className={`input-field pl-11 ${errors.name ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-rose-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="reg-email" className="label-field">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  id="reg-email"
                  type="email"
                  className={`input-field pl-11 ${errors.email ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="reg-password" className="label-field">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`input-field pl-11 pr-11 ${errors.password ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-rose-600">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="reg-confirm" className="label-field">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className={`input-field pl-11 pr-11 ${errors.confirm ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''}`}
                    value={form.confirm}
                    onChange={(e) => handleChange('confirm', e.target.value)}
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {errors.confirm && <p className="mt-1.5 text-xs text-rose-600">{errors.confirm}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
