import { describe, it, expect } from 'vitest';
import {
  calculateDateRange,
  filterDataByDateRange,
  getRiskScoreDistribution,
  getTopUsers,
  getTopPolicyViolations,
  getActivityByDay,
  getActivityByHour,
  getActivityByMonth,
  getActivityTypeByMonth,
  getActivityTypeDistribution,
  getAverageRiskScore,
  getDataClassificationByChannel,
  getDataLeakageOverTime,
  getEmailDomainDistribution,
  getEmailEnhancedMonitoringByMonth,
  getFileTypeCounts,
  getHighRiskCount,
  getManagerActions,
  getMonitoringDataByMonth,
  getSensitiveDataCounts,
  getTopUsersWithDataLeakage } from '../dataTransformer'; 

const createActivity = (overrides = {}) => ({
  activityId: 'A1',
  user: 'user@example.com',
  parsedDate: new Date('2024-04-01'),
  riskScore: 1000,
  pii: false,
  phi: false,
  confidentialData: false,
  dataLeakage: false,
  documents: false,
  financialData: false,
  externalDomain: false,
  internalData: false,
  pdf: false,
  spreadsheets: false,
  ...overrides,
});

describe('calculateDateRange', () => {
  it('returns range from data when dates exist', () => {
    const result = calculateDateRange([
      createActivity({ parsedDate: new Date('2024-03-01') }),
      createActivity({ parsedDate: new Date('2024-04-15') }),
    ]);
    expect(result[0]).toEqual(new Date('2024-03-01'));
    expect(result[1]).toEqual(new Date('2024-04-15'));
  });

  it('returns last 30 days when no valid dates', () => {
    const result = calculateDateRange([{ parsedDate: null }]);
    const now = new Date();
    const past = new Date();
    past.setDate(now.getDate() - 30);
    expect(result[0].getDate()).toBe(past.getDate());
    expect(result[1].getDate()).toBe(now.getDate());
  });
});

describe('filterDataByDateRange', () => {
  const data = [
    createActivity({ parsedDate: new Date('2024-03-01') }),
    createActivity({ parsedDate: new Date('2024-04-01') }),
    createActivity({ parsedDate: new Date('2024-04-15') }),
  ];

  it('filters within from/to range', () => {
    const from = new Date('2024-03-15');
    const to = new Date('2024-04-10');
    const result = filterDataByDateRange(data, from, to);
    expect(result).toHaveLength(1);
    expect(result[0].parsedDate).toEqual(new Date('2024-04-01'));
  });

  it('returns all if no from/to provided', () => {
    const result = filterDataByDateRange(data, undefined, undefined);
    expect(result).toHaveLength(3);
  });
});

describe('getRiskScoreDistribution', () => {
  it('returns counts per risk band', () => {
    const data = [
      createActivity({ riskScore: 300 }),
      createActivity({ riskScore: 800 }),
      createActivity({ riskScore: 1300 }),
      createActivity({ riskScore: 1800 }),
      createActivity({ riskScore: 2200 }),
    ];
    const result = getRiskScoreDistribution(data);
    expect(result.map(r => r.count)).toEqual([1, 1, 1, 1, 1]);
  });
});

describe('getTopUsers', () => {
  it('returns sorted user list by average risk score', () => {
    const data = [
      createActivity({ user: 'a', riskScore: 200 }),
      createActivity({ user: 'a', riskScore: 100 }),
      createActivity({ user: 'b', riskScore: 1200 }),
    ];
    const result = getTopUsers(data);
    expect(result[0].user).toBe('b');
    expect(result[1].user).toBe('a');
    expect(result[0].averageRiskScore).toBe(1200);
    expect(result[1].averageRiskScore).toBe(150);
  });
});

describe('getTopPolicyViolations', () => {
  it('counts violations correctly', () => {
    const data = [
      createActivity({ pii: true, pdf: true }),
      createActivity({ pii: true, confidentialData: true }),
      createActivity({ dataLeakage: true }),
    ];
    const result = getTopPolicyViolations(data);
    const pii = result.find(r => r.name === 'PII');
    const pdf = result.find(r => r.name === 'PDF');
    const confidential = result.find(r => r.name === 'Confidential Data');

    expect(pii?.count).toBe(2);
    expect(pdf?.count).toBe(1);
    expect(confidential?.count).toBe(1);
  });
});

const baseActivity = {
  activityId: 'A1',
  user: 'alice@example.com',
  parsedDate: new Date('2024-04-01T14:00:00'),
  riskScore: 1600,
  email: true,
  cloud: true,
  emailDomain: 'example.com',
  time: '14:05',
  dataLeakage: true,
  confidentialData: true,
  restrictedData: true,
  internalData: true,
  enhancedMonitoring: true,
  performanceImprovementPlan: true,
  productivityMonitored: true,
  emailEnhancedMonitoring: true,
  phi: true,
  pii: true,
  pci: true,
  documents: true,
  presentation: true,
  spreadsheets: true,
  zipFiles: true,
  managerAction: 'Escalated'
};

const activities = [
  ...Array(20).fill(baseActivity),
  ...Array(12).fill({ ...baseActivity, user: 'bob@example.com' })
];

describe('Tests for non-key data transformer functions', () => {
  it('getActivityByDay returns one entry with correct count', () => {
    const result = getActivityByDay(activities);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe(32);
  });

  it('getActivityByHour increments correct hour', () => {
    const result = getActivityByHour(activities);
    expect(result.find(h => h.hour === '14:00')?.count).toBe(32);
  });

  it('getActivityByMonth counts activity in April', () => {
    const result = getActivityByMonth(activities);
    expect(result[3].value).toBe(32); // April is index 3
  });

  it('getActivityTypeByMonth counts email and cloud in April', () => {
    const result = getActivityTypeByMonth(activities);
    expect(result[3].email).toBe(32);
    expect(result[3].cloud).toBe(32);
  });

  it('getActivityTypeDistribution counts Email and Cloud', () => {
    const result = getActivityTypeDistribution(activities);
    expect(result.find(r => r.name === 'Email')?.count).toBe(32);
    expect(result.find(r => r.name === 'Cloud')?.count).toBe(32);
  });

  it('getAverageRiskScore returns 1600', () => {
    const result = getAverageRiskScore(activities);
    expect(result).toBe(1600);
  });

  it('getHighRiskCount returns 32', () => {
    const result = getHighRiskCount(activities);
    expect(result).toBe(32);
  });

  it('getEmailDomainDistribution returns correct count', () => {
    const result = getEmailDomainDistribution(activities);
    expect(result[0]).toMatchObject({ domain: 'example.com', count: 32 });
  });

  it('getDataClassificationByChannel for cloud', () => {
    const result = getDataClassificationByChannel(activities, 'cloud');
    expect(result.find(r => r.name === 'Internal Data')?.count).toBe(32);
    expect(result.find(r => r.name === 'Restricted Data')?.count).toBe(32);
    expect(result.find(r => r.name === 'Confidential Data')?.count).toBe(32);
  });

  it('getDataLeakageOverTime groups by date', () => {
    const result = getDataLeakageOverTime(activities);
    expect(result[0]).toMatchObject({ name: '2024-04-01', count: 32 });
  });

  it('getEmailEnhancedMonitoringByMonth increments April', () => {
    const result = getEmailEnhancedMonitoringByMonth(activities);
    expect(result[3].count).toBe(32);
  });

  it('getFileTypeCounts counts all file types', () => {
    const result = getFileTypeCounts(activities);
    result.forEach(r => expect(r.count).toBe(32));
  });

  it('getManagerActions tallies Escalated', () => {
    const result = getManagerActions(activities);
    expect(result.find(r => r.action === 'Escalated')?.count).toBe(32);
  });

  it('getMonitoringDataByMonth increments April', () => {
    const result = getMonitoringDataByMonth(activities);
    expect(result[3].enhancedMonitoring).toBe(32);
    expect(result[3].performanceImprovementPlan).toBe(32);
    expect(result[3].productivityMonitored).toBe(32);
  });

  it('getSensitiveDataCounts counts PCI/PHI/PII', () => {
    const result = getSensitiveDataCounts(activities);
    result.forEach(r => expect(r.count).toBe(32));
  });

  it('getTopUsersWithDataLeakage includes bob@example.com', () => {
    const result = getTopUsersWithDataLeakage(activities);
    expect(result[1].user).toBe('bob@example.com');
    expect(result[1].count).toBe(12);
  });
});