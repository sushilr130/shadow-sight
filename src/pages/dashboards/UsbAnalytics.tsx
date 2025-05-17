
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { useData } from '@/hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// This component will be wrapped with DataProvider via DashboardTemplate
const UsbAnalyticsContent = () => {
  const { filteredData } = useData();
  const [activePage, setActivePage] = useState(1);
  
  // USB data classification
  const usbDataClassification = [
    { 
      name: 'Internal Data', 
      count: filteredData.filter(d => d.usb && d.internalData).length 
    },
    { 
      name: 'Restricted Data', 
      count: filteredData.filter(d => d.usb && d.restrictedData).length 
    },
    { 
      name: 'Confidential Data', 
      count: filteredData.filter(d => d.usb && d.confidentialData).length 
    }
  ];
  
  // USB file types
  const usbFileTypes = [
    { 
      name: 'Documents', 
      count: filteredData.filter(d => d.usb && d.documents).length 
    },
    { 
      name: 'Presentations', 
      count: filteredData.filter(d => d.usb && d.presentation).length 
    },
    { 
      name: 'Spreadsheets', 
      count: filteredData.filter(d => d.usb && d.spreadsheets).length 
    },
    { 
      name: 'ZIP Files', 
      count: filteredData.filter(d => d.usb && d.zipFiles).length 
    }
  ];
  
  // USB sensitive data
  const usbSensitiveData = [
    { 
      name: 'PCI', 
      count: filteredData.filter(d => d.usb && d.pci).length 
    },
    { 
      name: 'PHI', 
      count: filteredData.filter(d => d.usb && d.phi).length 
    },
    { 
      name: 'PII', 
      count: filteredData.filter(d => d.usb && d.pii).length 
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
              <CardTitle>USB Data Classification</CardTitle>
              <CardDescription>Data classification for USB device activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usbDataClassification}>
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
      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>USB File Types</CardTitle>
              <CardDescription>Types of files transferred via USB devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usbFileTypes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#0EA5E9" name="Count" />
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
              <CardTitle>Sensitive Data in USB Transfers</CardTitle>
              <CardDescription>PCI, PHI, and PII data transferred via USB</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={usbSensitiveData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#ea384c" name="Count" />
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

// Main component that properly wraps UsbAnalyticsContent with DashboardTemplate
const UsbAnalytics = () => {
  return (
    <DashboardTemplate title="USB Analytics">
      <UsbAnalyticsContent />
    </DashboardTemplate>
  );
};

export default UsbAnalytics;
