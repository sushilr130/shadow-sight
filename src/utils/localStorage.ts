import { ProcessedActivity } from "@/types";

export const LOCAL_STORAGE_KEY = "insight-haven-data";

export const saveDataToLocalStorage = (data: ProcessedActivity[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
    return false;
  }
};

export const loadDataFromLocalStorage = (): ProcessedActivity[] => {
  try {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedData) return [];
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    return [];
  }
};

export const appendDataToLocalStorage = (newData: ProcessedActivity[]): ProcessedActivity[] => {
  try {
    const existingData = loadDataFromLocalStorage();
    
    // Create a Set of existing activity IDs for quick lookup
    const existingIds = new Set(existingData.map(item => item.activityId));
    
    // Filter out duplicates from new data
    const uniqueNewData = newData.filter(item => !existingIds.has(item.activityId));
    
    // Combine existing and new data
    const combinedData = [...existingData, ...uniqueNewData];
    
    // Save combined data back to localStorage
    saveDataToLocalStorage(combinedData);
    
    return combinedData;
  } catch (error) {
    console.error("Error appending data to localStorage:", error);
    return loadDataFromLocalStorage();
  }
};
