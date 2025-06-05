
import Header from './Header';
import Footer from './Footer';
import { SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './Sidebar';
import { DataProvider } from '@/providers/DataProvider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportToPDF } from '@/utils/pdfExport';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useData } from '@/hooks/useData';

interface DashboardTemplateProps {
  title: string;
  children: React.ReactNode;
}

// This is the component that will be used inside the providers
const DashboardTemplateContent = ({ 
  title, 
  children
}: DashboardTemplateProps) => {
  const location = useLocation();
  const { data } = useData();
  const isMainDashboard = location.pathname === '/';
  const isDataManagement = location.pathname === '/data-management';
  const isSettings = location.pathname === '/settings';
  const [isExporting, setIsExporting] = useState(false);
  const hasData = data.length > 0;
  
  const handleExport = async () => {
    setIsExporting(true);
    const loadingToast = toast.loading('Generating PDF export...');
    
    try {
      const result = await exportToPDF({
        title: `${title} Report`,
      });
      
      toast.dismiss(loadingToast);
      if (result.success) {
        toast.success('Export completed successfully');
      } else {
        toast.error('Export failed');
      }
    } catch (error) {
      console.error('PDF export error:', error);
      toast.dismiss(loadingToast);
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  // If there's no data, just render the children (which should be the welcome screen)
  if (!hasData && isMainDashboard) {
    return (
      <div className="min-h-screen w-full">
        <main className="flex-grow bg-background">
          <div className="py-8 px-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex">
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-grow px-4 bg-background">
          <div className="py-8 px-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold tracking-tight">
                {title}
              </h1>
              <div className="flex gap-3">
                {/* Only show export button if we have data and we're not on Data Management or Settings pages */}
                {hasData && !isDataManagement && !isSettings && (
                  <Button 
                    onClick={handleExport} 
                    variant="outline" 
                    className="flex items-center gap-2"
                    disabled={isExporting}
                  >
                    <Download size={16} />
                    {isExporting ? 'Exporting...' : 'Export PDF'}
                  </Button>
                )}
              </div>
            </div>
            {children}
          </div>
        </main>
        <Footer />
      </SidebarInset>
    </div>
  );
};

// This is the wrapper component that includes both providers
const DashboardTemplate = (props: DashboardTemplateProps) => {
  const DataTemplateContent = () => {
    const { data } = useData();
    const hasData = data.length > 0;
    const isMainDashboard = props.title === "Breach Dashboard";
    
    // If no data and on main dashboard, render content without SidebarProvider
    if (!hasData && isMainDashboard) {
      return <DashboardTemplateContent {...props} />;
    }
    
    // Otherwise render with SidebarProvider
    return (
      <SidebarProvider defaultOpen={true}>
        <DashboardTemplateContent {...props} />
      </SidebarProvider>
    );
  };

  return (
    <DataProvider>
      <DataTemplateContent />
    </DataProvider>
  );
};

export default DashboardTemplate;