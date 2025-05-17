
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 lg:px-8">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        
        <div className="flex items-center ml-auto gap-2">
          <ModeToggle />
          <Button variant="ghost" size="sm">
            Help
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
