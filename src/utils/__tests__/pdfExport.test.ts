import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToPDF } from '../pdfExport';
import { jsPDF } from 'jspdf';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,...',
    width: 300,
    height: 150
  })
}));

// Mock jsPDF
vi.mock('jspdf', () => {
  const fakePDF = {
    setFont: vi.fn(),
    setFontSize: vi.fn(),
    setTextColor: vi.fn(),
    text: vi.fn(),
    setDrawColor: vi.fn(),
    setLineWidth: vi.fn(),
    line: vi.fn(),
    addPage: vi.fn(),
    addImage: vi.fn(),
    rect: vi.fn(),
    save: vi.fn(),
    setPage: vi.fn(),
    getNumberOfPages: () => 1,
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297
      }
    }
  };
  return { jsPDF: vi.fn(() => fakePDF) };
});

describe('exportToPDF', () => {
  beforeEach(() => {
    // Mock the DOM query to return fake chart elements
    const fakeChart = document.createElement('div');
    fakeChart.classList.add('recharts-wrapper');
    const card = document.createElement('div');
    card.classList.add('card');

    const title = document.createElement('div');
    title.classList.add('card-title');
    title.textContent = 'Mock Chart Title';
    card.appendChild(title);

    const desc = document.createElement('div');
    desc.classList.add('card-description');
    desc.textContent = 'Mock Chart Description';
    card.appendChild(desc);

    card.appendChild(fakeChart);
    document.body.appendChild(card);

    vi.spyOn(document, 'querySelectorAll').mockReturnValue([fakeChart]);
  });

  it('should export PDF successfully with charts', async () => {
    const result = await exportToPDF({ title: 'Test PDF', includeTimestamp: false });
    expect(result.success).toBe(true);
  });

  it('should return an error if no charts are found', async () => {
    vi.spyOn(document, 'querySelectorAll').mockReturnValue([]);
    const result = await exportToPDF();
    expect(result.success).toBe(false);
    expect(result.error.message).toContain('No charts found');
  });
});
