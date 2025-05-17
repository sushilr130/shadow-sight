
import UserActivityHeatmap from '../charts/UserActivityHeatmap';

export const HeatmapSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-3 bg-white rounded-xl border border-border/50 shadow-subtle p-6">
        <UserActivityHeatmap />
      </div>
    </div>
  );
};

export default HeatmapSection;
