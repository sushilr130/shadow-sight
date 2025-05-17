
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import Dashboard from '@/components/layout/Dashboard';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  // Use this effect to enable animations only after initial render
  useEffect(() => {
    setMounted(true);
    
    // Handle direct URL navigation by ensuring proper URL format
    const currentPath = window.location.pathname;
    if (currentPath !== '/' && !document.referrer) {
      console.log('Direct navigation to:', currentPath);
      
      // If the path doesn't start with a slash, add it
      if (!currentPath.startsWith('/')) {
        navigate(`/${currentPath}`);
      }
    }
  }, [navigate]);

  return (
    <DashboardTemplate title="Activity Dashboard">
      <div className={`${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
        <Dashboard />
      </div>
    </DashboardTemplate>
  );
};

export default Index;
