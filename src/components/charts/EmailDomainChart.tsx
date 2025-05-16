
import { useData } from '@/hooks/useData';
import { getEmailDomainDistribution } from '@/utils/dataTransformer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMemo } from 'react';

export const EmailDomainChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getEmailDomainDistribution(filteredData).slice(0, 15);
  }, [filteredData]);
  
  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No data available for email domains</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 120, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            dataKey="domain" 
            type="category" 
            tick={{ fontSize: 12 }}
            width={120}
          />
          <Tooltip
            formatter={(value) => [`${value} Activities`, 'Count']}
            labelFormatter={(label) => `Domain: ${label}`}
          />
          <Bar 
            dataKey="count" 
            fill="#3b82f6" 
            radius={[0, 4, 4, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmailDomainChart;
