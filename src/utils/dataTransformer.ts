import {
  ActivityTypeData,
  ChartData,
  EmailDomainData,
  FileTypeData,
  ManagerActionData,
  ProcessedActivity,
  RiskScoreDistribution,
  SensitiveDataCount,
  TimeActivityData,
  UserActivity,
  UserRiskData,
  ViolationCount,
} from '@/types';
import { toCamelCase } from './camelcase';

export const calculateDateRange = (data: ProcessedActivity[]): [Date, Date] => {
  const dates = data
    .filter(
      (activity) =>
        activity.parsedDate instanceof Date &&
        !isNaN(activity.parsedDate.getTime())
    )
    .map((activity) => activity.parsedDate as Date);

  if (dates.length === 0) {
    // Default to last 30 days if no valid dates
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return [start, end];
  }

  return [
    new Date(Math.min(...dates.map((d) => d.getTime()))),
    new Date(Math.max(...dates.map((d) => d.getTime()))),
  ];
};

export const filterDataByDateRange = (
  data: ProcessedActivity[],
  from: Date | undefined,
  to: Date | undefined
): ProcessedActivity[] => {
  if (!from && !to) return data;

  return data.filter((activity) => {
    if (!activity.parsedDate) return false;

    if (from && to) {
      // Set end of day for "to" date
      const toEndOfDay = new Date(to);
      toEndOfDay.setHours(23, 59, 59, 999);
      return activity.parsedDate >= from && activity.parsedDate <= toEndOfDay;
    }

    if (from && !to) {
      return activity.parsedDate >= from;
    }

    if (!from && to) {
      // Set end of day for "to" date
      const toEndOfDay = new Date(to);
      toEndOfDay.setHours(23, 59, 59, 999);
      return activity.parsedDate <= toEndOfDay;
    }

    return true;
  });
};

export const getActivityTypeDistribution = (
  data: ProcessedActivity[]
): ActivityTypeData[] => {
  const counts = {
    Email: 0,
    USB: 0,
    Cloud: 0,
    Application: 0,
  };

  data.forEach((activity) => {
    console.log('ACTVE', activity);
    if (activity.email) counts.Email++;
    if (activity.usb) counts.USB++;
    if (activity.cloud) counts.Cloud++;
    if (activity.application) counts.Application++;
  });

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
};

export const getRiskScoreDistribution = (
  data: ProcessedActivity[]
): RiskScoreDistribution[] => {
  const riskBands = [
    { name: 'Low (0-500)', min: 0, max: 500, count: 0 },
    { name: 'Moderate (501-1000)', min: 501, max: 1000, count: 0 },
    { name: 'High (1001-1500)', min: 1001, max: 1500, count: 0 },
    { name: 'Very High (1501-2000)', min: 1501, max: 2000, count: 0 },
    { name: 'Critical (2001+)', min: 2001, max: Infinity, count: 0 },
  ];

  data.forEach((activity) => {
    const score = activity.riskScore;
    const band = riskBands.find(
      (band) => score >= band.min && score <= band.max
    );
    if (band) band.count++;
  });

  return riskBands;
};

export const getTopUsers = (data: ProcessedActivity[]): UserRiskData[] => {
  const userMap = new Map<
    string,
    {
      activities: number;
      totalRiskScore: number;
      highRiskActivities: number;
    }
  >();

  data.forEach((activity) => {
    const userData = userMap.get(activity.user) || {
      activities: 0,
      totalRiskScore: 0,
      highRiskActivities: 0,
    };
    userData.activities += 1;
    userData.totalRiskScore += activity.riskScore;
    if (activity.riskScore > 1500) userData.highRiskActivities += 1;
    userMap.set(activity.user, userData);
  });

  return Array.from(userMap.entries())
    .map(([user, { activities, totalRiskScore, highRiskActivities }]) => ({
      user,
      activities,
      averageRiskScore: Math.round(totalRiskScore / activities),
      highRiskActivities,
    }))
    .sort((a, b) => b.averageRiskScore - a.averageRiskScore)
    .slice(0, 10);
};

export const getTopPolicyViolations = (
  data: ProcessedActivity[]
): ViolationCount[] => {
  const violations = {
    'Data Leakage': 0,
    'Confidential Data': 0,
    'External Domain': 0,
    'Internal Data': 0,
    'Financial Data': 0,
    Documents: 0,
    PHI: 0,
    PII: 0,
    PDF: 0,
    Spreadsheets: 0,
  };

  data.forEach((activity) => {
    if (activity.dataLeakage) violations['Data Leakage']++;
    if (activity.confidentialData) violations['Confidential Data']++;
    if (activity.externalDomain) violations['External Domain']++;
    if (activity.internalData) violations['Internal Data']++;
    if (activity.financialData) violations['Financial Data']++;
    if (activity.documents) violations['Documents']++;
    if (activity.phi) violations['PHI']++;
    if (activity.pii) violations['PII']++;
    if (activity.pdf) violations['PDF']++;
    if (activity.spreadsheets) violations['Spreadsheets']++;
  });

  return Object.entries(violations)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

export const getActivityByDay = (data: ProcessedActivity[]): ChartData[] => {
  const activityByDay = new Map<string, number>();

  data.forEach((activity) => {
    if (!activity.parsedDate) return;

    const dateStr = activity.parsedDate.toISOString().split('T')[0];
    activityByDay.set(dateStr, (activityByDay.get(dateStr) || 0) + 1);
  });

  return Array.from(activityByDay.entries())
    .map(([date, count]) => ({ name: date, value: count }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getAverageRiskScore = (data: ProcessedActivity[]): number => {
  if (data.length === 0) return 0;
  const total = data.reduce((sum, activity) => sum + activity.riskScore, 0);
  return Math.round(total / data.length);
};

export const getHighRiskCount = (data: ProcessedActivity[]): number => {
  return data.filter((activity) => activity.riskScore > 1500).length;
};

// New transformers for the new charts

export const getEmailDomainDistribution = (
  data: ProcessedActivity[]
): EmailDomainData[] => {
  const domainCounts = new Map<string, number>();

  data.forEach((activity) => {
    if (activity.emailDomain) {
      domainCounts.set(
        activity.emailDomain,
        (domainCounts.get(activity.emailDomain) || 0) + 1
      );
    }
  });

  return Array.from(domainCounts.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count);
};

export const getActivityByHour = (
  data: ProcessedActivity[]
): TimeActivityData[] => {
  const hourCounts = Array(24)
    .fill(0)
    .map((_, hour) => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      count: 0,
    }));

  data.forEach((activity) => {
    if (!activity.time) return;

    const hourMatch = activity.time.match(/^(\d{1,2}):/);
    if (hourMatch) {
      const hour = parseInt(hourMatch[1], 10);
      if (!isNaN(hour) && hour >= 0 && hour < 24) {
        hourCounts[hour].count += 1;
      }
    }
  });

  return hourCounts;
};

export const getActivityByMonth = (data: ProcessedActivity[]): ChartData[] => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthCounts = monthNames.map((name) => ({ name, value: 0 }));

  data.forEach((activity) => {
    if (!activity.parsedDate) return;

    const month = activity.parsedDate.getMonth();
    if (month >= 0 && month < 12) {
      monthCounts[month].value += 1;
    }
  });

  return monthCounts;
};

export const getActivityTypeByMonth = (data: ProcessedActivity[]) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const result = months.map((month) => ({
    name: month,
    email: 0,
    usb: 0,
    cloud: 0,
  }));

  data.forEach((activity) => {
    if (!activity.parsedDate) return;

    const month = activity.parsedDate.getMonth();
    if (month >= 0 && month < 12) {
      if (activity.email) result[month].email += 1;
      if (activity.usb) result[month].usb += 1;
      if (activity.cloud) result[month].cloud += 1;
    }
  });

  return result;
};

export const getManagerActions = (
  data: ProcessedActivity[]
): ManagerActionData[] => {
  const actionCounts = {
    Escalated: 0,
    'Employee Counselled': 0,
    'Known Good Activity': 0,
    'No Action': 0,
  };

  data.forEach((activity) => {
    const action = activity.managerAction?.trim();

    // convert all actions to camel case and compare them with camel case terms
    /**
     *
     * User behaviour addressed
     * Isolated event
     * Authorised activity
     * Escalated for investigation
     *
     */
    const escalated = ['escalated', 'escalatedForInvestigation'];
    const counselled = ['employeeCounselled', 'userBehaviourAddressed'];
    const knownGood = ['knownGoodActivity', 'authorisedActivity'];

    console.log('action', action, toCamelCase(action));

    if (escalated.includes(toCamelCase(action))) actionCounts['Escalated']++;
    else if (counselled.includes(toCamelCase(action)))
      actionCounts['Employee Counselled']++;
    else if (knownGood.includes(toCamelCase(action)))
      actionCounts['Known Good Activity']++;
    else actionCounts['No Action']++;
  });

  return Object.entries(actionCounts)
    .map(([action, count]) => ({ action, count }))
    .filter((item) => item.count > 0);
};

export const getSensitiveDataCounts = (
  data: ProcessedActivity[]
): SensitiveDataCount[] => {
  return [
    { dataType: 'PCI', count: data.filter((d) => d.pci).length },
    { dataType: 'PHI', count: data.filter((d) => d.phi).length },
    { dataType: 'PII', count: data.filter((d) => d.pii).length },
  ];
};

export const getFileTypeCounts = (
  data: ProcessedActivity[]
): FileTypeData[] => {
  return [
    { fileType: 'Documents', count: data.filter((d) => d.documents).length },
    {
      fileType: 'Presentations',
      count: data.filter((d) => d.presentation).length,
    },
    {
      fileType: 'Spreadsheets',
      count: data.filter((d) => d.spreadsheets).length,
    },
    { fileType: 'ZIP Files', count: data.filter((d) => d.zipFiles).length },
  ];
};

export const getDataClassificationByChannel = (
  data: ProcessedActivity[],
  channel: 'email' | 'usb' | 'cloud'
) => {
  return [
    {
      name: 'Internal Data',
      count: data.filter((d) => d[channel] && d.internalData).length,
    },
    {
      name: 'Restricted Data',
      count: data.filter((d) => d[channel] && d.restrictedData).length,
    },
    {
      name: 'Confidential Data',
      count: data.filter((d) => d[channel] && d.confidentialData).length,
    },
  ];
};

export const getTopUsersWithDataLeakage = (
  data: ProcessedActivity[]
): UserActivity[] => {
  const userMap = new Map<string, number>();

  data.forEach((activity) => {
    if (activity.dataLeakage) {
      userMap.set(activity.user, (userMap.get(activity.user) || 0) + 1);
    }
  });

  return Array.from(userMap.entries())
    .map(([user, count]) => ({ user, count }))
    .filter((user) => user.count > 10)
    .sort((a, b) => b.count - a.count)
    .slice(0, 25);
};

export const getDataLeakageOverTime = (data: ProcessedActivity[]) => {
  const dateMap = new Map<string, number>();

  data.forEach((activity) => {
    if (!activity.parsedDate || !activity.dataLeakage) return;

    const dateStr = activity.parsedDate.toISOString().split('T')[0];
    dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
  });

  return Array.from(dateMap.entries())
    .map(([date, count]) => ({
      name: date,
      count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getMonitoringDataByMonth = (data: ProcessedActivity[]) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const result = months.map((month) => ({
    name: month,
    enhancedMonitoring: 0,
    performanceImprovementPlan: 0,
    productivityMonitored: 0,
  }));

  data.forEach((activity) => {
    if (!activity.parsedDate) return;

    const month = activity.parsedDate.getMonth();
    if (month >= 0 && month < 12) {
      if (activity.enhancedMonitoring) result[month].enhancedMonitoring += 1;
      if (activity.performanceImprovementPlan)
        result[month].performanceImprovementPlan += 1;
      if (activity.productivityMonitored)
        result[month].productivityMonitored += 1;
    }
  });

  return result;
};

export const getEmailEnhancedMonitoringByMonth = (
  data: ProcessedActivity[]
) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const result = months.map((month) => ({
    name: month,
    count: 0,
  }));

  data.forEach((activity) => {
    if (!activity.parsedDate || !activity.emailEnhancedMonitoring) return;

    const month = activity.parsedDate.getMonth();
    if (month >= 0 && month < 12) {
      result[month].count += 1;
    }
  });

  return result;
};
