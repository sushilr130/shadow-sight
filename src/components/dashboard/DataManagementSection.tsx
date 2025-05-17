
import DataUploader from '../ui/DataUploader';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/hooks/useData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const DataManagementSection = () => {
  const { clearAllData } = useData();
  
  return (
    <div className="mb-8 bg-card rounded-xl border border-border/50 shadow-subtle p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Upload Additional Data</h2>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all your uploaded activity data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearAllData}>Yes, delete all data</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <DataUploader />
    </div>
  );
};

export default DataManagementSection;
