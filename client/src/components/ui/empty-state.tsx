import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  FileQuestion, 
  FolderOpen, 
  Inbox, 
  LayoutList, 
  Package, 
  Search, 
  User, 
  Users 
} from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: "data" | "search" | "user" | "product" | "folder" | "file" | "users" | "list";
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({ 
  title, 
  description, 
  icon = "data", 
  action, 
  className 
}: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case "search":
        return <Search className="h-12 w-12" />;
      case "user":
        return <User className="h-12 w-12" />;
      case "users":
        return <Users className="h-12 w-12" />;
      case "product":
        return <Package className="h-12 w-12" />;
      case "folder":
        return <FolderOpen className="h-12 w-12" />;
      case "file":
        return <FileQuestion className="h-12 w-12" />;
      case "list":
        return <LayoutList className="h-12 w-12" />;
      case "data":
      default:
        return <Inbox className="h-12 w-12" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50",
        className
      )}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        {getIcon()}
      </div>
      <h3 className="mt-6 text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground max-w-md">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}