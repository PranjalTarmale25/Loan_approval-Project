import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, XCircle, ArrowRight, Plus, Eye, AlertCircle } from 'lucide-react';
import KpiCard from '@/components/KpiCard';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

type Application = {
  application_id: string;
  loan_purpose: string;
  loan_amount: number;
  application_date: string;
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

export default function Dashboard() {
  const { profile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        .select('application_id, loan_purpose, loan_amount, application_date, approval_status')
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

  const stats = {
    total: applications.length,
    approved: applications.filter((a) => a.approval_status === 'approved').length,
    pending: applications.filter((a) => a.approval_status === 'pending' || a.approval_status === 'review').length,
    rejected: applications.filter((a) => a.approval_status === 'rejected').length,
  };

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Welcome Back{profile?.full_name ? `, ${profile.full_name}` : ''}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Here's an overview of your loan applications.
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
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <KpiCard label="Total Applications" value={stats.total} icon={FileText} accent="sky" />
              <KpiCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="emerald" />
              <KpiCard label="Pending" value={stats.pending} icon={Clock} accent="amber" />
              <KpiCard label="Rejected" value={stats.rejected} icon={XCircle} accent="rose" />
            </div>

            {/* Recent applications or empty state */}
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-slate-900">Recent Applications</h2>
                {applications.length > 0 && (
                  <Link
                    to="/dashboard/applications"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </div>

              {applications.length === 0 ? (
                <div className="card flex flex-col items-center justify-center p-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <FileText className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-slate-900">
                    No loan applications yet.
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Start your first application to track it here.
                  </p>
                  <Link to="/dashboard/apply" className="btn-primary mt-5">
                    <Plus className="h-4 w-4" />
                    Apply for a Loan
                  </Link>
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
                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Loan Amount</th>
                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Application Date</th>
                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentApplications.map((app) => (
                          <tr key={app.application_id} className="transition-colors hover:bg-slate-50">
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                              {app.application_id.slice(0, 8).toUpperCase()}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{loanPurposeToType(app.loan_purpose)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{formatCurrency(app.loan_amount)}</td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{app.application_date}</td>
                            <td className="px-6 py-4">
                              <StatusBadge status={app.approval_status} />
                            </td>
                            <td className="px-6 py-4">
                              <Link
                                to="/dashboard/applications"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="divide-y divide-slate-100 md:hidden">
                    {recentApplications.map((app) => (
                      <div key={app.application_id} className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900">{app.application_id.slice(0, 8).toUpperCase()}</span>
                          <StatusBadge status={app.approval_status} />
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-400">Loan Type: </span>
                            <span className="text-slate-700">{loanPurposeToType(app.loan_purpose)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Date: </span>
                            <span className="text-slate-700">{app.application_date}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Amount: </span>
                            <span className="font-medium text-slate-900">{formatCurrency(app.loan_amount)}</span>
                          </div>
                        </div>
                        <Link
                          to="/dashboard/applications"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:text-sky-700"
                        >
                          <Eye className="h-4 w-4" />
                          View Application
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
