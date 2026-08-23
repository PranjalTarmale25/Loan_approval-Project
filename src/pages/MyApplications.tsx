import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, FileText, Eye, AlertCircle } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/lib/supabaseClient';

type Application = {
  application_id: string;
  application_date: string;
  loan_purpose: string;
  loan_amount: number;
  loan_term: number;
  approval_status: 'approved' | 'rejected' | 'pending' | 'review';
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function loanPurposeToType(purpose: string) {
  const map: Record<string, string> = {
    'Personal': 'Personal Loan',
    'Home Purchase': 'Home Loan',
    'Home Construction': 'Home Loan',
    'Vehicle Loan': 'Car Loan',
    'Education': 'Education Loan',
    'Business Expansion': 'Business Loan',
    'Debt Consolidation': 'Personal Loan',
    'Medical': 'Personal Loan',
  };
  return map[purpose] || purpose;
}

const statusFilters = ['all', 'approved', 'pending', 'review', 'rejected'] as const;
const loanTypeFilters = ['all', 'Personal Loan', 'Home Loan', 'Car Loan', 'Education Loan', 'Business Loan'] as const;
const dateFilters = ['all', 'newest', 'oldest'] as const;

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('all');
  const [loanTypeFilter, setLoanTypeFilter] = useState<(typeof loanTypeFilters)[number]>('all');
  const [dateFilter, setDateFilter] = useState<(typeof dateFilters)[number]>('all');

  useEffect(() => {
    async function fetchApplications() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setLoading(false);
        return;
      }

      const { data: customer } = await supabase
        .from('customers')
        .select('customer_id')
        .eq('user_id', userData.user.id)
        .maybeSingle();

      if (!customer) {
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('loan_applications')
        .select('application_id, application_date, loan_purpose, loan_amount, loan_term, approval_status')
        .eq('customer_id', customer.customer_id)
        .order('application_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setApplications((data || []) as Application[]);
      setLoading(false);
    }

    fetchApplications();
  }, []);

  let filtered = applications.filter((app) => {
    const loanType = loanPurposeToType(app.loan_purpose);
    const idShort = app.application_id.slice(0, 8).toUpperCase();
    const matchesSearch =
      idShort.toLowerCase().includes(search.toLowerCase()) ||
      loanType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.approval_status === statusFilter;
    const matchesLoanType = loanTypeFilter === 'all' || loanType === loanTypeFilter;
    return matchesSearch && matchesStatus && matchesLoanType;
  });

  if (dateFilter === 'newest') {
    filtered = [...filtered].sort((a, b) => b.application_date.localeCompare(a.application_date));
  } else if (dateFilter === 'oldest') {
    filtered = [...filtered].sort((a, b) => a.application_date.localeCompare(b.application_date));
  }

  return (
    <div className="animate-fade-in">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              My Applications
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View and track your loan applications.
            </p>
          </div>
          <Link to="/dashboard/apply" className="btn-primary">
            <Plus className="h-4 w-4" />
            Apply for a New Loan
          </Link>
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
          </div>
        ) : error ? (
          <div className="card flex items-center gap-3 p-6">
            <AlertCircle className="h-5 w-5 text-rose-500" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="card flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-slate-900">
              No applications found.
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Your submitted loan applications will appear here.
            </p>
            <Link to="/dashboard/apply" className="btn-primary mt-5">
              <Plus className="h-4 w-4" />
              Apply for a Loan
            </Link>
          </div>
        ) : (
          <>
            {/* Search & filters */}
            <div className="mb-5 space-y-4">
              <div className="relative max-w-xs">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="input-field pl-11"
                  placeholder="Search by ID or loan type..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label-field">Status</label>
                  <select
                    className="input-field"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                  >
                    {statusFilters.map((f) => (
                      <option key={f} value={f}>
                        {f === 'all' ? 'All Statuses' : f.charAt(0).toUpperCase() + f.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-field">Loan Type</label>
                  <select
                    className="input-field"
                    value={loanTypeFilter}
                    onChange={(e) => setLoanTypeFilter(e.target.value as typeof loanTypeFilter)}
                  >
                    {loanTypeFilters.map((f) => (
                      <option key={f} value={f}>
                        {f === 'all' ? 'All Loan Types' : f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-field">Date</label>
                  <select
                    className="input-field"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
                  >
                    <option value="all">All Dates</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table or no results */}
            {filtered.length === 0 ? (
              <div className="card flex flex-col items-center justify-center p-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-slate-900">
                  No applications found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try adjusting your search or filters, or submit a new application.
                </p>
              </div>
            ) : (
              <div className="card overflow-hidden">
                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Application ID</th>
                        <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Loan Type</th>
                        <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Amount</th>
                        <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Term</th>
                        <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                        <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                        <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((app) => (
                        <tr key={app.application_id} className="transition-colors hover:bg-slate-50">
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{app.application_id.slice(0, 8).toUpperCase()}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{loanPurposeToType(app.loan_purpose)}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{formatCurrency(app.loan_amount)}</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{app.loan_term} months</td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{app.application_date}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={app.approval_status} />
                          </td>
                          <td className="px-6 py-4">
                            <button className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700">
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {filtered.map((app) => (
                    <div key={app.application_id} className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">{app.application_id.slice(0, 8).toUpperCase()}</span>
                        <StatusBadge status={app.approval_status} />
                      </div>
                      <div className="mt-2 space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Loan Type</span>
                          <span className="text-slate-700">{loanPurposeToType(app.loan_purpose)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Date</span>
                          <span className="text-slate-700">{app.application_date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Amount</span>
                          <span className="font-medium text-slate-900">{formatCurrency(app.loan_amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Term</span>
                          <span className="text-slate-700">{app.loan_term} months</span>
                        </div>
                      </div>
                      <button className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700">
                        <Eye className="h-4 w-4" />
                        View Application
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
