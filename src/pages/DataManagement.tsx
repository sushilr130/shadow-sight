
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataManagementSection from '@/components/dashboard/DataManagementSection';

const DataManagement = () => {
  return (
    <DashboardTemplate title="Data Management">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manage Your Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Upload, manage, and refresh your activity data. All data is stored securely in your browser's local storage.
          </p>
          
          <DataManagementSection />
        </CardContent>
      </Card>
    </DashboardTemplate>
  );
};

export default DataManagement;
