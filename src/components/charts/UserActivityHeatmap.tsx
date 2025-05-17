
import { useData } from '@/hooks/useData';
import { useMemo } from 'react';
import { ChartContainer } from '../ui/chart';

export const UserActivityHeatmap = () => {
  const { filteredData } = useData();
  
  const heatmapData = useMemo(() => {
    // Group activities by day of week and hour
    const activityByHour = new Map<string, number>();
    
    // Initialize all slots with 0
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        activityByHour.set(`${day}-${hour}`, 0);
      }
    }
    
    // Fill with actual data
    filteredData.forEach(activity => {
      if (!activity.parsedDate) return;
      
      const day = activity.parsedDate.getDay();
      const hour = activity.parsedDate.getHours();
      const key = `${day}-${hour}`;
      
      activityByHour.set(key, (activityByHour.get(key) || 0) + 1);
    });
    
    // Convert to array format
    return Array.from(activityByHour.entries()).map(([key, count]) => {
      const [day, hour] = key.split('-').map(Number);
      return { day, hour, count };
    });
  }, [filteredData]);
  
  const getColor = (count: number) => {
    const max = Math.max(...heatmapData.map(d => d.count));
    if (count === 0) return 'rgb(248, 248, 248)';
    const intensity = Math.min(0.9, 0.1 + (count / max) * 0.8);
    return `rgba(59, 130, 246, ${intensity})`;
  };
  
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border border-border rounded-lg p-6">
        <p className="text-muted-foreground">No data available for activity heatmap</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Activity Heatmap (Day/Hour)</h3>
      
      <div className="w-full relative p-4 overflow-x-auto">
        <div className="flex mb-2">
          <div className="w-12"></div>
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex-1 text-center text-xs text-muted-foreground">
              {i % 3 === 0 ? `${i}:00` : ''}
            </div>
          ))}
        </div>
        
        {dayLabels.map((day, dayIndex) => (
          <div key={day} className="flex items-center">
            <div className="w-12 pr-2 text-xs font-medium">{day}</div>
            <div className="flex flex-1">
              {Array.from({ length: 24 }).map((_, hour) => {
                const cellData = heatmapData.find(d => d.day === dayIndex && d.hour === hour);
                const count = cellData ? cellData.count : 0;
                
                return (
                  <div 
                    key={hour} 
                    className="flex-1 aspect-square m-0.5 rounded"
                    style={{ backgroundColor: getColor(count) }}
                    title={`${day} ${hour}:00 - ${count} activities`}
                  >
                    <div className="w-full h-full relative group">
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 transition-opacity">
                        {count}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="mt-4 flex items-center">
          <div className="w-12 text-xs text-muted-foreground">Intensity:</div>
          <div className="flex-1 flex">
            <div className="h-2 flex-1 bg-gradient-to-r from-blue-100 to-blue-500"></div>
          </div>
          <div className="ml-2 text-xs text-muted-foreground">Higher</div>
        </div>
      </div>
    </div>
  );
};

export default UserActivityHeatmap;
