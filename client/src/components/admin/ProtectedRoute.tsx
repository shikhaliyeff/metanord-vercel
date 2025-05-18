import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Route, Redirect } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  adminOnly?: boolean;
}

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = true
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  
  // Force a refresh of admin data when user is authenticated
  // Always call hooks unconditionally at the top level
  useEffect(() => {
    if (user && user.isAdmin) {
      // Refresh admin data in the background
      fetch("/api/admin/me", { credentials: "include" })
        .catch(err => console.error("Error refreshing auth:", err));
    }
  }, [user]);

  if (loading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user || (adminOnly && !user.isAdmin)) {
    return (
      <Route path={path}>
        <Redirect to="/admin/login" />
      </Route>
    );
  }
  
  // Use Route with children pattern instead of component prop to avoid TypeScript errors
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}