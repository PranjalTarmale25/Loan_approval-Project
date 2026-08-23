import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAdmin } from '@/context/AdminAuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');

    if (!email.trim() || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      setAuthError(error);
      return;
    }

    navigate('/admin/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
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
          <span className="ml-3 rounded-md bg-sky-500/20 px-2.5 py-1 text-xs font-semibold text-sky-300 ring-1 ring-sky-400/30">
            Admin
          </span>
        </div>
        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight text-white">
            Admin Portal <br />
            for LoanEase.
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            Secure access to manage loan applications, review customer submissions, and monitor
            approval statistics.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm text-slate-300">
            <ShieldCheck className="h-5 w-5 text-sky-400" />
            Authorized personnel only.
          </div>
        </div>
        <p className="relative text-xs text-slate-500">
          &copy; {new Date().getFullYear()} LoanEase. All rights reserved.
        </p>
      </div>

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
            <span className="ml-2 rounded-md bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-600 ring-1 ring-sky-600/20">
              Admin
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access the admin dashboard.
          </p>

          {authError && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
              <p className="text-sm text-rose-700">{authError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
            <div>
              <label htmlFor="admin-email" className="label-field">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-email"
                  type="email"
                  className="input-field pl-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@loanease.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="label-field">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pl-11 pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? 'Signing in...' : 'Login'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Not an admin?{' '}
            <Link to="/login" className="font-semibold text-sky-600 hover:text-sky-700">
              Customer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
