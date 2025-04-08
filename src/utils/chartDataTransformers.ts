import { ProcessedActivity } from "@/types";

// Common interface for chart data
interface ChartData {
  name: string;
  value: number;
}

// 1. Get email domain distribution
export const getEmailDomainDistribution = (data: ProcessedActivity[]) => {
  const domains = new Map<string, number>();
  
  data.forEach(activity => {
    if (activity.emailDomain) {
      domains.set(activity.emailDomain, (domains.get(activity.emailDomain) || 0) + 1);
    }
  });
  
  return Array.from(domains.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12); // Limit to top 12 domains
};

// 2. Get activity counts by integration type and date
export const getActivityByDateAndType = (data: ProcessedActivity[]) => {
  const dateMap = new Map<string, { email: number, usb: number, cloud: number }>();
  
  // Sort data by date
  const sortedData = [...data].sort((a, b) => {
    if (!a.parsedDate || !b.parsedDate) return 0;
    return a.parsedDate.getTime() - b.parsedDate.getTime();
  });
  
  // Extract unique dates in order
  const uniqueDates = Array.from(new Set(
    sortedData
      .filter(d => d.parsedDate)
      .map(d => d.date)
  ));
  
  // Initialize counts for each date
  uniqueDates.forEach(date => {
    dateMap.set(date, { email: 0, usb: 0, cloud: 0 });
  });
  
  // Count activities by type for each date
  sortedData.forEach(activity => {
    if (!activity.date) return;
    
    const counts = dateMap.get(activity.date) || { email: 0, usb: 0, cloud: 0 };
    
    if (activity.email) counts.email++;
    if (activity.usb) counts.usb++;
    if (activity.cloud) counts.cloud++;
    
    dateMap.set(activity.date, counts);
  });
  
  // Convert to array format for recharts
  return Array.from(dateMap.entries())
    .map(([date, counts]) => ({
      date,
      email: counts.email,
      usb: counts.usb,
      cloud: counts.cloud
    }));
};

// 3. Get manager action distribution
export const getManagerActionDistribution = (data: ProcessedActivity[]) => {
  const counts = {
    Escalated: 0,
    "Employee Counselled": 0,
    "Known Good Activity": 0
  };
  
  data.forEach(activity => {
    if (activity.managerAction === "Escalated") counts.Escalated++;
    else if (activity.managerAction === "Employee Counselled") counts["Employee Counselled"]++;
    else if (activity.managerAction === "Known Good Activity") counts["Known Good Activity"]++;
  });
  
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

// 4. Get data sensitivity counts
export const getDataSensitivityCounts = (data: ProcessedActivity[]) => {
  const counts = {
    "Internal Data": data.filter(d => d.internalData).length,
    "Restricted Data": data.filter(d => d.restrictedData).length,
    "Confidential Data": data.filter(d => d.confidentialData).length
  };
  
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

// 5-7. Get data sensitivity by integration type
export const getDataSensitivityByIntegration = (data: ProcessedActivity[], integrationType: "email" | "usb" | "cloud") => {
  // Filter by integration type
  const filteredData = data.filter(d => d[integrationType]);
  
  const counts = {
    "Internal Data": filteredData.filter(d => d.internalData).length,
    "Restricted Data": filteredData.filter(d => d.restrictedData).length,
    "Confidential Data": filteredData.filter(d => d.confidentialData).length
  };
  
  return {
    integration: integrationType,
    counts: Object.entries(counts).map(([name, value]) => ({ name, value }))
  };
};

// 8. Get file type counts
export const getFileTypeCounts = (data: ProcessedActivity[]) => {
  const counts = {
    "Documents": data.filter(d => d.documents).length,
    "Presentation": data.filter(d => d.presentation).length,
    "Spreadsheets": data.filter(d => d.spreadsheets).length,
    "Zip Files": data.filter(d => d.zipFiles).length,
  };
  
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

// 9. Get compliance data counts
export const getComplianceDataCounts = (data: ProcessedActivity[]) => {
  const counts = {
    "PCI": data.filter(d => d.pci).length,
    "PHI": data.filter(d => d.phi).length,
    "PII": data.filter(d => d.pii).length,
  };
  
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

// 10. Get personal email data counts
export const getPersonalEmailCounts = (data: ProcessedActivity[]) => {
  // Filter for personal email activities
  const filteredData = data.filter(d => d.personalEmailAddress);
  
  const counts = {
    "Documents": filteredData.filter(d => d.documents).length,
    "Presentation": filteredData.filter(d => d.presentation).length,
    "Spreadsheets": filteredData.filter(d => d.spreadsheets).length,
  };
  
  return {
    name: "Personal Email Address",
    counts: Object.entries(counts).map(([name, value]) => ({ name, value }))
  };
};

// 11. Get data leakage by date
export const getDataLeakageByDate = (data: ProcessedActivity[]) => {
  const leakageByDate = new Map<string, number>();
  
  // Sort data by date
  const sortedData = [...data].sort((a, b) => {
    if (!a.parsedDate || !b.parsedDate) return 0;
    return a.parsedDate.getTime() - b.parsedDate.getTime();
  });
  
  // Get unique dates
  const uniqueDates = Array.from(new Set(
    sortedData
      .filter(d => d.parsedDate)
      .map(d => d.date)
  ));
  
  // Initialize with 0 for each date
  uniqueDates.forEach(date => {
    leakageByDate.set(date, 0);
  });
  
  // Count data leakage for each date
  sortedData.forEach(activity => {
    if (activity.date && activity.dataLeakage) {
      leakageByDate.set(activity.date, (leakageByDate.get(activity.date) || 0) + 1);
    }
  });
  
  return Array.from(leakageByDate.entries())
    .map(([date, count]) => ({ date, count }));
};

// 12-13. Get data leakage and email monitoring by month
export const getActivityCountsByMonth = (data: ProcessedActivity[], propertyName: keyof ProcessedActivity) => {
  const monthCounts = {
    Jan: 0,
    Feb: 0,
    Mar: 0
  };
  
  data.forEach(activity => {
    if (!activity.parsedDate) return;
    
    const month = activity.parsedDate.getMonth();
    
    // Check if property is true
    if (activity[propertyName]) {
      if (month === 0) monthCounts.Jan++;
      else if (month === 1) monthCounts.Feb++;
      else if (month === 2) monthCounts.Mar++;
    }
  });
  
  return Object.entries(monthCounts).map(([name, value]) => ({ name, value }));
};

// 14. Get risk score distribution
export const getRiskScoreRanges = (data: ProcessedActivity[]) => {
  const ranges = [
    { name: "500-749", min: 500, max: 749, count: 0 },
    { name: "750-999", min: 750, max: 999, count: 0 },
    { name: "1000-1249", min: 1000, max: 1249, count: 0 },
    { name: "1250-1499", min: 1250, max: 1499, count: 0 },
    { name: "1500-1749", min: 1500, max: 1749, count: 0 },
    { name: "1750-1999", min: 1750, max: 1999, count: 0 },
    { name: "2000-2249", min: 2000, max: 2249, count: 0 },
    { name: "2250-2499", min: 2250, max: 2499, count: 0 },
    { name: "2500-2749", min: 2500, max: 2749, count: 0 },
    { name: "2750-2999", min: 2750, max: 2999, count: 0 }
  ];
  
  data.forEach(activity => {
    for (const range of ranges) {
      if (activity.riskScore >= range.min && activity.riskScore <= range.max) {
        range.count++;
        break;
      }
    }
  });
  
  return ranges;
};

// 15. Get activity by time of day
export const getActivityByTimeOfDay = (data: ProcessedActivity[]) => {
  const hours = [
    "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
    "06:00 PM", "07:00 PM", "08:00 PM"
  ];
  
  const hourCounts = hours.reduce((acc, hour) => {
    acc[hour] = 0;
    return acc;
  }, {} as Record<string, number>);
  
  data.forEach(activity => {
    if (!activity.time) return;
    
    // Convert 24-hour format to 12-hour format if needed
    let timeString = activity.time;
    
    // Try to match to one of our hour buckets
    const matchedHour = hours.find(hour => {
      // Extract just the hour part for comparison
      const activityHour = timeString.split(':')[0].padStart(2, '0');
      const hourPart = hour.split(':')[0].padStart(2, '0');
      
      // Check for AM/PM
      const activityIsPM = timeString.toLowerCase().includes('pm');
      const hourIsPM = hour.toLowerCase().includes('pm');
      
      // Convert to comparable values
      let actHourNum = parseInt(activityHour);
      const hourPartNum = parseInt(hourPart);
      
      // Adjust for 12-hour format
      if (activityIsPM && actHourNum !== 12) actHourNum += 12;
      if (!activityIsPM && actHourNum === 12) actHourNum = 0;
      
      // Compare the hour values
      return actHourNum === hourPartNum || Math.abs(actHourNum - hourPartNum) < 1;
    });
    
    if (matchedHour) {
      hourCounts[matchedHour]++;
    }
  });
  
  return hours.map(hour => ({
    name: hour,
    value: hourCounts[hour]
  }));
};

// 16. Get data leakage by user with count > 10
export const getDataLeakageByUser = (data: ProcessedActivity[]) => {
  const userLeakage = new Map<string, number>();
  
  // Count data leakage events by user
  data.forEach(activity => {
    if (activity.dataLeakage && activity.user) {
      userLeakage.set(activity.user, (userLeakage.get(activity.user) || 0) + 1);
    }
  });
  
  // Filter for users with count > 10 and convert to array
  return Array.from(userLeakage.entries())
    .filter(([_, count]) => count >= 10)
    .map(([user, count]) => ({ name: user, value: count }))
    .sort((a, b) => b.value - a.value);
};

// 17. Get high risk employee data by month
export const getHighRiskEmployeeDataByMonth = (data: ProcessedActivity[]) => {
  const monthlyData = [
    { month: "Jan", enhancedMonitoring: 0, performanceImprovementPlan: 0, productivityMonitored: 0 },
    { month: "Feb", enhancedMonitoring: 0, performanceImprovementPlan: 0, productivityMonitored: 0 },
    { month: "Mar", enhancedMonitoring: 0, performanceImprovementPlan: 0, productivityMonitored: 0 }
  ];
  
  data.forEach(activity => {
    if (!activity.parsedDate) return;
    
    const month = activity.parsedDate.getMonth();
    
    if (month >= 0 && month <= 2) {
      if (activity.enhancedMonitoring) monthlyData[month].enhancedMonitoring++;
      if (activity.performanceImprovementPlan) monthlyData[month].performanceImprovementPlan++;
      if (activity.productivityMonitored) monthlyData[month].productivityMonitored++;
    }
  });
  
  return monthlyData;
};