
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ActivityByTimeChart from '@/components/charts/ActivityByTimeChart';
import { ActivityTypeByMonthChart } from '@/components/charts/ActivityTypeByMonthChart';
import { useData } from '@/hooks/useData';
import { Clock, Calendar, BarChart2 } from 'lucide-react';

const ActivityTimeAnalysisContent = () => {
  const { filteredData } = useData();
  
  // Find peak activity hour
  const getActivityByHour = () => {
    const hours = Array(24).fill(0);
    filteredData.forEach(activity => {
      if (!activity.time) return;
      
      const hourMatch = activity.time.match(/^(\d{1,2}):/);
      if (hourMatch) {
        const hour = parseInt(hourMatch[1], 10);
        if (!isNaN(hour) && hour >= 0 && hour < 24) {
          hours[hour] += 1;
        }
      }
    });
    
    let maxCount = 0;
    let peakHour = 0;
    hours.forEach((count, hour) => {
      if (count > maxCount) {
        maxCount = count;
        peakHour = hour;
      }
    });
    
    return {
      peakHour,
      count: maxCount,
      formattedHour: `${peakHour.toString().padStart(2, '0')}:00`
    };
  };
  
  const peak = getActivityByHour();
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Peak Breach Hour</CardTitle>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {peak.formattedHour}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              {peak.count} breaches during this hour
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Business Hours</CardTitle>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {Math.round((filteredData.filter(d => {
                  if (!d.time) return false;
                  const hourMatch = d.time.match(/^(\d{1,2}):/);
                  if (hourMatch) {
                    const hour = parseInt(hourMatch[1], 10);
                    return hour >= 8 && hour <= 18;
                  }
                  return false;
                }).length / Math.max(1, filteredData.length)) * 100)}%
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Breaches within business hours (8:00 - 18:00)
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>After-Hours Risk</CardTitle>
              <BarChart2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {Math.round(
                  filteredData.filter(d => {
                    if (!d.time) return false;
                    const hourMatch = d.time.match(/^(\d{1,2}):/);
                    if (hourMatch) {
                      const hour = parseInt(hourMatch[1], 10);
                      return hour < 8 || hour > 18;
                    }
                    return false;
                  }).reduce((sum, d) => sum + d.riskScore, 0) / 
                  Math.max(1, filteredData.filter(d => {
                    if (!d.time) return false;
                    const hourMatch = d.time.match(/^(\d{1,2}):/);
                    if (hourMatch) {
                      const hour = parseInt(hourMatch[1], 10);
                      return hour < 8 || hour > 18;
                    }
                    return false;
                  }).length)
                )}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Average risk score for after-hours breaches
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Breach by Hour of Day</CardTitle>
          <CardDescription>Distribution of breaches across different hours of the day</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityByTimeChart />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Breach Types by Month</CardTitle>
          <CardDescription>Comparison of different breach types over months</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityTypeByMonthChart />
        </CardContent>
      </Card>
    </div>
  );
};

const ActivityTimeAnalysis = () => {
  return (
    <DashboardTemplate title="Breach Time Analysis">
      <ActivityTimeAnalysisContent />
    </DashboardTemplate>
  );
};

export default ActivityTimeAnalysis;
