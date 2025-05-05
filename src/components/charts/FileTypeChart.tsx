
import { useData } from '@/hooks/useData';
import { getFileTypeCounts } from '@/utils/dataTransformer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMemo } from 'react';

export const FileTypeChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getFileTypeCounts(filteredData);
  }, [filteredData]);
  
  const colors = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6'];
  
  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No data available for file types</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="fileType" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#f0f0f0' }}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value) => [`${value} Activities`, 'Count']}
            labelFormatter={(label) => `Type: ${label}`}
          />
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FileTypeChart;
