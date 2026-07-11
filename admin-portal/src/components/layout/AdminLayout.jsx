import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout({ children, title }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-full h-screen bg-bg-page flex overflow-hidden relative">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Dynamic Inner Scroll Page */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
