import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 lg:px-8">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
        
        <div className="flex items-center ml-auto gap-2">
          {/* Dark mode toggle and help button removed */}
        </div>
      </div>
    </header>
  );
};

export default Header;