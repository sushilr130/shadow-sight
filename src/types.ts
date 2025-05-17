
export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface ProcessedActivity {
  activityId: string;
  user: string;
  date: string;
  time: string;
  riskScore: number;
  integration: string;
  policiesBreached: Record<string, string[]>;
  values: Record<string, any>;
  status: string;
  managerAction: string;
  parsedDate: Date | null;
  weekEnding: string;
  emailDomain?: string;

  // Boolean flags
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
}

export interface ActivityTypeData {
  name: string;
  count: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface RiskScoreDistribution {
  name: string;
  min: number;
  max: number;
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

export interface UserActivity {
  user: string;
  count: number;
}

export interface EmailDomainData {
  domain: string;
  count: number;
}

export interface TimeActivityData {
  hour: string;
  count: number;
}

export interface ActivityByDate {
  date: string;
  email: number;
  usb: number;
  cloud: number;
}

export interface ManagerActionData {
  action: string;
  count: number;
}

export interface SensitiveDataCount {
  dataType: string;
  count: number;
}

export interface FileTypeData {
  fileType: string;
  count: number;
}