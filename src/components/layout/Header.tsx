
import { MoveUpRight,Upload } from 'lucide-react';
import { useRef } from 'react';
import { useData } from '@/hooks/useData';

export const Header = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadData } = useData();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadData(file);
      e.target.value = ''; // Reset input so same file can be re-uploaded if needed
    }
  };

  return (
    <header className="w-full py-6 px-8 flex justify-between items-center border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-bold text-sm">
          ABC
        </div>
        <h1 className="text-xl font-medium tracking-tight">
          Insight Haven <span className="text-primary font-medium">Visualizer</span>
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
        <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</a>
        
                {/* Upload Button */}
                <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-1 text-sm font-medium bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-full transition-colors"
        >
          <Upload className="h-4 w-4 mr-1" />
          <span>Upload Data</span>
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />

        <a 
          href="#" 
          className="flex items-center space-x-1 text-sm font-medium bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-full transition-colors"
        >
          <span>Export Report</span>
          <MoveUpRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </header>
  );
};

export default Header;
