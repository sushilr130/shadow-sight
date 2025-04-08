import { useData } from '@/hooks/useData';
import { getActivityTypeDistribution } from '@/utils/dataTransformer';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useMemo, useState } from 'react';
import { MonthlyActivityChart } from './AdvancedCharts'; // Import for drill-down

const COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#10b981'];

export const YPViewChart = () => {
  const { filteredData } = useData();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const data = useMemo(() => {
    return getActivityTypeDistribution(filteredData);
  }, [filteredData]);

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No YP data available by activity type</p>
      </div>
    );
  }

  if (selectedType) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{selectedType} Activity Over Time</h3>
          <button
            className="text-sm text-primary underline"
            onClick={() => setSelectedType(null)}
          >
            Back to Activity Types
          </button>
        </div>
        <div className="h-80">
          <MonthlyActivityChart
            activityType={selectedType.toLowerCase() as any}
            title={selectedType}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-64 py-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="count"
            barSize={20}
            onClick={(entry) => setSelectedType(entry.name)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="rgba(255,255,255,0.8)"
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YPViewChart;
