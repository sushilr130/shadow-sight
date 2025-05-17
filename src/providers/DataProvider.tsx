
import { ReactNode, useMemo } from 'react';
import { DataContext } from '@/contexts/DataContext';
import { useDataOperations } from '@/hooks/useDataOperations';
import { useDataLoader } from '@/hooks/useDataLoader';
import { useDataSaver } from '@/hooks/useDataSaver';
import { filterDataByDateRange, calculateDateRange } from '@/utils/dataTransformer';

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const {
    isLoading,
    setIsLoading,
    data,
    setData,
    dateRange,
    setDateRange,
    uploadData,
    appendData,
    clearAllData
  } = useDataOperations();
  
  // Load data from localStorage on initial render
  useDataLoader(setIsLoading, setData, setDateRange);
  
  // Save data to localStorage whenever it changes
  useDataSaver(isLoading, data, dateRange);
  
  // Calculate full date range
  const fullDateRange = useMemo(() => {
    if (data.length === 0) return null;
    return calculateDateRange(data);
  }, [data]);
  
  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    return filterDataByDateRange(data, dateRange.from, dateRange.to);
  }, [data, dateRange.from, dateRange.to]);
  
  return (
    <DataContext.Provider value={{ 
      isLoading, 
      data, 
      filteredData, 
      dateRange, 
      fullDateRange,
      uploadData,
      appendData,
      setDateRange,
      clearAllData
    }}>
      {children}
    </DataContext.Provider>
  );
};
