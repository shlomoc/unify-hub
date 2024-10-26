import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { HomeIcon, CodeIcon, FileTextIcon, ScrollTextIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const getUserEmail = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    getUserEmail();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUserEmail("");
      navigate("/login");
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <aside className={cn(
      "bg-white border-r p-6 transition-all duration-300 relative",
      collapsed ? "w-20" : "w-64"
    )}>
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute -right-3 top-6 rounded-full bg-white border"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
      </Button>

      <div className="flex items-center gap-2 mb-8">
        {!collapsed && <h1 className="text-xl font-bold">Dani AI</h1>}
      </div>
      
      <nav className="space-y-2">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start gap-2",
            collapsed && "justify-center px-2"
          )} 
          onClick={() => navigate("/dashboard")}
        >
          <HomeIcon className="w-4 h-4" />
          {!collapsed && "Overview"}
        </Button>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start gap-2",
            collapsed && "justify-center px-2"
          )} 
          onClick={() => navigate("/api-playground")}
        >
          <CodeIcon className="w-4 h-4" />
          {!collapsed && "API Playground"}
        </Button>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start gap-2",
            collapsed && "justify-center px-2"
          )}
        >
          <FileTextIcon className="w-4 h-4" />
          {!collapsed && "Invoices"}
        </Button>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start gap-2",
            collapsed && "justify-center px-2"
          )}
        >
          <ScrollTextIcon className="w-4 h-4" />
          {!collapsed && "Documentation"}
        </Button>
      </nav>

      <div className="mt-auto pt-6 border-t">
        <div className={cn(
          "flex items-center gap-3 mb-4",
          collapsed && "justify-center"
        )}>
          <Avatar>
            <div className="bg-purple-500 text-white w-full h-full flex items-center justify-center">
              {userEmail ? userEmail[0].toUpperCase() : "?"}
            </div>
          </Avatar>
          {!collapsed && (
            <div>
              <p className="font-medium">{userEmail || "Loading..."}</p>
            </div>
          )}
        </div>
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={handleLogout}
        >
          {collapsed ? "×" : "Logout"}
        </Button>
      </div>
    </aside>
  );
};
