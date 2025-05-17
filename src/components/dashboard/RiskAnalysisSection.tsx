
import { useData } from '@/hooks/useData';
import { getTopPolicyViolations } from '@/utils/dataTransformer';
import RiskScoreChart from '../charts/RiskScoreChart';
import UserActivityTable from '../charts/UserActivityTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from 'react';

export const RiskAnalysisSection = () => {
  const { filteredData } = useData();
  const topViolations = useMemo(() => getTopPolicyViolations(filteredData), [filteredData]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-card rounded-xl border border-border/50 shadow-subtle p-6 lg:col-span-2">
        <h2 className="text-lg font-medium mb-4">Top Users by Risk</h2>
        <UserActivityTable />
      </div>
      <div className="bg-card rounded-xl border border-border/50 shadow-subtle p-6">
        <Tabs defaultValue="risk">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="risk">Risk Score</TabsTrigger>
            <TabsTrigger value="violations">Policy Violations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="risk">
            <h2 className="text-lg font-medium mb-4">Risk Score Distribution</h2>
            <RiskScoreChart />
          </TabsContent>
          
          <TabsContent value="violations">
            <h2 className="text-lg font-medium mb-4">Top Policy Violations</h2>
            <div className="space-y-3 mt-6">
              {topViolations.slice(0, 6).map((violation, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{violation.name}</span>
                    <span className="text-sm text-muted-foreground">{violation.count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (violation.count / topViolations[0].count) * 100)}%`,
                        opacity: 1 - (index * 0.1)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RiskAnalysisSection;
