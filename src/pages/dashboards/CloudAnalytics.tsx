
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { useData } from '@/hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo, useState } from 'react';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// This component will be wrapped with DataProvider via DashboardTemplate
const CloudAnalyticsContent = () => {
  const { filteredData } = useData();
  const [activePage, setActivePage] = useState(1);
  
  // Cloud data classification
  const cloudDataClassification = useMemo(() => [
    { 
      name: 'Internal Data', 
      count: filteredData.filter(d => d.cloud && d.internalData).length 
    },
    { 
      name: 'Restricted Data', 
      count: filteredData.filter(d => d.cloud && d.restrictedData).length 
    },
    { 
      name: 'Confidential Data', 
      count: filteredData.filter(d => d.cloud && d.confidentialData).length 
    }
  ], [filteredData]);
  
  // Cloud file types
  const cloudFileTypes = useMemo(() => [
    { 
      name: 'Documents', 
      count: filteredData.filter(d => d.cloud && d.documents).length 
    },
    { 
      name: 'Presentations', 
      count: filteredData.filter(d => d.cloud && d.presentation).length 
    },
    { 
      name: 'Spreadsheets', 
      count: filteredData.filter(d => d.cloud && d.spreadsheets).length 
    },
    { 
      name: 'ZIP Files', 
      count: filteredData.filter(d => d.cloud && d.zipFiles).length 
    }
  ], [filteredData]);
  
  // Cloud sensitive data
  const cloudSensitiveData = useMemo(() => [
    { 
      name: 'PCI', 
      count: filteredData.filter(d => d.cloud && d.pci).length 
    },
    { 
      name: 'PHI', 
      count: filteredData.filter(d => d.cloud && d.phi).length 
    },
    { 
      name: 'PII', 
      count: filteredData.filter(d => d.cloud && d.pii).length 
    }
  ], [filteredData]);

  // Chart configurations
  const chartConfig = {
    default: { color: "#8B5CF6" },
    files: { color: "#7E69AB" },
    sensitive: { color: "#1EAEDB" }
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  // Render the appropriate chart based on active page
  const renderActiveChart = () => {
    switch (activePage) {
      case 1:
        return (
          <Card id="chart-data-classification" className="card">
            <CardHeader>
              <CardTitle className="card-title">Cloud Data Classification</CardTitle>
              <CardDescription className="card-description">Data classification for cloud service breaches</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ChartContainer 
                  className="h-full" 
                  config={chartConfig}
                >
                  <BarChart data={cloudDataClassification} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8B5CF6" name="Count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card id="chart-file-types" className="card">
            <CardHeader>
              <CardTitle className="card-title">Cloud File Types</CardTitle>
              <CardDescription className="card-description">Types of files shared via cloud services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ChartContainer 
                  className="h-full" 
                  config={chartConfig}
                >
                  <BarChart data={cloudFileTypes} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#7E69AB" name="Count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card id="chart-sensitive-data" className="card">
            <CardHeader>
              <CardTitle className="card-title">Sensitive Data in Cloud Shares</CardTitle>
              <CardDescription className="card-description">PCI, PHI, and PII data shared via cloud services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ChartContainer 
                  className="h-full" 
                  config={chartConfig}
                >
                  <BarChart data={cloudSensitiveData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#1EAEDB" name="Count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {renderActiveChart()}
      
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, activePage - 1))}
              className={activePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {[1, 2, 3].map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={activePage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(3, activePage + 1))}
              className={activePage === 3 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

// Main component that properly wraps CloudAnalyticsContent with DashboardTemplate
const CloudAnalytics = () => {
  return (
    <DashboardTemplate title="Cloud Analytics">
      <CloudAnalyticsContent />
    </DashboardTemplate>
  );
};

export default CloudAnalytics;
