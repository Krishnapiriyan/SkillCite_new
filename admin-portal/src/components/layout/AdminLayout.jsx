import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout({ children, title }) {
  return (
    <div className="w-full h-screen bg-bg-page flex overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Topbar title={title} />
        
        {/* Dynamic Inner Scroll Page */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
