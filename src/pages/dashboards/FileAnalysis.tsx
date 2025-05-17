
import DashboardTemplate from '@/components/layout/DashboardTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileTypeChart from '@/components/charts/FileTypeChart';
import SensitiveDataChart from '@/components/charts/SensitiveDataChart';
import { useData } from '@/hooks/useData';

const FileAnalysisContent = () => {
  const { filteredData } = useData();
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>File Type Distribution</CardTitle>
            <CardDescription>Distribution of activities by file types</CardDescription>
          </CardHeader>
          <CardContent>
            <FileTypeChart />
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Sensitive Data Types</CardTitle>
            <CardDescription>Distribution of sensitive data categories</CardDescription>
          </CardHeader>
          <CardContent>
            <SensitiveDataChart />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Document file transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {filteredData.filter(d => d.documents).length}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Document files transferred
            </p>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Email: {filteredData.filter(d => d.documents && d.email).length}</span>
              <span>USB: {filteredData.filter(d => d.documents && d.usb).length}</span>
              <span>Cloud: {filteredData.filter(d => d.documents && d.cloud).length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Spreadsheets</CardTitle>
            <CardDescription>Spreadsheet file transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {filteredData.filter(d => d.spreadsheets).length}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Spreadsheet files transferred
            </p>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Email: {filteredData.filter(d => d.spreadsheets && d.email).length}</span>
              <span>USB: {filteredData.filter(d => d.spreadsheets && d.usb).length}</span>
              <span>Cloud: {filteredData.filter(d => d.spreadsheets && d.cloud).length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Archive Files</CardTitle>
            <CardDescription>ZIP file transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-20">
              <div className="text-4xl font-bold">
                {filteredData.filter(d => d.zipFiles).length}
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              ZIP files transferred
            </p>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Email: {filteredData.filter(d => d.zipFiles && d.email).length}</span>
              <span>USB: {filteredData.filter(d => d.zipFiles && d.usb).length}</span>
              <span>Cloud: {filteredData.filter(d => d.zipFiles && d.cloud).length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Data Classification by File Type</CardTitle>
          <CardDescription>How data is classified across different file types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">File Type</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Total</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Internal Data</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Restricted Data</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">Confidential Data</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">PII</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">PCI</th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">PHI</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 font-medium">Documents</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.documents).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.documents && d.internalData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.documents && d.restrictedData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.documents && d.confidentialData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.documents && d.pii).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.documents && d.pci).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.documents && d.phi).length}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Presentations</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.presentation).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.presentation && d.internalData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.presentation && d.restrictedData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.presentation && d.confidentialData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.presentation && d.pii).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.presentation && d.pci).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.presentation && d.phi).length}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Spreadsheets</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.spreadsheets).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.spreadsheets && d.internalData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.spreadsheets && d.restrictedData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.spreadsheets && d.confidentialData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.spreadsheets && d.pii).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.spreadsheets && d.pci).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.spreadsheets && d.phi).length}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">ZIP Files</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.zipFiles).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.zipFiles && d.internalData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.zipFiles && d.restrictedData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.zipFiles && d.confidentialData).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.zipFiles && d.pii).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.zipFiles && d.pci).length}</td>
                  <td className="px-4 py-3 text-center">{filteredData.filter(d => d.zipFiles && d.phi).length}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FileAnalysis = () => {
  return (
    <DashboardTemplate title="File Analysis">
      <FileAnalysisContent />
    </DashboardTemplate>
  );
};

export default FileAnalysis;
