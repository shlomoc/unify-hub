import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/Sidebar";
import { APIKeyManager } from "@/components/APIKeyManager";

const Dashboard = () => {
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
                <p>24 / 1,000 Requests</p>
              </div>
              <Button variant="secondary" className="text-black">
                Manage Plan
              </Button>
            </div>
            <Progress value={24} className="bg-white/20" />
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