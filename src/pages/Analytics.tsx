
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { ActivityTypeChart } from '@/components/charts/ActivityTypeChart';
import { ActivityTrendChart } from '@/components/charts/ActivityTrendChart';
import { getActivityTypeDistribution } from '@/utils/dataTransformer';
import { useData } from '@/hooks/useData';

// Separate content component that will be wrapped by DataProvider in DashboardTemplate
const AnalyticsContent = () => {
  const { filteredData } = useData();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-medium mb-4">Breach by Type</h2>
          <div className="h-80">
            <ActivityTypeChart />
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-medium mb-4">Breach Trend</h2>
          <div className="h-80">
            <ActivityTrendChart />
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-card rounded-lg border mb-6">
        <h2 className="text-lg font-medium mb-4">Available Analytics</h2>
        <p className="text-muted-foreground mb-4">
          Choose a specific analytics view from the sidebar to explore detailed insights:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Email Analytics", description: "Email breach analysis with data classification metrics" },
            { title: "USB Analytics", description: "USB device usage patterns and data classification" },
            { title: "Cloud Analytics", description: "Cloud service usage and data classification" },
            { title: "Data Leakage", description: "Data leakage trends and prevention" },
            { title: "Risk Analysis", description: "Risk score distribution and time patterns" },
            { title: "User Monitoring", description: "High risk employee monitoring and improvement plans" }
          ].map((item) => (
            <div key={item.title} className="p-4 border rounded-md">
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Main Analytics component properly uses DashboardTemplate which provides DataProvider and SidebarProvider
const Analytics = () => {
  return (
    <DashboardTemplate title="Analytics Dashboard">
      <AnalyticsContent />
    </DashboardTemplate>
  );
};

export default Analytics;
