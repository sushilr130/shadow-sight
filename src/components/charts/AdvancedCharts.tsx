import { useData } from '@/hooks/useData';
import { useMemo } from 'react';
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, LineChart, Line 
} from 'recharts';

import {
  getEmailDomainDistribution,
  getActivityByDateAndType,
  getManagerActionDistribution,
  getDataSensitivityCounts,
  getDataSensitivityByIntegration,
  getFileTypeCounts,
  getComplianceDataCounts,
  getPersonalEmailCounts,
  getDataLeakageByDate,
  getActivityCountsByMonth,
  getRiskScoreRanges,
  getActivityByTimeOfDay,
  getDataLeakageByUser,
  getHighRiskEmployeeDataByMonth
} from '@/utils/chartDataTransformers';

// Shared chart colors
const CHART_COLORS = [
  '#3b82f6', '#f97316', '#8b5cf6', '#10b981', '#ef4444', 
  '#ec4899', '#f59e0b', '#6366f1', '#0ea5e9', '#14b8a6'
];

// Reusable Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-md shadow-md border border-border/50 text-sm">
        <p className="font-medium">{label}: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const EmailDomainChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getEmailDomainDistribution(filteredData);
  }, [filteredData]);
  
  if (data.length === 0) {
    return <ChartEmptyState message="No email domain data available" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#3b82f6" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const IntegrationActivityChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getActivityByDateAndType(filteredData);
  }, [filteredData]);
  
  if (data.length === 0) {
    return <ChartEmptyState message="No integration activity data available" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }} 
          angle={-45} 
          textAnchor="end"
          height={60}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="email" stroke="#3b82f6" activeDot={{ r: 8 }} name="Email" />
        <Line type="monotone" dataKey="usb" stroke="#f97316" name="USB" />
        <Line type="monotone" dataKey="cloud" stroke="#10b981" name="Cloud" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const ManagerActionsChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getManagerActionDistribution(filteredData);
  }, [filteredData]);
  
  if (data.every(item => item.value === 0)) {
    return <ChartEmptyState message="No manager action data available" />;
  }

  const COLORS = ['#3b82f6', '#f97316', '#10b981'];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          paddingAngle={2}
          dataKey="value"
          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const DataSensitivityChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getDataSensitivityCounts(filteredData);
  }, [filteredData]);
  
  if (data.every(item => item.value === 0)) {
    return <ChartEmptyState message="No data sensitivity information available" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Create a component for integration-specific sensitivity data
export const IntegrationSensitivityChart = ({ integrationType }: { integrationType: "email" | "usb" | "cloud" }) => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getDataSensitivityByIntegration(filteredData, integrationType).counts;
  }, [filteredData, integrationType]);
  
  if (data.every(item => item.value === 0)) {
    return <ChartEmptyState message={`No ${integrationType} sensitivity data available`} />;
  }
  
  const integrationColors = {
    email: "#3b82f6",
    usb: "#f97316",
    cloud: "#10b981"
  };
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill={integrationColors[integrationType]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const FileTypesChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getFileTypeCounts(filteredData);
  }, [filteredData]);
  
  if (data.every(item => item.value === 0)) {
    return <ChartEmptyState message="No file type data available" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#3b82f6">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const ComplianceDataChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getComplianceDataCounts(filteredData);
  }, [filteredData]);
  
  if (data.every(item => item.value === 0)) {
    return <ChartEmptyState message="No compliance data available" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#3b82f6">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const PersonalEmailFilesChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getPersonalEmailCounts(filteredData).counts;
  }, [filteredData]);
  
  if (data.every(item => item.value === 0)) {
    return <ChartEmptyState message="No personal email file data available" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#f97316">
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DataLeakageTrendChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getDataLeakageByDate(filteredData);
  }, [filteredData]);
  
  if (data.length === 0) {
    return <ChartEmptyState message="No data leakage trend data available" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }} 
          angle={-45} 
          textAnchor="end"
          height={60}
        />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#ef4444" activeDot={{ r: 8 }} name="Data Leakage" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const MonthlyActivityChart = ({ 
  activityType,
  title 
}: { 
  activityType: keyof ProcessedActivity, 
  title: string 
}) => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getActivityCountsByMonth(filteredData, activityType);
  }, [filteredData, activityType]);
  
  if (data.every(item => item.value === 0)) {
    return <ChartEmptyState message={`No ${title} data available by month`} />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#3b82f6" name={title} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const RiskDistributionChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getRiskScoreRanges(filteredData);
  }, [filteredData]);
  
  if (data.every(item => item.count === 0)) {
    return <ChartEmptyState message="No risk score distribution data available" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" name="Activities" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const TimeOfDayChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getActivityByTimeOfDay(filteredData);
  }, [filteredData]);
  
  if (data.every(item => item.value === 0)) {
    return <ChartEmptyState message="No time of day activity data available" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" name="Activities" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DataLeakageByUserChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getDataLeakageByUser(filteredData);
  }, [filteredData]);
  
  if (data.length === 0) {
    return <ChartEmptyState message="No users with significant data leakage (>10)" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis 
          type="category" 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          width={140}
        />
        <Tooltip />
        <Bar dataKey="value" fill="#ef4444" name="Data Leakage Events" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const HighRiskEmployeeChart = () => {
  const { filteredData } = useData();
  
  const data = useMemo(() => {
    return getHighRiskEmployeeDataByMonth(filteredData);
  }, [filteredData]);
  
  if (data.every(item => 
    item.enhancedMonitoring === 0 && 
    item.performanceImprovementPlan === 0 && 
    item.productivityMonitored === 0
  )) {
    return <ChartEmptyState message="No high risk employee data available" />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="enhancedMonitoring" fill="#3b82f6" name="Enhanced Monitoring" />
        <Bar dataKey="performanceImprovementPlan" fill="#f97316" name="Performance Improvement Plan" />
        <Bar dataKey="productivityMonitored" fill="#10b981" name="Productivity Monitored" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Placeholder for empty charts
const ChartEmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
    <p className="text-muted-foreground mb-2">{message}</p>
    <p className="text-sm text-muted-foreground">Upload more data or adjust filters</p>
  </div>
);