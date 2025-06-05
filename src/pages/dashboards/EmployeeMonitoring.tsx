
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useData } from '@/hooks/useData';
import MonitoringDataByMonthChart from '@/components/charts/MonitoringDataByMonthChart';
import { UserCog, TrendingUp, AlertTriangle } from 'lucide-react';

const EmployeeMonitoringContent = () => {
  const { filteredData } = useData();
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Enhanced Monitoring</CardTitle>
              <UserCog className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {filteredData.filter(d => d.enhancedMonitoring).length}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Users with enhanced monitoring
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Performance Plans</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {filteredData.filter(d => d.performanceImprovementPlan).length}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Performance improvement plans initiated
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>At-Risk Users</CardTitle>
              <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {new Set(filteredData.filter(d => d.userAtRisk).map(d => d.user)).size}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Unique users flagged as at-risk
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Monitoring Breach by Month</CardTitle>
          <CardDescription>Trend of monitoring breaches over time</CardDescription>
        </CardHeader>
        <CardContent>
          <MonitoringDataByMonthChart />
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Users with Performance Improvement Plans</CardTitle>
          <CardDescription>Details of users currently on performance improvement plans</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.filter(d => d.performanceImprovementPlan).length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No users on performance improvement plans in the selected period
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Risk Score</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Risk Level</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Data Leakage</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Enhanced Monitoring</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Array.from(new Set(filteredData.filter(d => d.performanceImprovementPlan).map(d => d.user))).map((user, index) => {
                    const userActivities = filteredData.filter(d => d.user === user);
                    const avgRiskScore = Math.round(userActivities.reduce((sum, d) => sum + d.riskScore, 0) / userActivities.length);
                    const riskLevel = avgRiskScore <= 500 ? 'Low' : 
                                     avgRiskScore <= 1000 ? 'Moderate' : 
                                     avgRiskScore <= 1500 ? 'High' : 
                                     avgRiskScore <= 2000 ? 'Very High' : 'Critical';
                    const riskColorClass = riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                                          riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                                          riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                                          'bg-red-100 text-red-800';
                    
                    return (
                      <tr key={index}>
                        <td className="px-4 py-4">
                          <div className="font-medium">{user.split('@')[0]}</div>
                          <div className="text-xs text-muted-foreground">{user}</div>
                        </td>
                        <td className="px-4 py-4 text-center">{avgRiskScore}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${riskColorClass}`}>
                            {riskLevel}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">{userActivities.filter(d => d.dataLeakage).length}</td>
                        <td className="px-4 py-4 text-center">{userActivities.filter(d => d.enhancedMonitoring).length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const EmployeeMonitoring = () => {
  return (
    <DashboardTemplate title="Employee Monitoring">
      <EmployeeMonitoringContent />
    </DashboardTemplate>
  );
};

export default EmployeeMonitoring;
