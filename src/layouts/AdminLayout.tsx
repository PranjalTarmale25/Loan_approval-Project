import { Outlet, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from '@/components/Logo';
import { useAdmin } from '@/context/AdminAuthContext';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut, isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/admin/login', { replace: true });
    }
  }, [loading, isAdmin, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login', { replace: true });
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-600 ring-1 ring-sky-600/20">
            Admin
          </span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-6">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-3 rounded-xl bg-sky-50 px-3.5 py-2.5 text-sm font-medium text-sky-700"
        >
          <LayoutDashboard className="h-[18px] w-[18px]" strokeWidth={2} />
          Dashboard
        </Link>
      </nav>
      <div className="border-t border-slate-200 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
            <span className="rounded-md bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-600 ring-1 ring-sky-600/20">
              Admin
            </span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
              <button
                type="button"
                className="absolute right-3 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebarContent}
            </div>
          </div>
        )}

        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
          <div className="sticky top-0 h-screen">{sidebarContent}</div>
        </aside>

        <div className="flex min-h-screen w-full flex-1 flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
