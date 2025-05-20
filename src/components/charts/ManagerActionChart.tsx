
import { useData } from '@/hooks/useData';
import { getManagerActions } from '@/utils/dataTransformer';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useMemo } from 'react';

export const ManagerActionChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getManagerActions(filteredData);
  }, [filteredData]);
  
  const COLORS = ['#ef4444', '#f97316', '#22c55e', '#cbd5e1'];
  
  console.log(filteredData)
  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No data available for manager actions</p>
      </div>
    );
  }
  
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 rounded-md shadow-md border border-border/50 text-sm">
          <p className="font-medium">{payload[0].name}: {payload[0].value}</p>
          <p className="text-muted-foreground">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            paddingAngle={2}
            dataKey="count"
            nameKey="action"
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                stroke="rgba(255,255,255,0.8)"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            iconSize={10}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ManagerActionChart;
