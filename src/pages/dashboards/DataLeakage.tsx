
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { useData } from '@/hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const DataLeakageContent = () => {
  const { filteredData } = useData();
  const [activePage, setActivePage] = useState(1);
  
  // Data leakage by month
  const months = ['Jan', 'Feb', 'Mar'];
  const dataLeakageByMonth = months.map(month => ({
    name: month,
    count: filteredData.filter(d => {
      if (!d.parsedDate || !d.dataLeakage) return false;
      const m = d.parsedDate.getMonth();
      return (month === 'Jan' && m === 0) || 
             (month === 'Feb' && m === 1) || 
             (month === 'Mar' && m === 2);
    }).length
  }));
  
  // Data leakage by user (with count > 10)
  const userLeakageMap = new Map();
  filteredData.forEach(d => {
    if (d.dataLeakage) {
      userLeakageMap.set(d.user, (userLeakageMap.get(d.user) || 0) + 1);
    }
  });
  
  const dataLeakageByUser = Array.from(userLeakageMap.entries())
    .filter(([_, count]) => count > 10)
    .map(([user, count]) => ({ name: user, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Data classification in data leakage
  const leakageDataClassification = [
    { 
      name: 'Internal Data', 
      count: filteredData.filter(d => d.dataLeakage && d.internalData).length 
    },
    { 
      name: 'Restricted Data', 
      count: filteredData.filter(d => d.dataLeakage && d.restrictedData).length 
    },
    { 
      name: 'Confidential Data', 
      count: filteredData.filter(d => d.dataLeakage && d.confidentialData).length 
    }
  ];
  
  // Data leakage by file type
  const leakageFileTypes = [
    { 
      name: 'Documents', 
      count: filteredData.filter(d => d.dataLeakage && d.documents).length 
    },
    { 
      name: 'Presentations', 
      count: filteredData.filter(d => d.dataLeakage && d.presentation).length 
    },
    { 
      name: 'Spreadsheets', 
      count: filteredData.filter(d => d.dataLeakage && d.spreadsheets).length 
    },
    { 
      name: 'ZIP Files', 
      count: filteredData.filter(d => d.dataLeakage && d.zipFiles).length 
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
              <CardTitle>Data Leakage by Month</CardTitle>
              <CardDescription>Monthly data leakage incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataLeakageByMonth}>
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
              <CardTitle>Users with High Data Leakage</CardTitle>
              <CardDescription>Users with more than 10 data leakage incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataLeakageByUser} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
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
              <CardTitle>Data Classification in Leakages</CardTitle>
              <CardDescription>Types of data involved in leakage incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leakageDataClassification}>
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
      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle>File Types in Data Leakages</CardTitle>
              <CardDescription>Types of files involved in data leakage incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leakageFileTypes}>
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

// Wrapper component that uses DashboardTemplate
const DataLeakage = () => {
  return (
    <DashboardTemplate title="Data Leakage Analysis">
      <DataLeakageContent />
    </DashboardTemplate>
  );
};

export default DataLeakage;
