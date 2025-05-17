
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { useData } from '@/hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// This component must be wrapped by a DataProvider
const UserMonitoringContent = () => {
  const { filteredData } = useData();
  const [activePage, setActivePage] = useState(1);
  
  // High risk employees by month with monitoring metrics
  const months = ['Jan', 'Feb', 'Mar'];
  const monitoringByMonth = months.map(month => {
    const monthData = filteredData.filter(d => {
      if (!d.parsedDate) return false;
      const m = d.parsedDate.getMonth();
      return (month === 'Jan' && m === 0) || 
             (month === 'Feb' && m === 1) || 
             (month === 'Mar' && m === 2);
    });
    
    return {
      name: month,
      'Enhanced Monitoring': monthData.filter(d => d.enhancedMonitoring).length,
      'Performance Improvement Plan': monthData.filter(d => d.performanceImprovementPlan).length,
      'Productivity Monitored': monthData.filter(d => d.productivityMonitored).length
    };
  });
  
  // Highly monitored users
  const userMonitoring = new Map();
  filteredData.forEach(d => {
    if (d.enhancedMonitoring || d.performanceImprovementPlan || d.productivityMonitored) {
      const key = d.user;
      const current = userMonitoring.get(key) || { 
        user: key, 
        name: key.split('@')[0], // Extract just the name part
        'Enhanced Monitoring': 0,
        'Performance Improvement Plan': 0,
        'Productivity Monitored': 0,
        total: 0
      };
      
      if (d.enhancedMonitoring) current['Enhanced Monitoring']++;
      if (d.performanceImprovementPlan) current['Performance Improvement Plan']++;
      if (d.productivityMonitored) current['Productivity Monitored']++;
      current.total++;
      
      userMonitoring.set(key, current);
    }
  });
  
  const topMonitoredUsers = Array.from(userMonitoring.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  // Custom tooltip formatter to show full email
  const renderTooltip = (props: any) => {
    if (!props.active || !props.payload) return null;
    
    const { payload } = props;
    const userData = payload[0]?.payload;
    
    if (!userData) return null;
    
    return (
      <div className="bg-background/95 p-3 border border-border rounded-md shadow-md">
        <p className="font-medium mb-1">{userData.user}</p>
        <div className="text-sm space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      </div>
    );
  };

  // Render the appropriate chart based on active page
  const renderActiveChart = () => {
    switch (activePage) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>High Risk Employee Monitoring by Month</CardTitle>
              <CardDescription>Monitoring metrics across Jan, Feb, Mar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monitoringByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Enhanced Monitoring" fill="#8884d8" />
                    <Bar dataKey="Performance Improvement Plan" fill="#82ca9d" />
                    <Bar dataKey="Productivity Monitored" fill="#ffc658" />
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
              <CardTitle>Top Monitored Users</CardTitle>
              <CardDescription>Users with highest monitoring activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topMonitoredUsers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={120} 
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={renderTooltip} />
                    <Legend />
                    <Bar dataKey="Enhanced Monitoring" fill="#8884d8" />
                    <Bar dataKey="Performance Improvement Plan" fill="#82ca9d" />
                    <Bar dataKey="Productivity Monitored" fill="#ffc658" />
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
          
          {[1, 2].map((page) => (
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
              onClick={() => handlePageChange(Math.min(2, activePage + 1))}
              className={activePage === 2 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

// Main component that provides the DataProvider via DashboardTemplate
const UserMonitoring = () => {
  return (
    <DashboardTemplate title="User Monitoring">
      <UserMonitoringContent />
    </DashboardTemplate>
  );
};

export default UserMonitoring;
