import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/ui/empty-state";
import { motion } from "framer-motion";
import { Info, Plus, Settings, User } from "lucide-react";

export default function UXDemoPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("notifications");

  const showToast = (variant: "default" | "destructive") => {
    toast({
      title: variant === "default" ? "Success!" : "Error!",
      description: variant === "default" 
        ? "Your action was completed successfully." 
        : "Something went wrong. Please try again.",
      variant,
    });
  };

  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>MetaNord UX Components Demo</CardTitle>
            <CardDescription>
              A showcase of new UI/UX improvements for the admin console
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="theme">Theme Toggle</TabsTrigger>
                <TabsTrigger value="toasts">Toast Notifications</TabsTrigger>
                <TabsTrigger value="tooltips">Tooltips</TabsTrigger>
                <TabsTrigger value="empty-states">Empty States</TabsTrigger>
              </TabsList>
              
              <TabsContent value="theme" className="space-y-4">
                <div className="flex flex-col items-center justify-center p-10 space-y-6 border rounded-lg">
                  <h3 className="text-xl font-semibold">Theme Toggle</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Allow users to switch between light and dark themes based on their preference.
                  </p>
                  <ThemeToggle />
                </div>
              </TabsContent>
              
              <TabsContent value="toasts" className="space-y-4">
                <div className="flex flex-col items-center justify-center p-10 space-y-6 border rounded-lg">
                  <h3 className="text-xl font-semibold">Toast Notifications</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Provide elegant, animated feedback for user actions with toast notifications.
                  </p>
                  <div className="flex space-x-4">
                    <Button onClick={() => showToast("default")}>Show Success Toast</Button>
                    <Button variant="destructive" onClick={() => showToast("destructive")}>
                      Show Error Toast
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tooltips" className="space-y-4">
                <div className="flex flex-col items-center justify-center p-10 space-y-6 border rounded-lg">
                  <h3 className="text-xl font-semibold">Enhanced Tooltips</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Provide additional context and information with animated tooltips.
                  </p>
                  <div className="flex space-x-6">
                    <TooltipWrapper content="User settings and preferences">
                      <Button variant="outline" size="icon">
                        <User className="h-4 w-4" />
                      </Button>
                    </TooltipWrapper>
                    
                    <TooltipWrapper 
                      content="Configuration options for the admin console" 
                      side="bottom"
                    >
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TooltipWrapper>
                    
                    <TooltipWrapper 
                      content="Important information about this feature" 
                      side="right"
                    >
                      <Button variant="outline" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipWrapper>
                    
                    <TooltipWrapper 
                      content="Add a new item to the collection" 
                      side="left"
                    >
                      <Button variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipWrapper>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="empty-states" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <EmptyState
                    title="No Data Found"
                    description="There are no items to display at this time. Create your first item to get started."
                    icon="data"
                    action={{
                      label: "Create Item",
                      onClick: () => toast({ title: "Create new item clicked" })
                    }}
                  />
                  
                  <EmptyState
                    title="No Search Results"
                    description="We couldn't find any matches for your search. Try adjusting your search terms."
                    icon="search"
                  />
                  
                  <EmptyState
                    title="No Products"
                    description="No products have been added yet. Start by adding your first product."
                    icon="product"
                    action={{
                      label: "Add Product",
                      onClick: () => toast({ title: "Add product clicked" })
                    }}
                  />
                  
                  <EmptyState
                    title="No Users"
                    description="There are no users in the system. Invite team members to collaborate."
                    icon="users"
                    action={{
                      label: "Invite Users",
                      onClick: () => toast({ title: "Invite users clicked" })
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              These components improve the user experience in the MetaNord admin console.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}