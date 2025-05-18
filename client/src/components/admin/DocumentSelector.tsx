import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, FileText, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

// Document interface
interface Document {
  id: number;
  title: string;
  description: string | null;
  filePath: string;
  fileType: string;
  documentType: string;
}

interface DocumentSelectorProps {
  value: number[];
  onChange: (value: number[]) => void;
  disabled?: boolean;
}

export function DocumentSelector({ value, onChange, disabled = false }: DocumentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all documents
  const { data: documents, isLoading } = useQuery({
    queryKey: ["/api/documents"],
    queryFn: async () => {
      const res = await fetch(`/api/documents`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      const data = await res.json();
      return data || [];
    },
  });

  // Filter documents based on search query
  const filteredDocuments = !documents ? [] : documents.filter((doc: Document) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    doc.documentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected document details
  const selectedDocuments = !documents ? [] : documents.filter(
    (doc: Document) => value.includes(doc.id)
  );

  // Toggle document selection
  const toggleDocument = (docId: number) => {
    if (value.includes(docId)) {
      onChange(value.filter(id => id !== docId));
    } else {
      onChange([...value, docId]);
    }
  };

  // Remove a document from selection
  const removeDocument = (docId: number) => {
    onChange(value.filter(id => id !== docId));
  };

  // Get document type badge color
  const getDocumentTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'catalog':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'datasheet':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'certificate':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case 'manual':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case 'technical':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  // Get file extension from path
  const getFileExtension = (filePath: string) => {
    return filePath.split('.').pop()?.toUpperCase() || '';
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-10"
            disabled={disabled}
          >
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                <span className="text-sm text-muted-foreground mr-1 my-0.5">
                  {value.length} document{value.length > 1 ? 's' : ''} selected
                </span>
              </div>
            ) : (
              <span className="text-muted-foreground">Select documents...</span>
            )}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0">
          <Command>
            <CommandInput 
              placeholder="Search documents..." 
              className="h-9" 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>No documents found.</CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Loading documents...
                  </div>
                ) : (
                  <ScrollArea className="h-[300px]">
                    {filteredDocuments.map((doc: Document) => (
                      <CommandItem
                        key={doc.id}
                        value={doc.title}
                        onSelect={() => toggleDocument(doc.id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{doc.title}</span>
                              <div className="flex gap-1">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs px-1 py-0 h-5 ${getDocumentTypeBadgeColor(doc.documentType)}`}
                                >
                                  {doc.documentType}
                                </Badge>
                                <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                                  {getFileExtension(doc.filePath)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Check
                            className={`h-4 w-4 ${
                              value.includes(doc.id) ? "opacity-100" : "opacity-0"
                            }`}
                          />
                        </div>
                      </CommandItem>
                    ))}
                  </ScrollArea>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedDocuments.map((doc: Document) => (
            <Badge
              key={doc.id}
              variant="secondary"
              className="flex items-center gap-1 pl-2 pr-1 py-1 h-auto"
            >
              <FileText className="h-3 w-3 mr-1" />
              <span className="max-w-[200px] truncate">{doc.title}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => removeDocument(doc.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}