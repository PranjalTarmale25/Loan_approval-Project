import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setAuthError('');

    const next: typeof errors = {};

    if (!email.trim()) {
      next.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Please enter a valid email.';
    }

    if (!password) {
      next.password = 'Please enter your password.';
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    setLoading(true);

    // 1. Login through Supabase Authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);

      setAuthError(
        error.message === 'Invalid login credentials'
          ? 'Invalid email or password. Please try again.'
          : error.message
      );

      return;
    }

    // 2. Check whether the logged-in user is an admin
    const { data: admin, error: adminError } = await supabase
      .from('admins')
      .select('admin_id')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (adminError) {
      console.error('Admin check error:', adminError.message);
    }

    setLoading(false);

    // 3. Admin → Admin Dashboard
    if (admin) {
      navigate('/admin');
      return;
    }

    // 4. Normal customer → Customer Dashboard
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
          <Link
            to="/"
            className="font-display text-xl font-bold text-white"
          >
            Loan<span className="text-sky-400">Ease</span>
          </Link>
        </div>

        <div className="relative">
          <h2 className="font-display text-3xl font-bold leading-tight text-white">
            Manage your loan <br />
            applications with ease.
          </h2>

          <p className="mt-4 max-w-md text-slate-400">
            Sign in to track your applications, view your application
            history, and manage your account from one place.
          </p>

          <div className="mt-8 flex items-center gap-3 text-sm text-slate-300">
            <ShieldCheck className="h-5 w-5 text-sky-400" />
            Your information is handled securely.
          </div>
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
            <Link
              to="/"
              className="font-display text-xl font-bold text-slate-900"
            >
              Loan<span className="text-sky-600">Ease</span>
            </Link>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your loan applications.
          </p>

          {/* Authentication error */}
          {authError && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />

              <p className="text-sm text-rose-700">
                {authError}
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="label-field"
              >
                Email
              </label>

              <div className="relative">

                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                <input
                  id="login-email"
                  type="email"
                  className={`input-field pl-11 ${
                    errors.email
                      ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20'
                      : ''
                  }`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);

                    if (errors.email) {
                      setErrors((p) => ({
                        ...p,
                        email: undefined,
                      }));
                    }
                  }}
                  placeholder="you@example.com"
                />

              </div>

              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>

              <label
                htmlFor="login-password"
                className="label-field"
              >
                Password
              </label>

              <div className="relative">

                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />

                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pl-11 pr-11 ${
                    errors.password
                      ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20'
                      : ''
                  }`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);

                    if (errors.password) {
                      setErrors((p) => ({
                        ...p,
                        password: undefined,
                      }));
                    }
                  }}
                  placeholder="Enter your password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((v) => !v)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-[18px] w-[18px]" />
                  ) : (
                    <Eye className="h-[18px] w-[18px]" />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 text-sm text-slate-600">

                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />

                Remember me
              </label>

              <button
                type="button"
                className="text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                Forgot Password?
              </button>

            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Login'}

              {!loading && (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>

          </form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}

            <Link
              to="/register"
              className="font-semibold text-sky-600 hover:text-sky-700"
            >
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}