import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { useData } from '@/hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination';

const EmailAnalyticsContent = () => {
  const { filteredData } = useData();
  const [activePage, setActivePage] = useState(1);

  const activityEmailData = [
    { name: 'Email Breaches', count: filteredData.filter(d => d.email).length },
    { name: 'Total Breaches', count: filteredData.length }
  ];

  const emailDataClassification = [
    { name: 'Internal Data', count: filteredData.filter(d => d.email && d.internalData).length },
    { name: 'Restricted Data', count: filteredData.filter(d => d.email && d.restrictedData).length },
    { name: 'Confidential Data', count: filteredData.filter(d => d.email && d.confidentialData).length }
  ];

  const personalEmailFileTypes = [
    { name: 'Documents', count: filteredData.filter(d => d.email && d.personalEmailAddress && d.documents).length },
    { name: 'Presentations', count: filteredData.filter(d => d.email && d.personalEmailAddress && d.presentation).length },
    { name: 'Spreadsheets', count: filteredData.filter(d => d.email && d.personalEmailAddress && d.spreadsheets).length }
  ];

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

  const titles = [
    'Breach Counts',
    'Email Data Classification',
    'Personal Email File Types',
    'Email Enhanced Monitoring'
  ];

  const handlePageChange = (page: number) => setActivePage(page);

  const renderActiveChart = () => {
    switch (activePage) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Breach Counts</CardTitle>
              <CardDescription>Number of email breaches vs total breaches</CardDescription>
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

<Pagination className="mt-8 text-sm md:text-base">
  <PaginationContent className="flex flex-wrap gap-4 justify-center">
    {activePage > 1 && (
      <PaginationItem>
        <button
          onClick={() => handlePageChange(activePage - 1)}
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition"
        >
          ← {titles[activePage - 2]}
        </button>
      </PaginationItem>
    )}

    {activePage < titles.length && (
      <PaginationItem>
        <button
          onClick={() => handlePageChange(activePage + 1)}
          className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 transition"
        >
          {titles[activePage]} →
        </button>

              </PaginationItem>
            )}
  </PaginationContent>
</Pagination>
    </div>
  );
};

const EmailAnalytics = () => (
  <DashboardTemplate title="Email Analytics">
    <EmailAnalyticsContent />
  </DashboardTemplate>
);

export default EmailAnalytics;
