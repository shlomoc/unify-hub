import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { APIKeyRow } from "./api-key/APIKeyRow";
import { CreateKeyDialog } from "./api-key/CreateKeyDialog";

interface APIKey {
  id: string;
  name: string;
  value: string;
  usage: number;
  request_limit: number;
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
        request_limit: parseInt(newKeyLimit),
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">API Keys</h2>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Key
        </Button>
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
                <APIKeyRow
                  key={key.id}
                  apiKey={key}
                  onEdit={(key) => {
                    setEditingKey(key);
                    setIsEditOpen(true);
                  }}
                  onDelete={handleDeleteKey}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CreateKeyDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        newKeyName={newKeyName}
        setNewKeyName={setNewKeyName}
        newKeyLimit={newKeyLimit}
        setNewKeyLimit={setNewKeyLimit}
        onCreateKey={handleCreateKey}
      />

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