
import { ActivityTypeData, ChartData, ProcessedActivity, RiskScoreDistribution, UserRiskData, ViolationCount } from '@/types';

export const calculateDateRange = (data: ProcessedActivity[]): [Date, Date] => {
  const dates = data
    .filter(activity => activity.parsedDate instanceof Date && !isNaN(activity.parsedDate.getTime()))
    .map(activity => activity.parsedDate as Date);
  
  if (dates.length === 0) {
    // Default to last 30 days if no valid dates
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return [start, end];
  }
  
  return [new Date(Math.min(...dates.map(d => d.getTime()))), 
          new Date(Math.max(...dates.map(d => d.getTime())))];
};

export const filterDataByDateRange = (
  data: ProcessedActivity[], 
  from: Date | undefined, 
  to: Date | undefined
): ProcessedActivity[] => {
  if (!from && !to) return data;
  
  return data.filter(activity => {
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

export const getActivityTypeDistribution = (data: ProcessedActivity[]): ActivityTypeData[] => {
  const counts = {
    Email: 0,
    USB: 0,
    Cloud: 0,
    Application: 0,
  };
  
  data.forEach(activity => {
    if (activity.email) counts.Email++;
    if (activity.usb) counts.USB++;
    if (activity.cloud) counts.Cloud++;
    if (activity.application) counts.Application++;
  });
  
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
};

export const getRiskScoreDistribution = (data: ProcessedActivity[]): RiskScoreDistribution[] => {
  const riskBands = [
    { name: "Low (0-500)", min: 0, max: 500, count: 0 },
    { name: "Moderate (501-1000)", min: 501, max: 1000, count: 0 },
    { name: "High (1001-1500)", min: 1001, max: 1500, count: 0 },
    { name: "Very High (1501-2000)", min: 1501, max: 2000, count: 0 },
    { name: "Critical (2001+)", min: 2001, max: Infinity, count: 0 },
  ];
  
  data.forEach(activity => {
    const score = activity.riskScore;
    const band = riskBands.find(band => score >= band.min && score <= band.max);
    if (band) band.count++;
  });
  
  return riskBands;
};

export const getTopUsers = (data: ProcessedActivity[]): UserRiskData[] => {
  const userMap = new Map<string, { 
    activities: number, 
    totalRiskScore: number, 
    highRiskActivities: number 
  }>();
  
  data.forEach(activity => {
    const userData = userMap.get(activity.user) || { activities: 0, totalRiskScore: 0, highRiskActivities: 0 };
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
      highRiskActivities
    }))
    .sort((a, b) => b.averageRiskScore - a.averageRiskScore)
    .slice(0, 10);
};

export const getTopPolicyViolations = (data: ProcessedActivity[]): ViolationCount[] => {
  const violations = {
    'Data Leakage': 0,
    'Confidential Data': 0,
    'External Domain': 0,
    'Internal Data': 0,
    'Financial Data': 0,
    'Documents': 0,
    'PHI': 0,
    'PII': 0,
    'PDF': 0,
    'Spreadsheets': 0,
  };
  
  data.forEach(activity => {
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
  
  data.forEach(activity => {
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
  return data.filter(activity => activity.riskScore > 1500).length;
};
