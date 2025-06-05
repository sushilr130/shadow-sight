
import { useData } from '@/hooks/useData';
import { getAverageRiskScore, getHighRiskCount } from '@/utils/dataTransformer';
import { FileText, Users, BarChart3, AlertTriangle } from 'lucide-react';
import StatsCard from '../ui/StatsCard';
import { useMemo } from 'react';

export const StatsSection = () => {
  const { filteredData, data } = useData();
  
  const averageRiskScore = useMemo(() => getAverageRiskScore(filteredData), [filteredData]);
  const highRiskCount = useMemo(() => getHighRiskCount(filteredData), [filteredData]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="Total Breaches" 
        value={filteredData.length}
        icon={<FileText className="h-5 w-5" />}
        description="Monitored user actions"
      />
      <StatsCard 
        title="Unique Users" 
        value={new Set(filteredData.map(d => d.user)).size}
        icon={<Users className="h-5 w-5" />}
        description="Active in selected period"
      />
      <StatsCard 
        title="Average Risk Score" 
        value={averageRiskScore}
        icon={<BarChart3 className="h-5 w-5" />}
        description="Across all breaches"
        trend={
          data.length > filteredData.length 
            ? {
                value: Math.round((averageRiskScore / getAverageRiskScore(data) - 1) * 100),
                label: "vs. all time",
                isUpward: averageRiskScore > getAverageRiskScore(data)
              }
            : undefined
        }
      />
      <StatsCard 
        title="High Risk Breaches" 
        value={highRiskCount}
        icon={<AlertTriangle className="h-5 w-5" />}
        description="Risk score > 1500"
        trend={
          data.length > filteredData.length 
            ? {
                value: Math.round((highRiskCount / filteredData.length) * 100),
                label: "of total breaches",
                isUpward: true
              }
            : undefined
        }
      />
    </div>
  );
};

export default StatsSection;
