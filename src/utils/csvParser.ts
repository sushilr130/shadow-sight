
import { ProcessedActivity } from '@/types';
import Papa from 'papaparse';
import { toast } from 'sonner';

export const parseCSV = (file: File): Promise<ProcessedActivity[]> => {
  return new Promise((resolve, reject) => {
    console.log(`Starting to upload file: ${file.name} (${file.size} bytes, type: ${file.type})`);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        try {
          console.log('Starting to parse CSV file:', file.name);
          const data = results.data as any[];
          
          if (!data || data.length === 0 || !Object.keys(data[0] || {}).length) {
            console.error('Empty or invalid CSV file format');
            resolve([]);
            return;
          }
          
          // Check if this is a raw or processed CSV
          const isProcessed = data.length > 0 && 'Email' in (data[0] || {});
          
          console.log('Raw parsed CSV data:', data[0]);
          
          if (isProcessed) {
            const processedData = data.map(transformProcessedRow).filter(Boolean);
            console.log(`Processed data count: ${processedData.length}`);
            if (processedData.length > 0) {
              console.log('Sample processed row:', processedData[0]);
            }
            resolve(processedData as ProcessedActivity[]);
          } else {
            const parsedData = data.map(transformRawRow).filter(Boolean);
            console.log(`Processed data count: ${parsedData.length}`);
            if (parsedData.length > 0) {
              console.log('Sample processed row:', parsedData[0]);
            }
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
    if (!row['Activity Id'] && !row.activityId) return null;
    
    const activityId = row['Activity Id'] || row.activityId;
    const user = row['User Name'] || row.user;
    
    if (!activityId || !user) return null;
    
    // Parse JSON fields if they're strings
    let policiesBreached: Record<string, string[]> = {};
    let values: Record<string, any> = {};
    
    const policyViolationsField = row['Policy Violations'] || row.policiesBreached;
    const valuesField = row['Values'] || row.values;
    
    if (typeof policyViolationsField === 'string') {
      try {
        policiesBreached = JSON.parse(policyViolationsField);
      } catch (e) {
        policiesBreached = {};
      }
    } else if (policyViolationsField && typeof policyViolationsField === 'object') {
      policiesBreached = policyViolationsField;
    }
    
    if (typeof valuesField === 'string') {
      try {
        values = JSON.parse(valuesField);
      } catch (e) {
        values = {};
      }
    } else if (valuesField && typeof valuesField === 'object') {
      values = valuesField;
    }
    
    // Parse date in format DD/MM/YYYY
    const dateField = row['Date'] || row.date;
    let parsedDate = null;
    
    if (dateField) {
      const [day, month, year] = dateField.split('/');
      parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
      
      // Validate parsedDate
      if (isNaN(parsedDate.getTime())) {
        parsedDate = null;
      }
    }
    
    // Calculate week ending (Saturday)
    let weekEnding = '';
    if (parsedDate) {
      const dateCopy = new Date(parsedDate);
      const dayOfWeek = dateCopy.getDay(); // 0 is Sunday, 6 is Saturday
      const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
      dateCopy.setDate(dateCopy.getDate() + daysUntilSaturday);
      weekEnding = `${dateCopy.getFullYear()}-${(dateCopy.getMonth() + 1).toString().padStart(2, '0')}-${dateCopy.getDate().toString().padStart(2, '0')}`;
    }
    
    // Extract email domain if available
    let emailDomain = undefined;
    if (values.destinations && Array.isArray(values.destinations) && values.destinations.length > 0) {
      const emailMatch = values.destinations[0].match(/@([^@]+)$/);
      if (emailMatch && emailMatch[1]) {
        emailDomain = emailMatch[1];
      }
    } else if (user) {
      const emailMatch = user.match(/@([^@]+)$/);
      if (emailMatch && emailMatch[1]) {
        emailDomain = emailMatch[1];
      }
    }
    
    const integration = row['Integration'] || row.integration;
    const riskScore = parseInt(row['Risk Score'] || row.riskScore) || 0;
    
    // Create a processed activity
    const activity: ProcessedActivity = {
      activityId,
      user,
      date: dateField || '',
      time: row['Time'] || row.time || '',
      riskScore,
      integration: integration || '',
      policiesBreached,
      values,
      status: row['Alert Status'] || row.status || '',
      managerAction: row['Manager Action'] || row.managerAction || '',
      parsedDate,
      weekEnding,
      emailDomain,
      
      // Default all boolean flags to false
      email: integration ? ['si-email', 'office-365-email'].includes(integration.toLowerCase()) : false,
      usb: integration ? ['si-usb', 'crowdstrike-usb'].includes(integration.toLowerCase()) : false,
      application: integration ? integration.toLowerCase() === 'si-application' : false,
      cloud: integration ? integration.toLowerCase() === 'si-cloud' : false,
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
    if (!row['Activity Id'] && !row['activityId']) return null;
    
    const activityId = row['Activity Id'] || row['activityId'];
    const user = row['User Name'] || row['user'];
    
    if (!activityId || !user) return null;
    
    // Parse date in format DD/MM/YYYY
    const dateField = row['Date'] || row['date'];
    let parsedDate = null;
    
    if (dateField) {
      const [day, month, year] = dateField.split('/');
      parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
      
      // Validate parsedDate
      if (isNaN(parsedDate.getTime())) {
        parsedDate = null;
      }
    }
    
    // Parse any JSON fields
    let policiesBreached = {};
    let values = {};
    
    try {
      if (row['Policy Violations']) {
        policiesBreached = JSON.parse(row['Policy Violations']);
      } else if (row['policiesBreached']) {
        policiesBreached = row['policiesBreached'];
      }
    } catch (e) {}
    
    try {
      if (row['Values']) {
        values = JSON.parse(row['Values']);
      } else if (row['values']) {
        values = row['values'];
      }
    } catch (e) {}
    
    // Create a processed activity
    const activity: ProcessedActivity = {
      activityId,
      user,
      date: dateField || '',
      time: row['Time'] || row['time'] || '',
      riskScore: parseInt(row['Risk Score'] || row['riskScore']) || 0,
      integration: row['Integration'] || row['integration'] || '',
      policiesBreached,
      values,
      status: row['Alert Status'] || row['status'] || '',
      managerAction: row['Manager Action'] || row['managerAction'] || '',
      parsedDate,
      weekEnding: row['Week Ending'] || row['weekEnding'] || '',
      emailDomain: row['Email Domain'] || row['emailDomain'],
      
      // Boolean flags
      email: !!row['Email'] || !!row['email'],
      usb: !!row['USB'] || !!row['usb'],
      application: !!row['Application'] || !!row['application'],
      cloud: !!row['Cloud'] || !!row['cloud'],
      bankAccountNumbers: !!row['Bank Account Numbers'] || !!row['bankAccountNumbers'],
      confidentialData: !!row['Confidential Data'] || !!row['confidentialData'],
      creditCardNumbers: !!row['Credit Card Numbers'] || !!row['creditCardNumbers'],
      dataLeakage: !!row['Data Leakage'] || !!row['dataLeakage'],
      documents: !!row['Documents'] || !!row['documents'],
      emailEnhancedMonitoring: !!row['Email Enhanced Monitoring'] || !!row['emailEnhancedMonitoring'],
      externalDomain: !!row['External Domain'] || !!row['externalDomain'],
      personalEmailAddress: !!row['Personal Email Address'] || !!row['personalEmailAddress'],
      enhancedMonitoring: !!row['Enhanced Monitoring'] || !!row['enhancedMonitoring'],
      financialData: !!row['Financial Data'] || !!row['financialData'],
      fraudIndicators: !!row['Fraud Indicators'] || !!row['fraudIndicators'],
      internalData: !!row['Internal Data'] || !!row['internalData'],
      largeExport: !!row['Large Export'] || !!row['largeExport'],
      pci: !!row['PCI'] || !!row['pci'],
      pdf: !!row['PDF'] || !!row['pdf'],
      performanceImprovementPlan: !!row['Performance Improvement Plan'] || !!row['performanceImprovementPlan'],
      phi: !!row['PHI'] || !!row['phi'],
      pii: !!row['PII'] || !!row['pii'],
      presentation: !!row['Presentation'] || !!row['presentation'],
      productivityMonitored: !!row['Productivity Monitored'] || !!row['productivityMonitored'],
      restrictedData: !!row['Restricted Data'] || !!row['restrictedData'],
      sensitive: !!row['Sensitive'] || !!row['sensitive'],
      spreadsheets: !!row['Spreadsheets'] || !!row['spreadsheets'],
      userAtRisk: !!row['User At Risk'] || !!row['userAtRisk'],
      zipFiles: !!row['Zip Files'] || !!row['zipFiles'],
    };
    
    return activity;
  } catch (error) {
    console.error('Error transforming processed row:', error, row);
    return null;
  }
};



