
import { useData } from '@/hooks/useData';
import { getActivityByDay } from '@/utils/dataTransformer';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { useMemo, useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BarChart2, LineChart as LineChartIcon, Activity } from 'lucide-react';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '../ui/chart';

export const ActivityTrendChart = () => {
  const { filteredData } = useData();
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  
  const data = useMemo(() => {
    const activityData = getActivityByDay(filteredData);
    
    // Format dates for better display
    return activityData.map(item => ({
      ...item,
      formattedDate: new Date(item.name).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }));
  }, [filteredData]);
  
  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No data available for breach trends</p>
      </div>
    );
  }
  
  const config = {
    activities: {
      label: "Activities",
      theme: {
        light: "hsl(var(--primary))",
        dark: "hsl(var(--primary))"
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Breach Trends</h3>
        <ToggleGroup type="single" value={chartType} onValueChange={(value) => value && setChartType(value as 'line' | 'area')}>
          <ToggleGroupItem value="line" aria-label="Line Chart">
            <LineChartIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="area" aria-label="Area Chart">
            <Activity className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="w-full h-64">
        <ChartContainer config={config} className="h-full">
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 'auto']}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="activities"
                stroke="var(--color-activities)" 
                strokeWidth={2} 
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                animationDuration={800}
              />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="formattedDate" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: '#f0f0f0' }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 'auto']}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="value"
                name="activities"
                stroke="var(--color-activities)" 
                fill="var(--color-activities)" 
                fillOpacity={0.3}
                animationDuration={800}
              />
            </AreaChart>
          )}
        </ChartContainer>
      </div>
    </div>
  );
};

export default ActivityTrendChart;
