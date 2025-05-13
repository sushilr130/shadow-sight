
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useData } from '@/hooks/useData';
import { toast } from '@/components/ui/use-toast';
import { FileText, Upload, Plus, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DataUploader = () => {
  const { uploadData, appendData, isLoading, data } = useData();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appendFileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isAppend = false) => {
    setUploadError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'text/csv' && file.name.split('.').pop()?.toLowerCase() !== 'csv') {
        setUploadError("Please upload a CSV file");
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      
      try {
        if (isAppend) {
          await appendData(file);
        } else {
          await uploadData(file);
        }
        // Reset file input to allow uploading the same file again
        e.target.value = '';
      } catch (error) {
        console.error("Error processing CSV file:", error);
        setUploadError("Processing error. Check console for details.");
        toast({
          title: "Processing Error",
          description: "There was an error processing your CSV file. Please make sure it contains the required columns.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, isAppend = false) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'text/csv' && file.name.split('.').pop()?.toLowerCase() !== 'csv') {
        setUploadError("Please upload a CSV file");
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        return;
      }
      
      try {
        if (isAppend) {
          await appendData(file);
        } else {
          await uploadData(file);
        }
      } catch (error) {
        console.error("Error processing CSV file:", error);
        setUploadError("Processing error. Check console for details.");
        toast({
          title: "Processing Error",
          description: "There was an error processing your CSV file. Please make sure it contains the required columns.",
          variant: "destructive",
        });
      }
    }
  };
  
  const triggerFileInput = (isAppend = false) => {
    if (isAppend) {
      appendFileInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };
  
  return (
    <Tabs defaultValue="replace" className="w-full">
      <TabsList className="mb-4 grid w-full grid-cols-2">
        <TabsTrigger value="replace">Replace Data</TabsTrigger>
        <TabsTrigger value="append">Append Data</TabsTrigger>
      </TabsList>
      
      {uploadError && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-lg mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{uploadError}</span>
        </div>
      )}
      
      <TabsContent value="replace">
        <div 
          className={`
            flex flex-col items-center justify-center 
            rounded-xl border-2 border-dashed 
            p-8 transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, false)}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            accept=".csv" 
            onChange={(e) => handleFileChange(e, false)} 
          />
          
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Upload Raw CSV Data</h3>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
            Drag and drop your raw CSV file here, or click to browse.
            We'll automatically process the data to extract relevant information.
          </p>
          
          <Button 
            onClick={() => triggerFileInput(false)} 
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>{isLoading ? 'Processing...' : 'Select CSV File'}</span>
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="append">
        <div 
          className={`
            flex flex-col items-center justify-center 
            rounded-xl border-2 border-dashed 
            p-8 transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
            ${data.length === 0 ? 'opacity-75' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, true)}
        >
          <input 
            type="file" 
            ref={appendFileInputRef}
            className="hidden" 
            accept=".csv" 
            onChange={(e) => handleFileChange(e, true)} 
          />
          
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          
          <h3 className="text-lg font-medium mb-2">Append CSV Data</h3>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
            Drag and drop additional raw CSV data to append to your existing dataset.
            The system will automatically process and merge the data.
          </p>
          
          <Button 
            onClick={() => triggerFileInput(true)} 
            disabled={isLoading || data.length === 0}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{isLoading ? 'Processing...' : 'Append CSV File'}</span>
          </Button>
          
          {data.length === 0 && (
            <p className="text-xs text-muted-foreground mt-4">
              You need to upload initial data before you can append more.
            </p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DataUploader;
