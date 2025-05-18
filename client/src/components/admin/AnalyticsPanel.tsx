import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Clock, FileBarChart, FileBarChart2, PieChart, ShoppingBag, TrendingUp } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Chart components
function BarChartComponent({ data, labels }: { data: number[], labels: string[] }) {
  const maxValue = Math.max(...data);
  
  return (
    <div className="w-full h-64 flex items-end justify-between gap-1 p-4">
      {data.map((value, index) => {
        const height = value > 0 ? (value / maxValue) * 100 : 0;
        
        return (
          <div key={index} className="flex flex-col items-center gap-2 w-full">
            <div className="relative w-full">
              <div 
                className="w-full bg-primary/20 rounded-t-sm" 
                style={{ height: `${height}%` }}
              >
                <div className="absolute bottom-0 w-full bg-primary rounded-t-sm transition-all duration-500" 
                  style={{ height: `${height}%` }} 
                />
              </div>
            </div>
            <span className="text-xs text-center w-full truncate" title={labels[index]}>
              {labels[index]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PieChartComponent({ data, labels, colors }: { data: number[], labels: string[], colors: string[] }) {
  const total = data.reduce((acc, val) => acc + val, 0);
  const segments: { percent: number, color: string, label: string, value: number }[] = [];
  
  let cumulativePercent = 0;
  data.forEach((value, index) => {
    const percent = total > 0 ? (value / total) * 100 : 0;
    segments.push({
      percent,
      color: colors[index % colors.length],
      label: labels[index],
      value
    });
    cumulativePercent += percent;
  });
  
  return (
    <div className="relative w-48 h-48 mx-auto">
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
        {segments.map((segment, index) => {
          const dashArray = 2 * Math.PI * 70;
          const dashOffset = dashArray * (1 - segment.percent / 100);
          
          return (
            <svg 
              key={index}
              className="absolute inset-0 -rotate-90"
              width="100%" 
              height="100%"
              viewBox="0 0 160 160"
            >
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="transparent"
                stroke={segment.color}
                strokeWidth="20"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                transform={`rotate(${index > 0 ? segments.slice(0, index).reduce((acc, s) => acc + s.percent * 3.6, 0) : 0} 80 80)`}
              />
            </svg>
          );
        })}
        <div className="relative z-10 text-center">
          <div className="text-2xl font-bold">{total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: segment.color }} />
            <div className="text-xs">
              <span className="font-medium">{segment.label}</span> ({segment.value})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsPanel() {
  const [activeChart, setActiveChart] = useState<'categories' | 'status'>('categories');
  
  // Fetch products for analytics
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products?language=en");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    }
  });
  
  // Calculate analytics data
  const analytics = {
    totalProducts: products?.length || 0,
    byCategory: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    recentlyAdded: products?.length > 0 ? products[products.length - 1] : null
  };
  
  // Process data for charts
  if (products && products.length > 0) {
    products.forEach((product: any) => {
      // Count by category
      if (!analytics.byCategory[product.category]) {
        analytics.byCategory[product.category] = 0;
      }
      analytics.byCategory[product.category]++;
      
      // Count by status
      if (!analytics.byStatus[product.status || "in stock"]) {
        analytics.byStatus[product.status || "in stock"] = 0;
      }
      analytics.byStatus[product.status || "in stock"]++;
    });
  }
  
  // Bar chart data
  const categoryData = {
    values: Object.values(analytics.byCategory),
    labels: Object.keys(analytics.byCategory)
  };
  
  // Pie chart data
  const statusData = {
    values: Object.values(analytics.byStatus),
    labels: Object.keys(analytics.byStatus),
    colors: [
      '#3b82f6', // blue - in stock
      '#f97316', // orange - on request
      '#84cc16', // green - limited
      '#ef4444'  // red - discontinued
    ]
  };
  
  // Get stat card data
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'in stock':
        return 'text-blue-600';
      case 'on request':
        return 'text-orange-600';
      case 'limited':
        return 'text-lime-600';
      case 'discontinued':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  };
  
  // Placeholder data for when we have no products
  const placeholderCategoryData = {
    values: [0],
    labels: ["No data"]
  };
  
  const placeholderStatusData = {
    values: [1],
    labels: ["No data"],
    colors: ['#e5e7eb']
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileBarChart className="h-5 w-5" />
            Analytics
          </CardTitle>
          <CardDescription>
            Loading product analytics...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full mb-4"></div>
              <div className="h-2 bg-slate-200 rounded w-24 mb-2.5"></div>
              <div className="h-2 bg-slate-200 rounded w-32"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileBarChart className="h-5 w-5" />
          Analytics Dashboard
        </CardTitle>
        <CardDescription>
          Overview of your product catalog statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total Products Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Products
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {analytics.totalProducts}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Category Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Categories
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {Object.keys(analytics.byCategory).length}
                  </h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recently Added Card */}
          <Card>
            <CardContent className="p-6">
              {analytics.recentlyAdded ? (
                <div className="flex justify-between items-start">
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-muted-foreground">
                      Recently Added
                    </p>
                    <h3 className="text-base font-bold mt-1 truncate" title={analytics.recentlyAdded.title}>
                      {analytics.recentlyAdded.title}
                    </h3>
                    <p className={`text-xs ${getStatusColorClass(analytics.recentlyAdded.status || 'in stock')}`}>
                      {analytics.recentlyAdded.status || 'in stock'}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Recently Added
                    </p>
                    <h3 className="text-base font-bold mt-1">
                      No products yet
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="relative">
          <Tabs value={activeChart} onValueChange={(v) => setActiveChart(v as 'categories' | 'status')}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="categories">By Category</TabsTrigger>
                <TabsTrigger value="status">By Status</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="categories" className="mt-0">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">Products by Category</CardTitle>
                  <CardDescription>
                    Distribution of products across different categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.totalProducts > 0 ? (
                    <BarChartComponent 
                      data={categoryData.values} 
                      labels={categoryData.labels}
                    />
                  ) : (
                    <BarChartComponent 
                      data={placeholderCategoryData.values} 
                      labels={placeholderCategoryData.labels}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="status" className="mt-0">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="text-lg">Products by Status</CardTitle>
                  <CardDescription>
                    Distribution of products by availability status
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center py-6">
                  {analytics.totalProducts > 0 ? (
                    <PieChartComponent 
                      data={statusData.values} 
                      labels={statusData.labels} 
                      colors={statusData.colors}
                    />
                  ) : (
                    <PieChartComponent 
                      data={placeholderStatusData.values} 
                      labels={placeholderStatusData.labels} 
                      colors={placeholderStatusData.colors}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Data is updated in real-time. Last refresh: {new Date().toLocaleTimeString()}
        </p>
      </CardFooter>
    </Card>
  );
}