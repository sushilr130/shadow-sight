
import { useData } from '@/hooks/useData';
import { getActivityTypeByMonth } from '@/utils/dataTransformer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMemo } from 'react';

export const ActivityTypeByMonthChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getActivityTypeByMonth(filteredData);
  }, [filteredData]);
  
  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No data available for activity by month</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
          <Line 
            type="monotone" 
            dataKey="email" 
            stroke="#3b82f6" 
            activeDot={{ r: 8 }} 
            strokeWidth={2}
            name="Email"
          />
          <Line 
            type="monotone" 
            dataKey="usb" 
            stroke="#f97316" 
            strokeWidth={2}
            name="USB"
          />
          <Line 
            type="monotone" 
            dataKey="cloud" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Cloud"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityTypeByMonthChart;
