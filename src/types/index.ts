
export interface UserActivity {
  activityId: string;
  user: string;
  date: string;
  time: string;
  riskScore: number;
  integration: string;
  policiesBreached: Record<string, string[]>;
  values: Record<string, string | string[]>;
  status: string;
  managerAction?: string;
  parsedDate?: Date;
}

export interface ProcessedActivity extends UserActivity {
  emailDomain?: string;
  email: boolean;
  usb: boolean;
  application: boolean;
  cloud: boolean;
  bankAccountNumbers: boolean;
  confidentialData: boolean;
  creditCardNumbers: boolean;
  dataLeakage: boolean;
  documents: boolean;
  emailEnhancedMonitoring: boolean;
  externalDomain: boolean;
  personalEmailAddress: boolean;
  enhancedMonitoring: boolean;
  financialData: boolean;
  fraudIndicators: boolean;
  internalData: boolean;
  largeExport: boolean;
  pci: boolean;
  pdf: boolean;
  performanceImprovementPlan: boolean;
  phi: boolean;
  pii: boolean;
  presentation: boolean;
  productivityMonitored: boolean;
  restrictedData: boolean;
  sensitive: boolean;
  spreadsheets: boolean;
  userAtRisk: boolean;
  zipFiles: boolean;
  weekEnding: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface ActivityTypeData {
  name: string;
  count: number;
}

export interface RiskScoreDistribution {
  name: string;
  count: number;
}

export interface UserRiskData {
  user: string;
  activities: number;
  averageRiskScore: number;
  highRiskActivities: number;
}

export interface ViolationCount {
  name: string;
  count: number;
}