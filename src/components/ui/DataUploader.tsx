
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useData } from '@/hooks/useData';
import { toast } from '@/components/ui/use-toast';
import { FileText, Upload } from 'lucide-react';

export const DataUploader = () => {
  const { uploadData, isLoading } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'text/csv' && file.name.split('.').pop()?.toLowerCase() !== 'csv') {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      
      await uploadData(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'text/csv' && file.name.split('.').pop()?.toLowerCase() !== 'csv') {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      
      await uploadData(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div 
      className={`
        flex flex-col items-center justify-center 
        rounded-xl border-2 border-dashed 
        p-8 transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept=".csv" 
        onChange={handleFileChange} 
      />
      
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <FileText className="h-6 w-6 text-primary" />
      </div>
      
      <h3 className="text-lg font-medium mb-2">Upload CSV Data</h3>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
        Drag and drop your ABC CSV file here, or click to browse. 
        Both raw and processed formats are supported.
      </p>
      
      <Button 
        onClick={triggerFileInput} 
        disabled={isLoading}
        className="flex items-center space-x-2"
      >
        <Upload className="h-4 w-4" />
        <span>{isLoading ? 'Processing...' : 'Select CSV File'}</span>
      </Button>
    </div>
  );
};

export default DataUploader;
