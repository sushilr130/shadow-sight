
import { useData } from '@/hooks/useData';
import DateRangePicker from '../ui/DateRangePicker';
import WelcomeScreen from '../dashboard/WelcomeScreen';
import StatsSection from '../dashboard/StatsSection';
import ActivityAnalyticsSection from '../dashboard/ActivityAnalyticsSection';
import HeatmapSection from '../dashboard/HeatmapSection';
import RiskAnalysisSection from '../dashboard/RiskAnalysisSection';
import DataManagementSection from '../dashboard/DataManagementSection';

export const Dashboard = () => {
  const { data } = useData();
  
  if (data.length === 0) {
    return <WelcomeScreen />;
  }
  
  return (
    <div className="py-8 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Breach Dashboard
        </h1>
        <div className="flex items-center gap-2">
          <DateRangePicker />
        </div>
      </div>
      
      <StatsSection />
      <ActivityAnalyticsSection />
      <HeatmapSection />
      <RiskAnalysisSection />
      <DataManagementSection />
    </div>
  );
};

export default Dashboard;
