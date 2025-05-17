
import { useEffect } from 'react';
import { ProcessedActivity, DateRange } from '@/types';
import { calculateDateRange } from '@/utils/dataTransformer';

export const useDataLoader = (
  setIsLoading: (loading: boolean) => void,
  setData: (data: ProcessedActivity[]) => void,
  setDateRange: (range: DateRange) => void
) => {
  useEffect(() => {
    const fetchDataFromLocalStorage = () => {
      setIsLoading(true);
      try {
        // Retrieve saved activities from localStorage
        const savedDataStr = localStorage.getItem('insight-haven-data');
        if (savedDataStr) {
          const savedData = JSON.parse(savedDataStr) as ProcessedActivity[];
          
          // Convert string dates back to Date objects
          const processedData = savedData.map(item => ({
            ...item,
            parsedDate: item.parsedDate ? new Date(item.parsedDate) : null
          }));
          
          setData(processedData);
          
          // Retrieve saved date range from localStorage
          const savedDateRangeStr = localStorage.getItem('insight-haven-date-range');
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
