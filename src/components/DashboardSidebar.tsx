import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  ListChecks,
  UserCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/dashboard/apply', label: 'Apply for a Loan', icon: FileText },
  { to: '/dashboard/applications', label: 'My Applications', icon: ListChecks },
  { to: '/dashboard/profile', label: 'My Profile', icon: UserCircle },
];

export default function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-sky-50 text-sky-700'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={linkClass}
            end={item.end}
            onClick={() => setMobileOpen(false)}
          >
            <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-3">
        <Link
          to="/login"
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-600"
          onClick={() => setMobileOpen(false)}
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
          Logout
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Link to="/" className="flex items-center">
          <Logo />
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

      {/* Mobile drawer */}
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

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-0 h-screen">{sidebarContent}</div>
      </aside>
    </>
  );
}
