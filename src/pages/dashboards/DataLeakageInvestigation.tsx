
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/hooks/useData';
import DataLeakageByUserChart from '@/components/charts/DataLeakageByUserChart';
import DataLeakageOverTimeChart from '@/components/charts/DataLeakageOverTimeChart';
import { AlertOctagon, ExternalLink, UserX } from 'lucide-react';

const DataLeakageInvestigationContent = () => {
  const { filteredData } = useData();
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Data Leakage Incidents</CardTitle>
              <AlertOctagon className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {filteredData.filter(d => d.dataLeakage).length}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Total data leakage incidents detected
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>External Domain Sharing</CardTitle>
              <ExternalLink className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {filteredData.filter(d => d.dataLeakage && d.externalDomain).length}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Data shared with external domains
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Users with Leakages</CardTitle>
              <UserX className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {new Set(filteredData.filter(d => d.dataLeakage).map(d => d.user)).size}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Unique users with data leakage incidents
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Data Leakage Over Time</CardTitle>
          <CardDescription>Trend of data leakage incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <DataLeakageOverTimeChart />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Users with Data Leakage</CardTitle>
          <CardDescription>Users with the highest number of data leakage incidents</CardDescription>
        </CardHeader>
        <CardContent>
          <DataLeakageByUserChart />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Data Leakage Channels</CardTitle>
          <CardDescription>Distribution of data leakage incidents by channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-4">Email Data Leakage</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Incidents</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.email).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Personal Email Addresses</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.email && d.personalEmailAddress).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Confidential Data</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.email && d.confidentialData).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">PII Data</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.email && d.pii).length}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-4">USB Data Leakage</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Incidents</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.usb).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Large Exports</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.usb && d.largeExport).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Confidential Data</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.usb && d.confidentialData).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">PII Data</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.usb && d.pii).length}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-4">Cloud Data Leakage</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Incidents</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.cloud).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">External Sharing</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.cloud && d.externalDomain).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Confidential Data</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.cloud && d.confidentialData).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">PII Data</span>
                  <span className="font-medium">{filteredData.filter(d => d.dataLeakage && d.cloud && d.pii).length}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DataLeakageInvestigation = () => {
  return (
    <DashboardTemplate title="Data Leakage Investigation">
      <DataLeakageInvestigationContent />
    </DashboardTemplate>
  );
};

export default DataLeakageInvestigation;
