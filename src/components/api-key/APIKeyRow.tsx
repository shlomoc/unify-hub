import { Button } from "@/components/ui/button";
import { Eye, Copy, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

/**
 * Interface representing an API key with its properties.
 */
interface APIKey {
  id: string;
  name: string;
  value: string;
  usage: number;
  request_limit: number;
}

/**
 * Props for the APIKeyRow component.
 */
interface APIKeyRowProps {
  apiKey: APIKey;
  onEdit: (key: APIKey) => void;
  onDelete: (id: string) => void;
}

/**
 * Component that displays a single API key row with actions.
 * 
 * @component
 * @param {APIKeyRowProps} props - The component props.
 * @returns {JSX.Element} A table row containing API key information and action buttons.
 */
export const APIKeyRow = ({ apiKey, onEdit, onDelete }: APIKeyRowProps) => {
  const { toast } = useToast();

  /**
   * Handles the view action for the API key.
   * Shows the full API key value in a toast message.
   */
  const handleView = () => {
    toast({
      title: "API Key",
      description: apiKey.value,
      duration: 5000,
    });
  };

  /**
   * Handles copying the API key to clipboard.
   * Shows a success or error toast based on the operation result.
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey.value);
      toast({
        title: "Success",
        description: "API key copied to clipboard",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy API key",
        variant: "destructive",
        duration: 3000,
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