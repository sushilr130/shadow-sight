
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { useData } from '@/hooks/useData';
import { format } from 'date-fns';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// This component must be wrapped by a DataProvider
const CalendarContent = () => {
  const { filteredData } = useData();
  
  // Prepare data for monthly activity
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyActivity = months.map(month => {
    const count = filteredData.filter(d => {
      if (!d.parsedDate) return false;
      return d.parsedDate.getMonth() === months.indexOf(month);
    }).length;
    
    return {
      name: month,
      activities: count
    };
  });

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Breach Calendar</h2>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Breach Calendar</CardTitle>
          <CardDescription>Monthly Breach distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="activities" fill="#8884d8" name="Activities" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Today's Date</CardTitle>
            <CardDescription>Current calendar information</CardDescription>
          </div>
          <CalendarIcon className="h-6 w-6 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">
            {format(new Date(), 'EEEE, MMMM do, yyyy')}
          </p>
        </CardContent>
      </Card>
    </>
  );
};

// Main component that provides the DataProvider via DashboardTemplate
const Calendar = () => {
  return (
    <DashboardTemplate title="Breach Calendar">
      <CalendarContent />
    </DashboardTemplate>
  );
};

export default Calendar;
