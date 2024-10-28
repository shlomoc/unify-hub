import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { Github, Star, GitPullRequest, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || "");
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      try {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setUserEmail("");
        navigate("/login");
        toast({
          title: "Success",
          description: "Signed out successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to sign out",
          variant: "destructive",
        });
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-2">
          <Github className="w-6 h-6" />
          <span className="font-medium">Dani Github Analyzer</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-gray-700 hover:text-gray-900 text-sm">Features</a>
          <a href="#pricing" className="text-gray-700 hover:text-gray-900 text-sm">Pricing</a>
          <a href="#about" className="text-gray-700 hover:text-gray-900 text-sm">About</a>
          {isAuthenticated && (
            <Button 
              variant="ghost" 
              className="text-gray-700 hover:text-gray-900 text-sm"
              onClick={() => navigate("/dashboard")}
            >
              Dashboards
            </Button>
          )}
          <Button 
            variant="ghost" 
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
            onClick={handleAuthAction}
          >
            {isAuthenticated ? "Sign Out" : "Sign In"}
          </Button>
        </div>
      </nav>

      <section className="text-center py-20 px-4">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400 text-transparent bg-clip-text">
          Unlock GitHub Insights with Dani
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Get powerful insights, summaries, and analytics for open source GitHub repositories. 
          Discover trends, track important updates, and stay ahead of the curve.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/dashboard")}>Get Started</Button>
          <Button size="lg" variant="outline">Learn More</Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-500">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6">
            <Star className="w-8 h-8 mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Repository Insights</h3>
            <p className="text-gray-600">Get comprehensive summaries and analytics for any GitHub repository.</p>
          </Card>
          <Card className="p-6">
            <GitPullRequest className="w-8 h-8 mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Important PRs</h3>
            <p className="text-gray-600">Track and analyze the most impactful pull requests in real-time.</p>
          </Card>
          <Card className="p-6">
            <RefreshCw className="w-8 h-8 mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Version Updates</h3>
            <p className="text-gray-600">Stay informed about the latest version releases and changelogs.</p>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-500">Pricing Plans</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-gray-600 mb-4">For individual developers</p>
            <p className="text-4xl font-bold mb-6">$0</p>
            <Button className="w-full" variant="outline">Get Started</Button>
          </Card>
          <Card className="p-6 border-blue-500 border-2">
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-gray-600 mb-4">For professional developers</p>
            <p className="text-4xl font-bold mb-6">$19</p>
            <Button className="w-full">Get Started</Button>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
            <p className="text-gray-600 mb-4">For large teams</p>
            <p className="text-4xl font-bold mb-6">Custom</p>
            <Button className="w-full" variant="outline">Contact Us</Button>
          </Card>
        </div>
      </section>

      <footer className="mt-auto border-t py-4 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-gray-600">© 2024 Dani Github Analyzer. All rights reserved.</p>
          <div className="space-x-6">
            <Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link>
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
