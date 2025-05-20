
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useData } from '@/hooks/useData';

// This component must be wrapped by a DataProvider
const SettingsContent = () => {
  const { clearAllData } = useData();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your data settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-medium">Clear All Data</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Remove all uploaded and stored data from the application
              </p>
              <Button variant="destructive" onClick={clearAllData}>
                Clear Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main component that provides the DataProvider via DashboardTemplate
const Settings = () => {
  return (
    <DashboardTemplate title="Settings">
      <SettingsContent />
    </DashboardTemplate>
  );
};

export default Settings;