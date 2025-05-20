
import { useEffect } from 'react';
import { ProcessedActivity, DateRange } from '@/types';
import { saveData, DATE_RANGE_KEY, willExceedQuota } from '@/utils/storageUtils';
import { toast } from 'sonner';

export const useDataSaver = (
  isLoading: boolean,
  data: ProcessedActivity[],
  dateRange: DateRange
) => {
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      try {
        // Check if data will exceed quota
        if (willExceedQuota(data)) {
          toast.warning(
            "Data size warning", 
            { 
              description: "The dataset is very large and may not fit in browser storage. Consider exporting important data."
            }
          );
        }
        
        // Save data anyway (it will be chunked)
        const success = saveData(data);
        if (!success) {
          toast.error("Failed to save data to storage. The dataset may be too large.");
        }
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
        toast.error("Failed to save data to storage");
      }
    }
  }, [data, isLoading]);
  
  // Save date range to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && (dateRange.from || dateRange.to)) {
      localStorage.setItem(DATE_RANGE_KEY, JSON.stringify(dateRange));
    }
  }, [dateRange, isLoading]);
};