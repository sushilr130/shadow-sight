
import { ProcessedActivity, UserActivity } from '@/types';
import Papa from 'papaparse';

export const parseCSV = (file: File): Promise<ProcessedActivity[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          const data = results.data as any[];
          
          // Check if this is a raw or processed CSV
          const isProcessed = data.length > 0 && 'Email' in (data[0] || {});
          
          if (isProcessed) {
            const processedData = data.map(transformProcessedRow).filter(Boolean);
            resolve(processedData as ProcessedActivity[]);
          } else {
            const parsedData = data.map(transformRawRow).filter(Boolean);
            resolve(parsedData as ProcessedActivity[]);
          }
        } catch (error) {
          console.error('Error parsing CSV:', error);
          reject(new Error('Failed to parse CSV file'));
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        reject(error);
      }
    });
  });
};

const transformRawRow = (row: any): ProcessedActivity | null => {
  try {
    if (!row.activityId || !row.user) return null;
    
    // Parse JSON fields if they're strings
    let policiesBreached: Record<string, string[]> = {};
    let values: Record<string, any> = {};
    
    if (typeof row.policiesBreached === 'string') {
      try {
        policiesBreached = JSON.parse(row.policiesBreached);
      } catch (e) {
        policiesBreached = {};
      }
    } else if (row.policiesBreached && typeof row.policiesBreached === 'object') {
      policiesBreached = row.policiesBreached;
    }
    
    if (typeof row.values === 'string') {
      try {
        values = JSON.parse(row.values);
      } catch (e) {
        values = {};
      }
    } else if (row.values && typeof row.values === 'object') {
      values = row.values;
    }
    
    // Parse date in format DD/MM/YYYY
    const [day, month, year] = (row.date || '').split('/');
    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
    
    // Calculate week ending (Saturday)
    const dateCopy = new Date(parsedDate);
    const dayOfWeek = dateCopy.getDay(); // 0 is Sunday, 6 is Saturday
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    dateCopy.setDate(dateCopy.getDate() + daysUntilSaturday);
    const weekEnding = `${dateCopy.getDate().toString().padStart(2, '0')}/${(dateCopy.getMonth() + 1).toString().padStart(2, '0')}/${dateCopy.getFullYear()}`;
    
    // Extract email domain if available
    let emailDomain = undefined;
    if (values.destinations && Array.isArray(values.destinations) && values.destinations.length > 0) {
      const emailMatch = values.destinations[0].match(/@([^@]+)$/);
      if (emailMatch && emailMatch[1]) {
        emailDomain = emailMatch[1];
      }
    }
    
    // Create a processed activity
    const activity: ProcessedActivity = {
      activityId: row.activityId,
      user: row.user,
      date: row.date,
      time: row.time,
      riskScore: parseInt(row.riskScore) || 0,
      integration: row.integration,
      policiesBreached,
      values,
      status: row.status,
      managerAction: row.managerAction,
      parsedDate,
      weekEnding,
      emailDomain,
      
      // Default all boolean flags to false
      email: row.integration === 'si-email',
      usb: row.integration === 'si-usb',
      application: row.integration === 'si-application',
      cloud: row.integration === 'si-cloud',
      bankAccountNumbers: false,
      confidentialData: false,
      creditCardNumbers: false,
      dataLeakage: false,
      documents: false,
      emailEnhancedMonitoring: false,
      externalDomain: false,
      personalEmailAddress: false,
      enhancedMonitoring: false,
      financialData: false,
      fraudIndicators: false,
      internalData: false,
      largeExport: false,
      pci: false,
      pdf: false,
      performanceImprovementPlan: false,
      phi: false,
      pii: false,
      presentation: false,
      productivityMonitored: false,
      restrictedData: false,
      sensitive: false,
      spreadsheets: false,
      userAtRisk: false,
      zipFiles: false,
    };
    
    // Set boolean flags based on policies breached
    if (policiesBreached && typeof policiesBreached === 'object') {
      Object.entries(policiesBreached).forEach(([category, violations]) => {
        if (Array.isArray(violations)) {
          violations.forEach((violation: string) => {
            if (violation.includes('BankAccountNumbers')) activity.bankAccountNumbers = true;
            if (violation.includes('ConfidentialData')) activity.confidentialData = true;
            if (violation.includes('CreditCardNumbers')) activity.creditCardNumbers = true;
            if (category === 'dataLeakage' || violation.includes('ContainedDocuments')) activity.dataLeakage = true;
            if (violation.includes('Documents')) activity.documents = true;
            if (violation.includes('EmailEnhancedMonitoring')) activity.emailEnhancedMonitoring = true;
            if (violation.includes('SentToExternalDomain')) activity.externalDomain = true;
            if (violation.includes('PersonalEmailAddress')) activity.personalEmailAddress = true;
            if (violation.includes('EnhancedMonitoring')) activity.enhancedMonitoring = true;
            if (violation.includes('FinancialData')) activity.financialData = true;
            if (violation.includes('FraudIndicators')) activity.fraudIndicators = true;
            if (violation.includes('InternalData')) activity.internalData = true;
            if (violation.includes('LargeExport')) activity.largeExport = true;
            if (category === 'pci' || violation.includes('PCI')) activity.pci = true;
            if (violation.includes('PDF')) activity.pdf = true;
            if (violation.includes('PerformanceImprovementPlan')) activity.performanceImprovementPlan = true;
            if (category === 'phi' || violation.includes('PHI')) activity.phi = true;
            if (category === 'pii' || violation.includes('PII')) activity.pii = true;
            if (violation.includes('Presentation')) activity.presentation = true;
            if (violation.includes('ProductivityMonitored')) activity.productivityMonitored = true;
            if (violation.includes('RestrictedData')) activity.restrictedData = true;
            if (category === 'sensitive' || violation.includes('Sensitive')) activity.sensitive = true;
            if (violation.includes('Spreadsheets')) activity.spreadsheets = true;
            if (category === 'userAtRisk' || violation.includes('UserAtRisk')) activity.userAtRisk = true;
            if (violation.includes('ZipFiles')) activity.zipFiles = true;
          });
        }
      });
    }
    
    return activity;
  } catch (error) {
    console.error('Error transforming row:', error, row);
    return null;
  }
};

const transformProcessedRow = (row: any): ProcessedActivity | null => {
  try {
    if (!row['Activity Id'] || !row['User Name']) return null;
    
    // Parse date in format DD/MM/YYYY
    const [day, month, year] = (row['Date'] || '').split('/');
    const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
    
    // Parse any JSON fields
    let policiesBreached = {};
    let values = {};
    
    try {
      if (row['Policy Violations']) {
        policiesBreached = JSON.parse(row['Policy Violations']);
      }
    } catch (e) {}
    
    try {
      if (row['Values']) {
        values = JSON.parse(row['Values']);
      }
    } catch (e) {}
    
    // Create a processed activity
    const activity: ProcessedActivity = {
      activityId: row['Activity Id'],
      user: row['User Name'],
      date: row['Date'],
      time: row['Time'],
      riskScore: parseInt(row['Risk Score']) || 0,
      integration: row['Integration'],
      policiesBreached,
      values,
      status: row['Alert Status'] || '',
      managerAction: row['Manager Action'] || '',
      parsedDate,
      weekEnding: row['Week Ending'] || '',
      emailDomain: row['Email Domain'],
      
      // Boolean flags
      email: !!row['Email'],
      usb: !!row['USB'],
      application: !!row['Application'],
      cloud: !!row['Cloud'],
      bankAccountNumbers: !!row['Bank Account Numbers'],
      confidentialData: !!row['Confidential Data'],
      creditCardNumbers: !!row['Credit Card Numbers'],
      dataLeakage: !!row['Data Leakage'],
      documents: !!row['Documents'],
      emailEnhancedMonitoring: !!row['Email Enhanced Monitoring'],
      externalDomain: !!row['External Domain'],
      personalEmailAddress: !!row['Personal Email Address'],
      enhancedMonitoring: !!row['Enhanced Monitoring'],
      financialData: !!row['Financial Data'],
      fraudIndicators: !!row['Fraud Indicators'],
      internalData: !!row['Internal Data'],
      largeExport: !!row['Large Export'],
      pci: !!row['PCI'],
      pdf: !!row['PDF'],
      performanceImprovementPlan: !!row['Performance Improvement Plan'],
      phi: !!row['PHI'],
      pii: !!row['PII'],
      presentation: !!row['Presentation'],
      productivityMonitored: !!row['Productivity Monitored'],
      restrictedData: !!row['Restricted Data'],
      sensitive: !!row['Sensitive'],
      spreadsheets: !!row['Spreadsheets'],
      userAtRisk: !!row['User At Risk'],
      zipFiles: !!row['Zip Files'],
    };
    
    return activity;
  } catch (error) {
    console.error('Error transforming processed row:', error, row);
    return null;
  }
};

