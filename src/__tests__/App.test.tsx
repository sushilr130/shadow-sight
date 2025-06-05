import { render, screen } from '@testing-library/react';
import App from '@/App';
import { describe, it, beforeEach } from 'vitest';

const routesToTest = [
  { path: '/analytics', text: /analytics/i },
  { path: '/calendar', text: /calendar/i },
  { path: '/data-management', text: /data management/i },
  { path: '/settings', text: /settings/i },
  { path: '/email-analytics', text: /email analytics/i },
  { path: '/usb-analytics', text: /usb analytics/i },
  { path: '/cloud-analytics', text: /cloud analytics/i },
  { path: '/data-leakage', text: /data leakage/i },
  { path: '/risk-analysis', text: /risk analysis/i },
  { path: '/user-monitoring', text: /user monitoring/i },
  { path: '/compliance-reports', text: /compliance reports/i },
  { path: '/email-domain-analysis', text: /email domain analysis/i },
  { path: '/activity-time-analysis', text: /Breach time analysis/i },
  { path: '/file-analysis', text: /file analysis/i },
  { path: '/employee-monitoring', text: /employee monitoring/i },
  { path: '/data-leakage-investigation', text: /data leakage investigation/i },
  { path: '/manager-actions', text: /manager actions/i },
  //{ path: '*', text: /not found/i }, // 404
];

describe('Full app route rendering', () => {
  for (const { path, text } of routesToTest) {
    it(`renders route ${path}`, () => {
      window.history.pushState({}, '', path);
      render(<App />);
      expect(screen.getByRole('heading',{level:1, name: text})).toBeInTheDocument();
    });
  }
});
// Note: The above test suite assumes that each route renders a unique text element.