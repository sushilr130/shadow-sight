
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/hooks/useData';
import ManagerActionChart from '@/components/charts/ManagerActionChart';
import { UserCheck2, AlertTriangle, CheckCircle } from 'lucide-react';

const ManagerActionsContent = () => {
  const { filteredData } = useData();
  
  // Calculate statistics
  const incidents = filteredData.filter(d => d.status === 'underReview' || d.managerAction).length;
  const resolved = filteredData.filter(d => d.managerAction && d.managerAction.trim() !== '').length;
  const pendingActions = incidents - resolved;
  
  // Manager action types
  const escalated = filteredData.filter(d => d.managerAction === 'Escalated').length;
  const counselled = filteredData.filter(d => d.managerAction === 'Employee Counselled').length;
  const knownGood = filteredData.filter(d => d.managerAction === 'Known Good Activity').length;
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Incidents Requiring Action</CardTitle>
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {incidents}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Total incidents requiring manager action
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Pending Actions</CardTitle>
              <UserCheck2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {pendingActions}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Incidents awaiting manager action
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Resolution Rate</CardTitle>
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {incidents > 0 ? Math.round((resolved / incidents) * 100) : 0}%
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Percentage of incidents resolved
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Manager Action Distribution</CardTitle>
          <CardDescription>Types of actions taken by managers</CardDescription>
        </CardHeader>
        <CardContent>
          <ManagerActionChart />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Action Summary</CardTitle>
          <CardDescription>Summary of manager actions taken</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="md:flex gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-4">Actions Taken</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Escalated</span>
                    <span>{escalated}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${resolved > 0 ? (escalated / resolved) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Employee Counselled</span>
                    <span>{counselled}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${resolved > 0 ? (counselled / resolved) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Known Good Activity</span>
                    <span>{knownGood}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${resolved > 0 ? (knownGood / resolved) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 mt-6 md:mt-0">
              <h3 className="text-lg font-medium mb-4">Action by Risk Level</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left text-sm">Risk Level</th>
                      <th className="px-4 py-2 text-center text-sm">Total</th>
                      <th className="px-4 py-2 text-center text-sm">Escalated</th>
                      <th className="px-4 py-2 text-center text-sm">Counselled</th>
                      <th className="px-4 py-2 text-center text-sm">Known Good</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-2 text-sm">Critical (2000+)</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 2000).length}</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 2000 && d.managerAction === 'Escalated').length}</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 2000 && d.managerAction === 'Employee Counselled').length}</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 2000 && d.managerAction === 'Known Good Activity').length}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm">Very High (1501-2000)</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 1500 && d.riskScore <= 2000).length}</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 1500 && d.riskScore <= 2000 && d.managerAction === 'Escalated').length}</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 1500 && d.riskScore <= 2000 && d.managerAction === 'Employee Counselled').length}</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 1500 && d.riskScore <= 2000 && d.managerAction === 'Known Good Activity').length}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm">High (1001-1500)</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 1000 && d.riskScore <= 1500).length}</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 1000 && d.riskScore <= 1500 && d.managerAction === 'Escalated').length}</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 1000 && d.riskScore <= 1500 && d.managerAction === 'Employee Counselled').length}</td>
                      <td className="px-4 py-2 text-center text-sm">{filteredData.filter(d => d.riskScore > 1000 && d.riskScore <= 1500 && d.managerAction === 'Known Good Activity').length}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ManagerActions = () => {
  return (
    <DashboardTemplate title="Manager Actions">
      <ManagerActionsContent />
    </DashboardTemplate>
  );
};

export default ManagerActions;
