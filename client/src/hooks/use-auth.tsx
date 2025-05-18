import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginAdmin: (username: string, password: string) => Promise<{success: boolean, message?: string}>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in with improved error handling
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        
        // Enhanced fetch with better logging and cache control
        const res = await fetch("/api/admin/me", {
          method: "GET",
          headers: {
            "Accept": "application/json"
          },
          credentials: "include", // Include credentials (cookies) with the request
          cache: "no-cache" // Prevent caching issues
        });
        
        console.log("Auth check response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("Auth check successful:", data.user ? data.user.username : "No user");
          
          if (data.success && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          console.log("Auth check failed:", res.status);
          setUser(null);
        }
      } catch (error) {
        // Log error but still set user to null
        console.error("Authentication check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function with significantly enhanced session handling and verification
  const loginAdmin = async (username: string, password: string): Promise<{success: boolean, message?: string}> => {
    try {
      console.log("Attempting to login with username:", username);
      
      // Send login request with proper credentials handling
      console.log("Sending login request to:", "/api/admin/login");
      
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // This is critical for cookie authentication
        cache: "no-cache" // Prevent caching of auth requests
      });
      
      // Check session header for debugging
      const sessionCreated = res.headers.get("X-Session-Created");
      console.log("Login response status:", res.status, "Session created:", sessionCreated);
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Login failed:", data);
        return { 
          success: false, 
          message: data.message || "Invalid username or password" 
        };
      }
      
      if (data.success && data.user) {
        console.log("Login successful, user data:", data.user);
        setUser(data.user);
        
        // Immediately verify session is working with an authentication check
        try {
          console.log("Verifying session with immediate auth check");
          const verifyRes = await fetch("/api/admin/me", {
            method: "GET",
            credentials: "include",
            cache: "no-cache",
            headers: { "Accept": "application/json" }
          });
          
          const verifyData = await verifyRes.json();
          console.log("Session verification result:", 
            verifyRes.status, 
            verifyData.success ? "Success" : "Failed"
          );
        } catch (verifyError) {
          console.warn("Session verification error:", verifyError);
          // Continue despite verification error
        }
        
        // Force a refresh of all admin data after successful login
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0].toString().startsWith('/api/admin'),
        });
        
        return { success: true };
      }
      
      return { 
        success: false, 
        message: "Unexpected response from server" 
      };
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "There was a problem connecting to the server.",
        variant: "destructive",
      });
      return { 
        success: false, 
        message: "There was a problem connecting to the server" 
      };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await apiRequest("POST", "/api/admin/logout");
      setUser(null);
      // Clear any cached admin data
      queryClient.invalidateQueries({ queryKey: ["/api/admin"] });
    } catch (error) {
      toast({
        title: "Logout error",
        description: "There was a problem logging out.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}