
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { useData } from '@/hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// This component must be wrapped by a DataProvider
const ComplianceReportsContent = () => {
  const { filteredData } = useData();
  const [activePage, setActivePage] = useState(1);
  
  // Data classification overview
  const dataClassification = [
    { 
      name: 'Internal Data', 
      count: filteredData.filter(d => d.internalData).length 
    },
    { 
      name: 'Restricted Data', 
      count: filteredData.filter(d => d.restrictedData).length 
    },
    { 
      name: 'Confidential Data', 
      count: filteredData.filter(d => d.confidentialData).length 
    }
  ];
  
  // File types overview
  const fileTypes = [
    { 
      name: 'Documents', 
      count: filteredData.filter(d => d.documents).length 
    },
    { 
      name: 'Presentations', 
      count: filteredData.filter(d => d.presentation).length 
    },
    { 
      name: 'Spreadsheets', 
      count: filteredData.filter(d => d.spreadsheets).length 
    },
    { 
      name: 'ZIP Files', 
      count: filteredData.filter(d => d.zipFiles).length 
    }
  ];
  
  // Sensitive data overview
  const sensitiveData = [
    { 
      name: 'PCI', 
      count: filteredData.filter(d => d.pci).length 
    },
    { 
      name: 'PHI', 
      count: filteredData.filter(d => d.phi).length 
    },
    { 
      name: 'PII', 
      count: filteredData.filter(d => d.pii).length 
    }
  ];
  
  // Activity type counts
  const activityTypes = [
    { 
      name: 'Email', 
      count: filteredData.filter(d => d.email).length 
    },
    { 
      name: 'USB', 
      count: filteredData.filter(d => d.usb).length 
    },
    { 
      name: 'Cloud', 
      count: filteredData.filter(d => d.cloud).length 
    }
  ];

  // Handle page changes
  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  // Render the appropriate chart based on active page
  const renderActiveChart = () => {
    switch (activePage) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Data Classification Overview</CardTitle>
              <CardDescription>Distribution of activities by data classification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataClassification}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>File Types Overview</CardTitle>
              <CardDescription>Distribution of activities by file types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fileTypes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sensitive Data Overview</CardTitle>
              <CardDescription>Distribution of activities by sensitive data type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sensitiveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#F97316" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Activity Types</CardTitle>
              <CardDescription>Count of email, USB, and cloud activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityTypes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#1EAEDB" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
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
          
          {[1, 2, 3, 4].map((page) => (
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
              onClick={() => handlePageChange(Math.min(4, activePage + 1))}
              className={activePage === 4 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

// Main component that provides the DataProvider via DashboardTemplate
const ComplianceReports = () => {
  return (
    <DashboardTemplate title="Compliance Reports">
      <ComplianceReportsContent />
    </DashboardTemplate>
  );
};

export default ComplianceReports;
