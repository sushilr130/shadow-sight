
import { useData } from '@/hooks/useData';
import { getRiskScoreDistribution } from '@/utils/dataTransformer';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMemo } from 'react';

export const RiskScoreChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getRiskScoreDistribution(filteredData);
  }, [filteredData]);
  
  const colors = [
    'rgba(74, 222, 128, 0.8)', // Low
    'rgba(250, 204, 21, 0.8)', // Moderate
    'rgba(251, 146, 60, 0.8)', // High
    'rgba(248, 113, 113, 0.8)', // Very High
    'rgba(239, 68, 68, 0.8)', // Critical
  ];
  
  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No data available for risk score distribution</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-64 py-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
        >
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#f0f0f0' }}
            tickMargin={8}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value === 0 ? '' : value}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.97)',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              fontSize: '0.875rem',
            }}
            formatter={(value) => [`${value} Activities`, 'Count']}
            labelFormatter={(label) => `Risk Level: ${label}`}
          />
          <Bar 
            dataKey="count" 
            barSize={50} 
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

export default RiskScoreChart;
