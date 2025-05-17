
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { useData } from '@/hooks/useData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmailDomainChart from '@/components/charts/EmailDomainChart';

const EmailDomainAnalysisContent = () => {
  const { filteredData } = useData();
  
  return (
    <div className="space-y-8">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Email Domain Distribution</CardTitle>
          <CardDescription>Distribution of activities by external email domains</CardDescription>
        </CardHeader>
        <CardContent>
          <EmailDomainChart />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>External Domains</CardTitle>
            <CardDescription>Email communication with external domains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {new Set(filteredData.filter(d => d.emailDomain).map(d => d.emailDomain)).size}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Unique external domains detected
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Personal Email Addresses</CardTitle>
            <CardDescription>Communications with personal email domains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {filteredData.filter(d => d.personalEmailAddress).length}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Activities with personal email domains
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>External Domain Risk</CardTitle>
            <CardDescription>Average risk score for external domain activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {Math.round(
                  filteredData.filter(d => d.externalDomain)
                    .reduce((sum, d) => sum + d.riskScore, 0) / 
                    Math.max(1, filteredData.filter(d => d.externalDomain).length)
                )}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Average risk score 
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EmailDomainAnalysis = () => {
  return (
    <DashboardTemplate title="Email Domain Analysis">
      <EmailDomainAnalysisContent />
    </DashboardTemplate>
  );
};

export default EmailDomainAnalysis;
