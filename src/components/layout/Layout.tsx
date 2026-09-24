import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-black text-neutral-300 font-sans flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto px-6 py-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}