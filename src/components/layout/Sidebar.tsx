import React, { useState } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Clock, 
  Lock, 
  Mail, 
  File, 
  Shield, 
  UserCog, 
  ArrowLeftCircle,
  ArrowRightCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const chartItems: SidebarItem[] = [
  { id: 'email-domains', name: 'Email Domains', icon: <BarChart3 size={18} /> },
  { id: 'integration-activity', name: 'Integration Activity', icon: <LineChart size={18} /> },
  { id: 'manager-actions', name: 'Manager Actions', icon: <PieChart size={18} /> },
  { id: 'data-sensitivity', name: 'Data Sensitivity', icon: <Lock size={18} /> },
  { id: 'email-sensitivity', name: 'Email Sensitivity', icon: <Mail size={18} /> },
  { id: 'usb-sensitivity', name: 'USB Sensitivity', icon: <Lock size={18} /> },
  { id: 'cloud-sensitivity', name: 'Cloud Sensitivity', icon: <Lock size={18} /> },
  { id: 'file-types', name: 'File Types', icon: <File size={18} /> },
  { id: 'compliance-data', name: 'Compliance Data', icon: <Shield size={18} /> },
  { id: 'personal-email', name: 'Personal Email Files', icon: <Mail size={18} /> },
  { id: 'data-leakage-trend', name: 'Data Leakage Trend', icon: <LineChart size={18} /> },
  { id: 'data-leakage-months', name: 'Data Leakage By Month', icon: <BarChart3 size={18} /> },
  { id: 'email-monitoring', name: 'Email Monitoring', icon: <Mail size={18} /> },
  { id: 'risk-distribution', name: 'Risk Distribution', icon: <BarChart3 size={18} /> },
  { id: 'time-of-day', name: 'Time of Day', icon: <Clock size={18} /> },
  { id: 'data-leakage-users', name: 'Data Leakage By User', icon: <UserCog size={18} /> },
  { id: 'high-risk-employee', name: 'High Risk Employees', icon: <UserCog size={18} /> },
];

interface SidebarProps {
  onSelectChart: (chartId: string) => void;
  selectedChart: string;
}

export const Sidebar = ({ onSelectChart, selectedChart }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div 
      className={cn(
        "h-screen bg-background border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!collapsed && (
          <h2 className="font-medium text-sm">Chart Selection</h2>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full hover:bg-muted transition-colors"
        >
          {collapsed ? <ArrowRightCircle size={20} /> : <ArrowLeftCircle size={20} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        {chartItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectChart(item.id)}
            className={cn(
              "w-full flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors",
              selectedChart === item.id ? "bg-primary/10 text-primary font-medium" : "text-foreground",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="ml-3 truncate">{item.name}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;