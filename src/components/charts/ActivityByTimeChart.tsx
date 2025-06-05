
import { useData } from '@/hooks/useData';
import { getActivityByHour } from '@/utils/dataTransformer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

export const ActivityByTimeChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getActivityByHour(filteredData);
  }, [filteredData]);
  
  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No data available for breach time distribution</p>
      </div>
    );
  }
  
  const formatXAxisTick = (value: string) => {
    return value.split(':')[0];
  };
  
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="hour" 
            tickFormatter={formatXAxisTick}
            tick={{ fontSize: 12 }} 
            interval={1}
            tickLine={false}
            axisLine={{ stroke: '#f0f0f0' }}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [`${value} Breaches`, 'Count']}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <Bar 
            dataKey="count" 
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityByTimeChart;
