import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Sidebar } from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

const APIPlayground = () => {
  const [apiKey, setApiKey] = useState("");
  const [githubUrl, setGithubUrl] = useState("https://github.com/emarco177/dandi");
  const [response, setResponse] = useState<string>("");
  const { toast } = useToast();

  const validateApiKey = async (key: string) => {
    const { data, error } = await supabase
      .from('api_key')
      .select('value')
      .eq('value', key);
    
    if (error) {
      console.error('Error validating API key:', error);
      return false;
    }
    
    return data && data.length > 0;
  };

  const incrementUsageCount = async (key: string) => {
    // First get the current usage count
    const { data: currentData, error: fetchError } = await supabase
      .from('api_key')
      .select('usage')
      .eq('value', key)
      .single();

    if (fetchError) {
      console.error('Error fetching current usage:', fetchError);
      return;
    }

    // Then increment it by 1
    const { error: updateError } = await supabase
      .from('api_key')
      .update({ usage: (currentData?.usage || 0) + 1 })
      .eq('value', key);

    if (updateError) {
      console.error('Error incrementing usage count:', updateError);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim() || !githubUrl.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const isValidKey = await validateApiKey(apiKey);
    if (!isValidKey) {
      toast({
        title: "Error",
        description: "Invalid API key",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Mock response for now
    const mockResponse = {
      summary: "Dandi API is a comprehensive boilerplate repository for building AI-powered micro SaaS applications.",
      cool_facts: [
        "The project was developed using Cursor IDE and v0.",
        "It leverages LangChain JS for AI capabilities."
      ],
      stars: 10,
      latestVersion: "No releases found",
      websiteUrl: "https://www.dandi.cloud",
      licenseType: "Apache-2.0"
    };

    setResponse(JSON.stringify(mockResponse, null, 2));
    await incrementUsageCount(apiKey);
    
    toast({
      title: "Success",
      description: "Repository analysis completed",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">API Playground</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-32">Submit</Button>
          </form>

          {response && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Response</h2>
              <Card className="p-4 bg-gray-50">
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  {response}
                </pre>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default APIPlayground;