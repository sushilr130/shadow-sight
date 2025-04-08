
import { DataProvider } from '@/hooks/useData';
import Header from '@/components/layout/Header';
import Dashboard from '@/components/layout/Dashboard';
import { useState, useEffect } from 'react';

const Index = () => {
  const [mounted, setMounted] = useState(false);

  // Use this effect to enable animations only after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <DataProvider>
      <div className={`min-h-screen flex flex-col ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
        <Header />
        <main className="flex-grow flex">
          <Dashboard />
        </main>
      </div>
    </DataProvider>
  );
};

export default Index;
