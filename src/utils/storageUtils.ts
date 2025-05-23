
import * as LZString from 'lz-string';
import { ProcessedActivity } from '@/types';

// Maximum size of each chunk (in characters)
const MAX_CHUNK_SIZE = 500000; // ~0.5MB per chunk

// Storage keys
export const DATA_KEY_PREFIX = 'insight-haven-data-chunk-';
export const DATA_META_KEY = 'insight-haven-data-meta';
export const DATE_RANGE_KEY = 'insight-haven-date-range';

// Interface for metadata about stored chunks
interface DataStorageMeta {
  totalChunks: number;
  totalItems: number;
  dateUpdated: string;
  checksums: string[]; // For data integrity validation
}

/**
 * Calculate a simple checksum for a string
 */
const calculateChecksum = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
};

/**
 * Save data to localStorage with compression and chunking
 */
export const saveData = (data: ProcessedActivity[]): boolean => {
  try {
    // Clear any existing data first
    clearData();
    
    // Compress the entire dataset as JSON
    const jsonString = JSON.stringify(data);
    const compressedData = LZString.compressToUTF16(jsonString);
    
    // Prepare chunks and metadata
    const totalItems = data.length;
    const chunks: string[] = [];
    const checksums: string[] = [];
    
    // Split data into chunks of maximum size
    let currentPosition = 0;
    while (currentPosition < compressedData.length) {
      const chunk = compressedData.slice(
        currentPosition, 
        currentPosition + MAX_CHUNK_SIZE
      );
      chunks.push(chunk);
      checksums.push(calculateChecksum(chunk));
      currentPosition += MAX_CHUNK_SIZE;
    }
    
    // Save each chunk
    chunks.forEach((chunk, index) => {
      localStorage.setItem(`${DATA_KEY_PREFIX}${index}`, chunk);
    });
    
    // Save metadata
    const meta: DataStorageMeta = {
      totalChunks: chunks.length,
      totalItems,
      dateUpdated: new Date().toISOString(),
      checksums
    };
    
    localStorage.setItem(DATA_META_KEY, JSON.stringify(meta));
    
    return true;
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    return false;
  }
};

/**
 * Load data from localStorage
 */
export const loadData = (): ProcessedActivity[] | null => {
  try {
    // Load metadata
    const metaStr = localStorage.getItem(DATA_META_KEY);
    if (!metaStr) {
      return null;
    }
    
    const meta: DataStorageMeta = JSON.parse(metaStr);
    const { totalChunks, checksums } = meta;
    
    // Reconstruct data from chunks
    let compressedData = '';
    for (let i = 0; i < totalChunks; i++) {
      const chunk = localStorage.getItem(`${DATA_KEY_PREFIX}${i}`);
      if (!chunk) {
        console.error(`Missing chunk ${i}`);
        return null;
      }
      
      // Validate chunk integrity
      if (calculateChecksum(chunk) !== checksums[i]) {
        console.error(`Chunk ${i} checksum mismatch`);
        return null;
      }
      
      compressedData += chunk;
    }
    
    // Decompress and parse
    const jsonString = LZString.decompressFromUTF16(compressedData);
    if (!jsonString) {
      console.error('Failed to decompress data');
      return null;
    }
    
    const data = JSON.parse(jsonString) as ProcessedActivity[];
    
    // Convert string dates back to Date objects
    return data.map(item => ({
      ...item,
      parsedDate: item.parsedDate ? new Date(item.parsedDate) : null
    }));
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return null;
  }
};

/**
 * Clear all data chunks and metadata
 */
export const clearData = () => {
  // Get all keys in localStorage
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(DATA_KEY_PREFIX)) {
      keys.push(key);
    }
  }
  
  // Remove all chunks
  keys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Remove metadata
  localStorage.removeItem(DATA_META_KEY);
};

/**
 * Check if data exceeds quota
 * This is a best-effort check before saving
 */
export const willExceedQuota = (data: ProcessedActivity[]): boolean => {
  try {
    const jsonString = JSON.stringify(data);
    const compressedData = LZString.compressToUTF16(jsonString);
    // Estimate storage size needed (with some buffer)
    const estimatedSize = compressedData.length * 2; // UTF16 chars are 2 bytes each
    
    // Check against quota
    const remainingSpace = estimateRemainingStorage();
    return estimatedSize > remainingSpace;
  } catch (error) {
    console.error('Error estimating data size:', error);
    return true; // Assume it will exceed quota
  }
};

/**
 * Estimate remaining localStorage space
 */
const estimateRemainingStorage = (): number => {
  try {
    // Most browsers have ~5MB limit
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    
    // Calculate current usage
    let currentSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        currentSize += key.length * 2 + value.length * 2; // UTF16 chars are 2 bytes each
      }
    }
    
    return Math.max(0, maxSize - currentSize);
  } catch (error) {
    console.error('Error estimating remaining storage:', error);
    return 0; // Be conservative
  }
};