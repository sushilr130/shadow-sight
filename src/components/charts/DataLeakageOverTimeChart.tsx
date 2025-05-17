
import { useData } from '@/hooks/useData';
import { getDataLeakageOverTime } from '@/utils/dataTransformer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';

export const DataLeakageOverTimeChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getDataLeakageOverTime(filteredData);
  }, [filteredData]);
  
  if (filteredData.length === 0 || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No data available for data leakage over time</p>
      </div>
    );
  }
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
  };
  
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
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#f0f0f0' }}
            interval={Math.ceil(data.length / 12)}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value) => [`${value} Incidents`, 'Count']}
            labelFormatter={(label) => `Date: ${formatDate(label)}`}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#ef4444" 
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 5 }}
            name="Data Leakage Incidents"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataLeakageOverTimeChart;
