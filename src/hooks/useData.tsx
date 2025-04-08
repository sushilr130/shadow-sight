
import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { DateRange, ProcessedActivity } from '@/types';
import { parseCSV } from '@/utils/csvParser';
import { toast } from '@/components/ui/use-toast';
import { calculateDateRange, filterDataByDateRange } from '@/utils/dataTransformer';
import { loadDataFromLocalStorage, appendDataToLocalStorage } from '@/utils/localStorage';

interface DataContextProps {
  isLoading: boolean;
  data: ProcessedActivity[];
  filteredData: ProcessedActivity[];
  dateRange: DateRange;
  fullDateRange: [Date, Date] | null;
  uploadData: (file: File) => Promise<void>;
  setDateRange: (range: DateRange) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ProcessedActivity[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });

   // Load data from localStorage on initial mount
   useEffect(() => {
    const storedData = loadDataFromLocalStorage();
    if (storedData.length > 0) {
      setData(storedData);
      
      // Set initial date range based on stored data
      const [startDate, endDate] = calculateDateRange(storedData);
      setDateRange({ from: startDate, to: endDate });
      
      toast({
        title: "Data Loaded",
        description: `Loaded ${storedData.length} activities from local storage`,
      });
    }
  }, []);


  
  const fullDateRange = useMemo(() => {
    if (data.length === 0) return null;
    return calculateDateRange(data);
  }, [data]);
  
  const filteredData = useMemo(() => {
    return filterDataByDateRange(data, dateRange.from, dateRange.to);
  }, [data, dateRange.from, dateRange.to]);
  
  const uploadData = async (file: File) => {
    setIsLoading(true);
    try {
      const parsedData = await parseCSV(file);
      
      if (parsedData.length === 0) {
        toast({
          title: "Error",
          description: "No valid data found in the CSV file",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
     // Append to existing data (handles deduplication internally)
      const updatedData = appendDataToLocalStorage(parsedData);
      setData(updatedData);
      
      // Reset date range when new data is loaded
      if (updatedData.length > 0) {
        const [startDate, endDate] = calculateDateRange(updatedData);
        setDateRange({ from: startDate, to: endDate });
      }
      
      toast({
        title: "Data Loaded",
        description: `Successfully processed ${parsedData.length} activities, total dataset: ${updatedData.length}`,
      });
    } catch (error) {
      console.error('Error uploading data:', error);
      toast({
        title: "Error",
        description: "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DataContext.Provider value={{ 
      isLoading, 
      data, 
      filteredData, 
      dateRange, 
      fullDateRange,
      uploadData, 
      setDateRange 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
