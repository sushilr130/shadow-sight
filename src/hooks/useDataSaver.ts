
import { useEffect } from 'react';
import { ProcessedActivity, DateRange } from '@/types';

export const useDataSaver = (
  isLoading: boolean,
  data: ProcessedActivity[],
  dateRange: DateRange
) => {
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      localStorage.setItem('insight-haven-data', JSON.stringify(data));
    }
  }, [data, isLoading]);
  
  // Save date range to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && (dateRange.from || dateRange.to)) {
      localStorage.setItem('insight-haven-date-range', JSON.stringify(dateRange));
    }
  }, [dateRange, isLoading]);
};
