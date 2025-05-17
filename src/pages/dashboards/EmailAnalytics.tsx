
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { useData } from '@/hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const EmailAnalyticsContent = () => {
  const { filteredData } = useData();
  const [activePage, setActivePage] = useState(1);
  
  // Count of activity ID and email
  const activityEmailData = [
    { name: 'Email Activities', count: filteredData.filter(d => d.email).length },
    { name: 'Total Activities', count: filteredData.length }
  ];
  
  // Data classification in email
  const emailDataClassification = [
    { 
      name: 'Internal Data', 
      count: filteredData.filter(d => d.email && d.internalData).length 
    },
    { 
      name: 'Restricted Data', 
      count: filteredData.filter(d => d.email && d.restrictedData).length 
    },
    { 
      name: 'Confidential Data', 
      count: filteredData.filter(d => d.email && d.confidentialData).length 
    }
  ];
  
  // Count of documents, presentation, spreadsheets in personal email
  const personalEmailFileTypes = [
    { 
      name: 'Documents', 
      count: filteredData.filter(d => d.email && d.personalEmailAddress && d.documents).length 
    },
    { 
      name: 'Presentations', 
      count: filteredData.filter(d => d.email && d.personalEmailAddress && d.presentation).length 
    },
    { 
      name: 'Spreadsheets', 
      count: filteredData.filter(d => d.email && d.personalEmailAddress && d.spreadsheets).length 
    }
  ];
  
  // Email enhanced monitoring by month
  const months = ['Jan', 'Feb', 'Mar'];
  const emailMonitoringByMonth = months.map(month => ({
    name: month,
    count: filteredData.filter(d => {
      if (!d.parsedDate || !d.email || !d.emailEnhancedMonitoring) return false;
      const m = d.parsedDate.getMonth();
      return (month === 'Jan' && m === 0) || 
             (month === 'Feb' && m === 1) || 
             (month === 'Mar' && m === 2);
    }).length
  }));

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
              <CardTitle>Activity Counts</CardTitle>
              <CardDescription>Number of email activities vs total activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityEmailData}>
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
              <CardTitle>Email Data Classification</CardTitle>
              <CardDescription>Count of different data classifications in emails</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emailDataClassification}>
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
              <CardTitle>Personal Email File Types</CardTitle>
              <CardDescription>File types shared via personal email addresses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={personalEmailFileTypes}>
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
              <CardTitle>Email Enhanced Monitoring</CardTitle>
              <CardDescription>Email monitoring trends by month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={emailMonitoringByMonth}>
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
const EmailAnalytics = () => {
  return (
    <DashboardTemplate title="Email Analytics">
      <EmailAnalyticsContent />
    </DashboardTemplate>
  );
};

export default EmailAnalytics;
