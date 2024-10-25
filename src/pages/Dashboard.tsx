import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/Sidebar";
import { APIKeyManager } from "@/components/APIKeyManager";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const { data: usageData } = useQuery({
    queryKey: ['api-usage'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      const { data, error } = await supabase
        .from('api_key')
        .select('usage, request_limit')
        .eq('user_id', session.session?.user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const usage = usageData?.usage || 0;
  const limit = usageData?.request_limit || 1000;
  const usagePercentage = (usage / limit) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Overview</h1>
          
          <Card className="mb-8 p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm mb-2">CURRENT PLAN</p>
                <h2 className="text-2xl font-bold mb-4">Dani API</h2>
                <p className="text-sm mb-1">API Limit</p>
                <p>{usage} / {limit} Requests</p>
              </div>
              <Button variant="secondary" className="text-black">
                Manage Plan
              </Button>
            </div>
            <Progress value={usagePercentage} className="bg-white/20" />
          </Card>

          <div className="bg-white rounded-lg p-6">
            <APIKeyManager />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;