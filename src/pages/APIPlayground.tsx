import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Sidebar } from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";
import { fetchReadmeContent } from "@/utils/github";

const APIPlayground = () => {
  const [apiKey, setApiKey] = useState("");
  const [githubUrl, setGithubUrl] = useState("https://github.com/emarco177/dandi");
  const [response, setResponse] = useState<string>("");
  const { toast } = useToast();

  const validateApiKey = async (key: string) => {
    const { data, error } = await supabase
      .from('api_key')
      .select('value, usage, request_limit')
      .eq('value', key)
      .single();
    
    if (error) {
      console.error('Error validating API key:', error);
      return { isValid: false, isRateLimited: false };
    }
    
    if (!data) {
      return { isValid: false, isRateLimited: false };
    }

    // Check if usage exceeds limit
    if (data.usage >= data.request_limit) {
      return { isValid: true, isRateLimited: true };
    }
    
    return { isValid: true, isRateLimited: false };
  };

  const incrementUsageCount = async (key: string) => {
    const { data: currentData, error: fetchError } = await supabase
      .from('api_key')
      .select('usage')
      .eq('value', key)
      .single();

    if (fetchError) {
      console.error('Error fetching current usage:', fetchError);
      return;
    }

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

    const { isValid, isRateLimited } = await validateApiKey(apiKey);
    
    if (!isValid) {
      toast({
        title: "Error",
        description: "Invalid API key",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (isRateLimited) {
      toast({
        title: "Rate Limit Exceeded",
        description: "You have reached your API request limit",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      const readmeContent = await fetchReadmeContent(githubUrl);
      setResponse(readmeContent);
      await incrementUsageCount(apiKey);
      
      toast({
        title: "Success",
        description: "Repository README fetched successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch repository data",
        variant: "destructive",
        duration: 3000,
      });
    }
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