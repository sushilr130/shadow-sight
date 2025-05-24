// dashboardTestHarness.ts
import { render, screen, fireEvent } from '@testing-library/react';
import type { ReactElement } from 'react';

interface DashboardTestConfig {
  name: string;
  component: ReactElement;
  expectedHeadings?: string[];
  exportButtonText?: string;
  paginationLinks?: string[]; // e.g., ['1', '2', '3']
  perPageAssertions?: ((pageIndex: number) => void)[];
}

export function runDashboardTests({
  name,
  component,
  expectedHeadings = [],
  exportButtonText = 'Export PDF',
  paginationLinks,
  perPageAssertions,
}: DashboardTestConfig) {
  describe(`${name} Dashboard`, () => {
    it('renders expected headings and elements', () => {
      render(component);

      expectedHeadings.forEach((heading) => {
        const el = screen.getByRole('heading', {
          name: new RegExp(heading, 'i'),
        });
        expect(el).toBeInTheDocument();
      });
    });

    if (paginationLinks && perPageAssertions) {
      paginationLinks.forEach((pageLabel, index) => {
        it(`renders expected content on page ${pageLabel}`, () => {
          render(component);

          const pageLink = screen.getByRole('link', { name: pageLabel });
          fireEvent.click(pageLink);

          perPageAssertions[index]?.(index);
        });
      });
    }

    // Optional future export test
    // it('calls exportToPDF when export button is clicked', async () => { ... });
  });
}
