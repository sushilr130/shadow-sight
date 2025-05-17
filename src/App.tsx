
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import Calendar from "./pages/Calendar";
import DataManagement from "./pages/DataManagement";
import Settings from "./pages/Settings";
import EmailAnalytics from "./pages/dashboards/EmailAnalytics";
import UsbAnalytics from "./pages/dashboards/UsbAnalytics";
import CloudAnalytics from "./pages/dashboards/CloudAnalytics";
import DataLeakage from "./pages/dashboards/DataLeakage";
import RiskAnalysis from "./pages/dashboards/RiskAnalysis";
import UserMonitoring from "./pages/dashboards/UserMonitoring";
import ComplianceReports from "./pages/dashboards/ComplianceReports";
import EmailDomainAnalysis from "./pages/dashboards/EmailDomainAnalysis";
import ActivityTimeAnalysis from "./pages/dashboards/ActivityTimeAnalysis";
import FileAnalysis from "./pages/dashboards/FileAnalysis";
import EmployeeMonitoring from "./pages/dashboards/EmployeeMonitoring";
import DataLeakageInvestigation from "./pages/dashboards/DataLeakageInvestigation";
import ManagerActions from "./pages/dashboards/ManagerActions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/data-management" element={<DataManagement />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Main Dashboard routes */}
          <Route path="/email-analytics" element={<EmailAnalytics />} />
          <Route path="/usb-analytics" element={<UsbAnalytics />} />
          <Route path="/cloud-analytics" element={<CloudAnalytics />} />
          <Route path="/data-leakage" element={<DataLeakage />} />
          <Route path="/risk-analysis" element={<RiskAnalysis />} />
          <Route path="/user-monitoring" element={<UserMonitoring />} />
          <Route path="/compliance-reports" element={<ComplianceReports />} />
          
          {/* New Dashboard routes */}
          <Route path="/email-domain-analysis" element={<EmailDomainAnalysis />} />
          <Route path="/activity-time-analysis" element={<ActivityTimeAnalysis />} />
          <Route path="/file-analysis" element={<FileAnalysis />} />
          <Route path="/employee-monitoring" element={<EmployeeMonitoring />} />
          <Route path="/data-leakage-investigation" element={<DataLeakageInvestigation />} />
          <Route path="/manager-actions" element={<ManagerActions />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;