
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { DataProvider } from '@/hooks/useData';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Inform the user about the error
    toast({
      title: "Page Not Found",
      description: `The page at ${location.pathname} could not be found.`,
      variant: "destructive",
    });

    // If the URL includes a hash/fragment, try to navigate to the base route
    if (location.hash) {
      const baseUrl = location.pathname.split('#')[0];
      navigate(baseUrl);
    }
  }, [location.pathname, location.hash, navigate]);

  return (
    <DataProvider>
      <SidebarProvider>
        <div className="min-h-screen w-full flex">
          <AppSidebar />
          <SidebarInset>
            <Header />
            <main className="flex-grow flex items-center justify-center">
              <div className="text-center p-8">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Oops! Page not found
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                  The page at <code className="bg-muted p-1 rounded">{location.pathname}</code> could not be found.
                </p>
                <Button asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Return to Dashboard
                  </Link>
                </Button>
              </div>
            </main>
            <Footer />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </DataProvider>
  );
};

export default NotFound;
