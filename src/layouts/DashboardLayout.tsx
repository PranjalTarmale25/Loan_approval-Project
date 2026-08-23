import { Outlet } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex min-h-screen w-full flex-1 flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
