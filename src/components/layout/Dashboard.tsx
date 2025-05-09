
import { useData } from '@/hooks/useData';
import { getAverageRiskScore, getHighRiskCount, getTopPolicyViolations } from '@/utils/dataTransformer';
import { AlertTriangle, BarChart3, FileText, Users } from 'lucide-react';
import StatsCard from '../ui/StatsCard';
import RiskScoreChart from '../charts/RiskScoreChart';
import ActivityTypeChart from '../charts/ActivityTypeChart';
import UserActivityTable from '../charts/UserActivityTable';
import DataUploader from '../ui/DataUploader';
import DateRangePicker from '../ui/DateRangePicker';
import { useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import {
  EmailDomainChart,
  IntegrationActivityChart,
  ManagerActionsChart,
  DataSensitivityChart,
  IntegrationSensitivityChart,
  FileTypesChart,
  ComplianceDataChart,
  PersonalEmailFilesChart,
  DataLeakageTrendChart,
  MonthlyActivityChart,
  RiskDistributionChart,
  TimeOfDayChart,
  DataLeakageByUserChart,
  HighRiskEmployeeChart
} from '../charts/AdvancedCharts';
import YPViewChart from '../charts/YPViewChart';

export const Dashboard = () => {
  const { filteredData, data } = useData();
  const [selectedChart, setSelectedChart] = useState('email-domains');
  
  const averageRiskScore = useMemo(() => getAverageRiskScore(filteredData), [filteredData]);
  const highRiskCount = useMemo(() => getHighRiskCount(filteredData), [filteredData]);
  const topViolations = useMemo(() => getTopPolicyViolations(filteredData), [filteredData]);

  // Render the selected chart component
  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'yp-view':
        return <YPViewChart />;
      case 'email-domains':
        return <EmailDomainChart />;
      case 'integration-activity':
        return <IntegrationActivityChart />;
      case 'manager-actions':
        return <ManagerActionsChart />;
      case 'data-sensitivity':
        return <DataSensitivityChart />;
      case 'email-sensitivity':
        return <IntegrationSensitivityChart integrationType="email" />;
      case 'usb-sensitivity':
        return <IntegrationSensitivityChart integrationType="usb" />;
      case 'cloud-sensitivity':
        return <IntegrationSensitivityChart integrationType="cloud" />;
      case 'file-types':
        return <FileTypesChart />;
      case 'compliance-data':
        return <ComplianceDataChart />;
      case 'personal-email':
        return <PersonalEmailFilesChart />;
      case 'data-leakage-trend':
        return <DataLeakageTrendChart />;
      case 'data-leakage-months':
        return <MonthlyActivityChart activityType="dataLeakage" title="Data Leakage" />;
      case 'email-monitoring':
        return <MonthlyActivityChart activityType="emailEnhancedMonitoring" title="Email Enhanced Monitoring" />;
      case 'risk-distribution':
        return <RiskDistributionChart />;
      case 'time-of-day':
        return <TimeOfDayChart />;
      case 'data-leakage-users':
        return <DataLeakageByUserChart />;
      case 'high-risk-employee':
        return <HighRiskEmployeeChart />;
      default:
        return <EmailDomainChart />;
    }
  };
  
  if (data.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold tracking-tight mb-3">
            Welcome to Insight Haven <span className="text-primary">Visualizer</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your ABC CSV report to visualize user activity data and gain actionable insights.
            Both raw and processed CSV formats are supported.
          </p>
        </div>
        
        <div className="max-w-xl mx-auto">
          <DataUploader />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onSelectChart={setSelectedChart} selectedChart={selectedChart} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="py-8 px-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              Activity Dashboard
            </h1>
            <DateRangePicker />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Activities" 
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
              description="Across all activities"
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
              title="High Risk Activities" 
              value={highRiskCount}
              icon={<AlertTriangle className="h-5 w-5" />}
              description="Risk score > 1500"
              trend={
                data.length > filteredData.length 
                  ? {
                      value: Math.round((highRiskCount / filteredData.length) * 100),
                      label: "of total activities",
                      isUpward: true
                    }
                  : undefined
              }
            />
          </div>
          
          {/* Selected Chart Section */}
          <div className="bg-white rounded-xl border border-border/50 shadow-subtle p-6 mb-8">
            <h2 className="text-lg font-medium mb-6">{selectedChart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Analysis</h2>
            <div className="h-96">
              {renderSelectedChart()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl border border-border/50 shadow-subtle p-6">
              <h2 className="text-lg font-medium mb-4">Risk Score Distribution</h2>
              <RiskScoreChart />
            </div>
            <div className="bg-white rounded-xl border border-border/50 shadow-subtle p-6">
              <h2 className="text-lg font-medium mb-4">Activity by Type</h2>
              <ActivityTypeChart />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-border/50 shadow-subtle p-6 lg:col-span-2">
              <h2 className="text-lg font-medium mb-4">Top Users by Risk</h2>
              <UserActivityTable />
            </div>
            <div className="bg-white rounded-xl border border-border/50 shadow-subtle p-6">
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
        </div>
      </div>
    </div>
  </div>
</div>
  );
};
export default Dashboard;
