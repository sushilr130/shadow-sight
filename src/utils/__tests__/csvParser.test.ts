import { describe, it, expect, vi } from 'vitest';
import { parseCSV, transformProcessedRow, transformRawRow} from '../csvParser';
import * as Papa from 'papaparse';

vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn(),
  },
}));

describe('parseCSV', () => {
  const dummyFile = new File(['dummy content'], 'test.csv', { type: 'text/csv' });

  it('should return empty array if no data rows exist', async () => {
    const mockParse = (Papa as any).default.parse as ReturnType<typeof vi.fn>;

    mockParse.mockImplementation((_file, options) => {
      options.complete({ data: [] });
    });

    const result = await parseCSV(dummyFile);
    expect(result).toEqual([]);
  });

  it('should parse processed CSV and return structured data', async () => {
    const mockParse = (Papa as any).default.parse as ReturnType<typeof vi.fn>;
    mockParse.mockImplementation((_file, options) => {
      options.complete({
        data: [
          {
            "Activity Id": "ACT123",
            "User Name": "jane.doe@company.com",
            "Risk Score": "85",
            "Date": "01/04/2024",
            "Policy Violations": JSON.stringify({ pii: ["PII Breach"] }),
            "Values": JSON.stringify({ destinations: ["jane.doe@gmail.com"] }),
            "Integration": "si-email",
          },
        ],
      });
    });

    const result = await parseCSV(dummyFile);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      activityId: 'ACT123',
      user: 'jane.doe@company.com',
      email: true,
      pii: true,
      emailDomain: 'gmail.com',
      weekEnding: expect.stringMatching(/2024-04-06/),
    });
  });

  it('should handle invalid JSON and return default values', async () => {
    const mockParse = (Papa as any).default.parse as ReturnType<typeof vi.fn>;
    mockParse.mockImplementation((_file, options) => {
      options.complete({
        data: [
          {
            "Activity Id": "ACT456",
            "User Name": "john.doe@company.com",
            "Risk Score": "40",
            "Date": "15/03/2024",
            "Policy Violations": "{ not: 'valid JSON'",
            "Values": "{ not valid either }",
            "Integration": "si-usb"
          }
        ]
      });
    });

    const result = await parseCSV(dummyFile);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      activityId: "ACT456",
      user: "john.doe@company.com",
      usb: true,
      email: false,
      policiesBreached: {},
      values: {}
    });
  });
});


describe('transformRawRow', () => {
  it('returns null if activityId or user is missing', () => {
    expect(transformRawRow({})).toBeNull();
    expect(transformRawRow({ 'Activity Id': 'A01' })).toBeNull();
    expect(transformRawRow({ 'User Name': 'a@b.com' })).toBeNull();
  });

  it('parses minimal valid row and calculates weekEnding', () => {
    const row = {
      'Activity Id': 'A01',
      'User Name': 'test@domain.com',
      'Date': '01/04/2024' // Monday
    };

    const result = transformRawRow(row)!;
    expect(result.activityId).toBe('A01');
    expect(result.user).toBe('test@domain.com');
    expect(result.weekEnding).toBe('2024-04-06');
    expect(result.emailDomain).toBe('domain.com');
  });

  it('handles invalid date gracefully', () => {
    const row = {
      'Activity Id': 'A01',
      'User Name': 'test@domain.com',
      'Date': 'invalid-date'
    };

    const result = transformRawRow(row)!;
    expect(result.weekEnding).toBe('');
    expect(result.parsedDate).toBeNull();
  });

  it('parses Policy Violations and activates boolean flags', () => {
    const row = {
      'Activity Id': 'A02',
      'User Name': 'test@company.com',
      'Policy Violations': JSON.stringify({
        pii: ['PII Breach'],
        confidential: ['ConfidentialData'],
        pdf: ['PDF'],
        fraudIndicators: ['FraudIndicators']
      })
    };

    const result = transformRawRow(row)!;
    expect(result.pii).toBe(true);
    expect(result.confidentialData).toBe(true);
    expect(result.pdf).toBe(true);
    expect(result.fraudIndicators).toBe(true);
  });

  it('parses Values field and extracts email domain from destinations', () => {
    const row = {
      'Activity Id': 'A03',
      'User Name': 'irrelevant@domain.com',
      'Values': JSON.stringify({ destinations: ['person@external.com'] })
    };

    const result = transformRawRow(row)!;
    expect(result.emailDomain).toBe('external.com');
  });

  it('handles invalid JSON for Policy Violations and Values', () => {
    const row = {
      'Activity Id': 'A04',
      'User Name': 'test@fail.com',
      'Policy Violations': '{ not valid JSON',
      'Values': 'also bad JSON'
    };

    const result = transformRawRow(row)!;
    expect(result.policiesBreached).toEqual({});
    expect(result.values).toEqual({});
  });

  it('sets correct integration flags from Integration field', () => {
    const row = {
      'Activity Id': 'A05',
      'User Name': 'user@tech.com',
      'Integration': 'si-cloud'
    };

    const result = transformRawRow(row)!;
    expect(result.cloud).toBe(true);
    expect(result.email).toBe(false);
    expect(result.usb).toBe(false);
  });
});

describe('transformProcessedRow', () => {
  it('returns null if activityId or user is missing', () => {
    expect(transformProcessedRow({})).toBeNull();
    expect(transformProcessedRow({ 'Activity Id': 'A01' })).toBeNull();
    expect(transformProcessedRow({ 'User Name': 'user@example.com' })).toBeNull();
  });

  it('parses a valid row with date, flags, and JSON', () => {
    const row = {
      'Activity Id': 'A02',
      'User Name': 'user@example.com',
      'Date': '02/04/2024',
      'Week Ending': '2024-04-06',
      'Risk Score': '75',
      'Time': '14:00',
      'Integration': 'si-email',
      'Policy Violations': JSON.stringify({ pii: ['PII Breach'] }),
      'Values': JSON.stringify({ destinations: ['x@example.com'] }),
      'Email Domain': 'example.com',
      'Alert Status': 'Open',
      'Manager Action': 'Review',
      'Email': true,
      'USB': false,
      'PDF': true,
      'Spreadsheets': false
    };

    const result = transformProcessedRow(row);
    expect(result).toMatchObject({
      activityId: 'A02',
      user: 'user@example.com',
      date: '02/04/2024',
      time: '14:00',
      riskScore: 75,
      integration: 'si-email',
      weekEnding: '2024-04-06',
      parsedDate: new Date(2024, 3, 2), // April is month index 3
      emailDomain: 'example.com',
      status: 'Open',
      managerAction: 'Review',
      email: true,
      usb: false,
      pdf: true,
      pii: false, // ⚠️ not set via category or string — only flag is checked here
    });

    expect(result?.policiesBreached).toEqual({ pii: ['PII Breach'] });
    expect(result?.values).toEqual({ destinations: ['x@example.com'] });
  });

  it('handles fallback field names and lowercased keys', () => {
    const row = {
      activityId: 'A03',
      user: 'alt@domain.com',
      date: '01/03/2024',
      weekEnding: '2024-03-02',
      riskScore: '50',
      time: '09:30',
      integration: 'si-usb',
      policiesBreached: { confidential: ['ConfidentialData'] },
      values: { destinations: ['abc@domain.com'] },
      email: true,
      usb: true,
      confidentialData: true,
      pdf: false
    };

    const result = transformProcessedRow(row)!;
    expect(result.activityId).toBe('A03');
    expect(result.user).toBe('alt@domain.com');
    expect(result.confidentialData).toBe(true);
    expect(result.usb).toBe(true);
    expect(result.pdf).toBe(false);
  });

  it('handles invalid JSON and still returns a row', () => {
    const row = {
      'Activity Id': 'A04',
      'User Name': 'user@fail.com',
      'Policy Violations': '{ bad json',
      'Values': 'not valid JSON',
    };

    const result = transformProcessedRow(row)!;
    expect(result.policiesBreached).toEqual({});
    expect(result.values).toEqual({});
  });

  it('returns null for invalid date format', () => {
    const row = {
      'Activity Id': 'A05',
      'User Name': 'user@date.com',
      'Date': 'not/a/real/date',
    };

    const result = transformProcessedRow(row)!;
    expect(result.parsedDate).toBeNull();
  });
});