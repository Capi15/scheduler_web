import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Outlet } from 'react-router-dom';
import { useTopBar } from '../services/context/TopBarContext';
import { useEffect, useState } from 'react';

function Layout() {
  const { topbar } = useTopBar();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1366);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1366);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1366;
      setIsDesktop(desktop);
      if (desktop) {
        setSidebarOpen(true); // em desktop, força visível
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container d-flex">
      {/* Sidebar visível apenas quando ativada */}
      {sidebarOpen && (
        <Sidebar onClose={() => setSidebarOpen(false)} isOpen={sidebarOpen} />
      )}

      {/* Área de conteúdo com margem dinâmica em desktop */}
      <div className="content-area">
        <TopBar
          title={topbar.title}
          searchPlaceholder={topbar.searchPlaceholder}
          onSearchChange={topbar.onSearchChange}
          filters={topbar.filters}
          activeFilter={topbar.activeFilter}
          onFilterChange={topbar.onFilterChange}
          buttons={topbar.buttons}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        {/* Conteúdo da página (com padding) */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;