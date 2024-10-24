import { Button } from "@/components/ui/button";
import { Eye, Copy, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface APIKey {
  id: string;
  name: string;
  value: string;
  usage: number;
  request_limit: number;
}

interface APIKeyRowProps {
  apiKey: APIKey;
  onEdit: (key: APIKey) => void;
  onDelete: (id: string) => void;
}

export const APIKeyRow = ({ apiKey, onEdit, onDelete }: APIKeyRowProps) => {
  const { toast } = useToast();

  const handleView = () => {
    toast({
      title: "API Key",
      description: apiKey.value,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey.value);
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
    <tr key={apiKey.id}>
      <td className="py-2">{apiKey.name}</td>
      <td>{apiKey.usage}</td>
      <td>{apiKey.value.replace(/(?<=^.{4}).*(?=.{4}$)/g, '*'.repeat(20))}</td>
      <td className="space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleView}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(apiKey)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(apiKey.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};