import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Copy, Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface APIKey {
  id: string;
  name: string;
  value: string;
  usage: number;
  limit: number;
}

export const APIKeyManager = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyLimit, setNewKeyLimit] = useState("");
  const [editingKey, setEditingKey] = useState<APIKey | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      const { data, error } = await supabase
        .from('api_key')
        .select('*')
        .eq('user_id', session.session?.user.id);
      
      if (error) throw error;
      return data as APIKey[];
    }
  });

  const handleCreateKey = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const newKey = `dani-${Math.random().toString(36).substring(2, 15)}`;
      
      const { error } = await supabase.from('api_key').insert({
        name: newKeyName,
        value: newKey,
        usage: 0,
        limit: parseInt(newKeyLimit),
        user_id: session.session?.user.id
      });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setIsCreateOpen(false);
      setNewKeyName("");
      setNewKeyLimit("");
      
      toast({
        title: "Success",
        description: "API key created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    }
  };

  const handleEditKey = async () => {
    if (!editingKey) return;
    
    try {
      const { error } = await supabase
        .from('api_key')
        .update({ name: editingKey.name })
        .eq('id', editingKey.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setIsEditOpen(false);
      setEditingKey(null);
      
      toast({
        title: "Success",
        description: "API key updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update API key",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_key')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      
      toast({
        title: "Success",
        description: "API key deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Success",
        description: "API key copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy API key",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">API Keys</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new API key</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label>Key Name</label>
                <Input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Enter key name"
                />
              </div>
              <div className="space-y-2">
                <label>Key Limit</label>
                <Input
                  type="number"
                  value={newKeyLimit}
                  onChange={(e) => setNewKeyLimit(e.target.value)}
                  placeholder="Enter key limit"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateKey}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-4">NAME</th>
                <th className="pb-4">USAGE</th>
                <th className="pb-4">KEY</th>
                <th className="pb-4">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys?.map((key) => (
                <tr key={key.id}>
                  <td className="py-2">{key.name}</td>
                  <td>{key.usage}</td>
                  <td>{key.value.replace(/(?<=^.{4}).*(?=.{4}$)/g, '*'.repeat(20))}</td>
                  <td className="space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "API Key",
                          description: key.value,
                        });
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(key.value)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingKey(key);
                        setIsEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteKey(key.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label>Key Name</label>
              <Input
                value={editingKey?.name || ""}
                onChange={(e) => setEditingKey(editingKey ? { ...editingKey, name: e.target.value } : null)}
                placeholder="Enter key name"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditKey}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};