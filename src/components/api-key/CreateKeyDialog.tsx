import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * Props for the CreateKeyDialog component.
 */
interface CreateKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  newKeyLimit: string;
  setNewKeyLimit: (limit: string) => void;
  onCreateKey: () => void;
}

/**
 * Dialog component for creating a new API key.
 * 
 * @component
 * @param {CreateKeyDialogProps} props - The component props.
 * @returns {JSX.Element} A dialog for creating new API keys.
 */
export const CreateKeyDialog = ({
  isOpen,
  onOpenChange,
  newKeyName,
  setNewKeyName,
  newKeyLimit,
  setNewKeyLimit,
  onCreateKey,
}: CreateKeyDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            <label>Request Limit</label>
            <Input
              type="number"
              value={newKeyLimit}
              onChange={(e) => setNewKeyLimit(e.target.value)}
              placeholder="Enter request limit"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreateKey}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};