import { useEffect, useState, useCallback } from 'react';
import {
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import KpiCard from '@/components/KpiCard';
import StatusBadge from '@/components/StatusBadge';
import { supabase } from '@/lib/supabaseClient';

type AdminApp = {
  customer_id: string;
  full_name: string;
  loan_type: string;
  loan_amount: number;
  approval_status: 'approved' | 'rejected' | 'pending' | 'review';
  application_date: string;
};

type Stats = {
  totalCustomers: number;
  totalApplications: number;
  approved: number;
  rejected: number;
  pending: number;
  approvalRate: string;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<AdminApp[]>([]);

  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalApplications: 0,
    approved: 0,
    rejected: 0,
    pending: 0,
    approvalRate: '0%',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');

    const [
  { data: apps, error: appError },
  { count: customerCount, error: custError },
] = await Promise.all([
      supabase
        .from('loan_applications')
        .select(
          'customer_id, full_name, loan_type, loan_amount, approval_status, application_date'
        )
        .order('application_date', { ascending: false }),

      supabase
        .from('customers')
        .select('customer_id', { count: 'exact', head: true }),
    ]);

    if (appError || custError) {
      setError(
        appError?.message ||
          custError?.message ||
          'Failed to load data.'
      );

      setLoading(false);
      return;
    }

    const appList = (apps || []) as AdminApp[];

    setApplications(appList);

    const total = appList.length;

    const approved = appList.filter(
      (a) => a.approval_status === 'approved'
    ).length;

    const rejected = appList.filter(
      (a) => a.approval_status === 'rejected'
    ).length;

    const pending = appList.filter(
      (a) =>
        a.approval_status === 'pending' ||
        a.approval_status === 'review'
    ).length;

    const decided = approved + rejected;

    const approvalRate =
      total > 0 && decided > 0
        ? Math.round((approved / decided) * 100)
        : 0;

    setStats({
     totalCustomers: customerCount ?? 0,
      totalApplications: total,
      approved,
      rejected,
      pending,
      approvalRate: `${approvalRate}%`,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /*
    Real-time updates.

    Whenever a loan application is inserted,
    updated, or deleted in Supabase,
    the dashboard automatically refreshes.
  */
  useEffect(() => {
    const channel = supabase
      .channel('loan-applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loan_applications',
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-5 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Overview of all loan applications and customer statistics.
            </p>
          </div>

          <button
            onClick={fetchData}
            className="btn-secondary"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

        </div>
      </div>

      <div className="p-6 lg:p-8">

        {/* Error */}
        {error ? (
          <div className="card flex items-center gap-3 p-6">

            <AlertCircle className="h-5 w-5 text-rose-500" />

            <p className="text-sm text-rose-700">
              {error}
            </p>

          </div>
        ) : (
          <>

            {/* KPI Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

              <KpiCard
                label="Total Customers"
                value={stats.totalCustomers}
                icon={Users}
                accent="sky"
              />

              <KpiCard
                label="Total Applications"
                value={stats.totalApplications}
                icon={FileText}
                accent="sky"
              />

              <KpiCard
                label="Approved"
                value={stats.approved}
                icon={CheckCircle2}
                accent="emerald"
              />

              <KpiCard
                label="Rejected"
                value={stats.rejected}
                icon={XCircle}
                accent="rose"
              />

              <KpiCard
                label="Pending"
                value={stats.pending}
                icon={Clock}
                accent="amber"
              />

              <KpiCard
                label="Approval Rate"
                value={stats.approvalRate}
                icon={TrendingUp}
                accent="emerald"
              />

            </div>

            {/* Applications */}
            <div className="mt-8">

              <h2 className="mb-4 font-display text-lg font-semibold text-slate-900">
                All Applications
              </h2>

              {applications.length === 0 ? (

                /* No applications */
                <div className="card flex flex-col items-center justify-center p-12 text-center">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <FileText className="h-7 w-7" />
                  </div>

                  <h3 className="mt-4 font-display text-base font-semibold text-slate-900">
                    No applications found.
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Loan applications will appear here once customers submit them.
                  </p>

                </div>

              ) : (

                /* Applications table */
                <div className="card overflow-hidden">

                  {/* Desktop table */}
                  <div className="hidden overflow-x-auto md:block">

                    <table className="w-full text-left">

                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">

                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Customer ID
                          </th>

                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Customer Name
                          </th>

                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Loan Type
                          </th>

                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Loan Amount
                          </th>

                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Status
                          </th>

                          <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Application Date
                          </th>

                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">

                        {applications.map((app, i) => (

                          <tr
                            key={`${app.customer_id}-${app.application_date}-${i}`}
                            className="transition-colors hover:bg-slate-50"
                          >

                            {/* Customer ID */}
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                              {app.customer_id
                                ? app.customer_id
                                    .slice(0, 8)
                                    .toUpperCase()
                                : 'N/A'}
                            </td>

                            {/* Customer Name */}
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                              {app.full_name || 'N/A'}
                            </td>

                            {/* Loan Type */}
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                              {app.loan_type || 'N/A'}
                            </td>

                            {/* Loan Amount */}
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                              {formatCurrency(app.loan_amount)}
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4">
                              <StatusBadge
                                status={app.approval_status}
                              />
                            </td>

                            {/* Application Date */}
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                              {app.application_date}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                  {/* Mobile cards */}
                  <div className="divide-y divide-slate-100 md:hidden">

                    {applications.map((app, i) => (

                      <div
                        key={`${app.customer_id}-${app.application_date}-${i}`}
                        className="p-4"
                      >

                        <div className="flex items-center justify-between">

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {app.full_name || 'N/A'}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Customer ID:{' '}
                              {app.customer_id
                                ? app.customer_id
                                    .slice(0, 8)
                                    .toUpperCase()
                                : 'N/A'}
                            </p>
                          </div>

                          <StatusBadge
                            status={app.approval_status}
                          />

                        </div>

                        <div className="mt-3 space-y-2 text-sm">

                          <div className="flex justify-between">

                            <span className="text-slate-400">
                              Loan Type
                            </span>

                            <span className="text-slate-700">
                              {app.loan_type || 'N/A'}
                            </span>

                          </div>

                          <div className="flex justify-between">

                            <span className="text-slate-400">
                              Amount
                            </span>

                            <span className="font-medium text-slate-900">
                              {formatCurrency(app.loan_amount)}
                            </span>

                          </div>

                          <div className="flex justify-between">

                            <span className="text-slate-400">
                              Date
                            </span>

                            <span className="text-slate-700">
                              {app.application_date}
                            </span>

                          </div>

                        </div>

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