
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { useData } from '@/hooks/useData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRiskScoreDistribution } from '@/utils/dataTransformer';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// This component will use the useData hook, so it needs to be inside a DataProvider
const RiskAnalysisContent = () => {
  const { filteredData } = useData();
  const [activePage, setActivePage] = useState(1);
  
  // Risk score distribution
  const riskScoreDistribution = getRiskScoreDistribution(filteredData);
  
  // Activity status distribution
  const activityStatusData = [
    { 
      name: 'Escalated', 
      count: filteredData.filter(d => d.status.toLowerCase().includes('escalated')).length 
    },
    { 
      name: 'Employee Counselled', 
      count: filteredData.filter(d => d.status.toLowerCase().includes('counselled')).length 
    },
    { 
      name: 'Known Good Activity', 
      count: filteredData.filter(d => d.status.toLowerCase().includes('good')).length 
    }
  ];
  
  // Time of day distribution
  const timeOfDayData = [
    { name: 'Morning (6AM-12PM)', count: 0 },
    { name: 'Afternoon (12PM-6PM)', count: 0 },
    { name: 'Evening (6PM-12AM)', count: 0 },
    { name: 'Night (12AM-6AM)', count: 0 }
  ];
  
  filteredData.forEach(d => {
    if (!d.time) return;
    
    try {
      const [hours, minutes] = d.time.split(':').map(Number);
      
      if (hours >= 6 && hours < 12) {
        timeOfDayData[0].count++;
      } else if (hours >= 12 && hours < 18) {
        timeOfDayData[1].count++;
      } else if (hours >= 18 && hours < 24) {
        timeOfDayData[2].count++;
      } else {
        timeOfDayData[3].count++;
      }
    } catch (e) {
      console.error("Error parsing time:", e);
    }
  });
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

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
              <CardTitle>Risk Score Distribution</CardTitle>
              <CardDescription>Distribution of activities by risk score band</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskScoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Activities" />
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
              <CardTitle>Activity Status</CardTitle>
              <CardDescription>Distribution of activities by status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {activityStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [value, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Time of Day Analysis</CardTitle>
              <CardDescription>Distribution of activities by time of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeOfDayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="Activities" />
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

// Main component that properly wraps RiskAnalysisContent with DashboardTemplate,
// which provides the DataProvider
const RiskAnalysis = () => {
  return (
    <DashboardTemplate title="Risk Analysis">
      <RiskAnalysisContent />
    </DashboardTemplate>
  );
};

export default RiskAnalysis;
