
import { useState } from 'react';
import { ProcessedActivity, DateRange } from '@/types';
import { parseCSV } from '@/utils/csvParser';
import { toast } from 'sonner';
import { calculateDateRange } from '@/utils/dataTransformer';

export const useDataOperations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ProcessedActivity[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });

  const uploadData = async (file: File) => {
    console.log(`Starting to upload file: ${file.name} (${file.size} bytes, type: ${file.type})`);
    setIsLoading(true);
    try {
      console.log('Starting to parse CSV file:', file.name);
      const parsedData = await parseCSV(file);
      console.log(`CSV parsing complete. Found ${parsedData.length} valid records.`);
      
      if (parsedData.length === 0) {
        console.error('No valid data found in CSV file');
        toast.error('No valid data found in the CSV file. Please check the file format and try again.');
        setIsLoading(false);
        return;
      }
      
      // Replace existing data
      setData(parsedData);
      
      // Reset date range when new data is loaded
      if (parsedData.length > 0) {
        const [startDate, endDate] = calculateDateRange(parsedData);
        setDateRange({ from: startDate, to: endDate });
      }
      
      toast.success(`Successfully processed ${parsedData.length} activities`);
    } catch (error) {
      console.error('Error uploading data:', error);
      toast.error('Failed to process CSV file. Please check the format and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const appendData = async (file: File) => {
    console.log(`Starting to append file: ${file.name} (${file.size} bytes, type: ${file.type})`);
    setIsLoading(true);
    try {
      console.log('Starting to parse CSV file for append:', file.name);
      const parsedData = await parseCSV(file);
      console.log(`CSV parsing complete. Found ${parsedData.length} valid records to append.`);
      
      if (parsedData.length === 0) {
        console.error('No valid data found in CSV file for append');
        toast.error('No valid data found in the CSV file. Please check the file format and try again.');
        setIsLoading(false);
        return;
      }
      
      // Append to existing data
      const newData = [...data, ...parsedData];
      setData(newData);
      
      // Update date range to include all data
      if (newData.length > 0) {
        const [startDate, endDate] = calculateDateRange(newData);
        setDateRange({ from: startDate, to: endDate });
      }
      
      toast.success(`Successfully appended ${parsedData.length} activities`);
    } catch (error) {
      console.error('Error appending data:', error);
      toast.error('Failed to process CSV file. Please check the format and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearAllData = () => {
    setIsLoading(true);
    try {
      localStorage.removeItem('insight-haven-data');
      localStorage.removeItem('insight-haven-date-range');
      setData([]);
      setDateRange({ from: undefined, to: undefined });
      toast.success('All data has been removed from storage');
    } catch (error) {
      console.error('Error clearing data from localStorage:', error);
      toast.error('Failed to clear data from storage');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    data,
    setData,
    dateRange,
    setDateRange,
    uploadData,
    appendData,
    clearAllData
  };
};
