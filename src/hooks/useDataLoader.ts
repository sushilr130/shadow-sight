
import { useEffect } from 'react';
import { ProcessedActivity, DateRange } from '@/types';
import { calculateDateRange } from '@/utils/dataTransformer';
import { loadData, DATE_RANGE_KEY } from '@/utils/storageUtils';

export const useDataLoader = (
  setIsLoading: (loading: boolean) => void,
  setData: (data: ProcessedActivity[]) => void,
  setDateRange: (range: DateRange) => void
) => {
  useEffect(() => {
    const fetchDataFromLocalStorage = () => {
      setIsLoading(true);
      try {
        // Retrieve saved activities from chunked localStorage
        const processedData = loadData();
        
        if (processedData && processedData.length > 0) {
          setData(processedData);
          
          // Retrieve saved date range from localStorage
          const savedDateRangeStr = localStorage.getItem(DATE_RANGE_KEY);
          if (savedDateRangeStr) {
            const savedDateRange = JSON.parse(savedDateRangeStr);
            setDateRange({
              from: savedDateRange.from ? new Date(savedDateRange.from) : undefined,
              to: savedDateRange.to ? new Date(savedDateRange.to) : undefined
            });
          } else if (processedData.length > 0) {
            // Set default date range if none was saved
            const [startDate, endDate] = calculateDateRange(processedData);
            setDateRange({ from: startDate, to: endDate });
          }
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDataFromLocalStorage();
  }, [setIsLoading, setData, setDateRange]);
};