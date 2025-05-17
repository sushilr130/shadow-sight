
import ActivityTrendChart from '../charts/ActivityTrendChart';
import ActivityTypeChart from '../charts/ActivityTypeChart';

export const ActivityAnalyticsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-2 bg-card rounded-xl border border-border/50 shadow-subtle p-6">
        <ActivityTrendChart />
      </div>
      <div className="bg-card rounded-xl border border-border/50 shadow-subtle p-6">
        <h2 className="text-lg font-medium mb-4">Activity by Type</h2>
        <ActivityTypeChart />
      </div>
    </div>
  );
};

export default ActivityAnalyticsSection;
