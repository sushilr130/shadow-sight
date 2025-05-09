
import { useData } from '@/hooks/useData';
import { getMonitoringDataByMonth } from '@/utils/dataTransformer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMemo } from 'react';

export const MonitoringDataByMonthChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getMonitoringDataByMonth(filteredData).filter(d => 
      d.enhancedMonitoring > 0 || 
      d.performanceImprovementPlan > 0 || 
      d.productivityMonitored > 0
    );
  }, [filteredData]);
  
  if (filteredData.length === 0 || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No monitoring data available</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#f0f0f0' }}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="enhancedMonitoring" 
            fill="#3b82f6" 
            name="Enhanced Monitoring"
            radius={[4, 4, 0, 0]}
            stackId="a"
          />
          <Bar 
            dataKey="performanceImprovementPlan" 
            fill="#f97316" 
            name="Performance Improvement Plan"
            radius={[4, 4, 0, 0]}
            stackId="a"
          />
          <Bar 
            dataKey="productivityMonitored" 
            fill="#10b981" 
            name="Productivity Monitored"
            radius={[4, 4, 0, 0]}
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonitoringDataByMonthChart;
