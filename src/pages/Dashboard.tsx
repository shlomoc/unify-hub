import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { HomeIcon, CodeIcon, FileTextIcon, ScrollTextIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <div className="flex items-center gap-2 mb-8">
          <h1 className="text-xl font-bold">Dani AI</h1>
        </div>
        
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/dashboard")}>
            <HomeIcon className="w-4 h-4" />
            Overview
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => navigate("/api-playground")}>
            <CodeIcon className="w-4 h-4" />
            API Playground
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <FileTextIcon className="w-4 h-4" />
            Invoices
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <ScrollTextIcon className="w-4 h-4" />
            Documentation
          </Button>
        </nav>

        <div className="mt-auto pt-6 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <div className="bg-purple-500 text-white w-full h-full flex items-center justify-center">
                S
              </div>
            </Avatar>
            <div>
              <p className="font-medium">steve c</p>
            </div>
          </div>
          <Button variant="destructive" className="w-full" onClick={() => navigate("/")}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Overview</h1>
          
          {/* Current Plan Card */}
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

          {/* API Keys Section */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">API Keys</h2>
              <Button>+ Create New Key</Button>
            </div>
            <p className="text-gray-600 mb-6">
              The key is used to authenticate your requests to the Research API. To learn more, see the documentation page.
            </p>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-4">NAME</th>
                  <th className="pb-4">USAGE</th>
                  <th className="pb-4">KEY</th>
                  <th className="pb-4">OPTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">git</td>
                  <td>3</td>
                  <td>dani-172*********************</td>
                  <td className="space-x-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Copy</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Delete</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;