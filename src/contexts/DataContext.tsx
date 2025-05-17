
import { createContext, useContext, ReactNode } from 'react';
import { DateRange, ProcessedActivity } from '@/types';

interface DataContextProps {
  isLoading: boolean;
  data: ProcessedActivity[];
  filteredData: ProcessedActivity[];
  dateRange: DateRange;
  fullDateRange: [Date, Date] | null;
  uploadData: (file: File) => Promise<void>;
  appendData: (file: File) => Promise<void>;
  setDateRange: (range: DateRange) => void;
  clearAllData: () => void;
}

export const DataContext = createContext<DataContextProps | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};