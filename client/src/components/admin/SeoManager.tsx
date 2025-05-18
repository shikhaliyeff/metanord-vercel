import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2, Search, FileCode, CheckCircle, Info, AlertTriangle, RefreshCw, Globe, FileText, PlusCircle } from 'lucide-react';

export function SeoManager() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [language, setLanguage] = useState<string>(i18n.language || 'en');
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Fetch all SEO settings
  const { data: seoSettings, isLoading: isLoadingSeo } = useQuery({
    queryKey: ['/api/admin/seo', language],
    queryFn: async () => {
      const response = await fetch(`/api/admin/seo?language=${language}`);
      if (!response.ok) {
        throw new Error('Failed to fetch SEO settings');
      }
      return response.json();
    }
  });

  // Mutation to generate sitemap
  const generateSitemapMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await apiRequest('POST', '/api/admin/seo/sitemap-generate');
      if (!response.ok) {
        throw new Error('Failed to generate sitemap');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Sitemap and robots.txt generated successfully',
        variant: 'default',
      });
      setIsGenerating(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to generate sitemap: ${error.message}`,
        variant: 'destructive',
      });
      setIsGenerating(false);
    }
  });

  // Helper to find a specific page's SEO settings
  const getPageSeoSettings = (pagePath: string) => {
    if (!seoSettings) return null;
    return seoSettings.find((setting: any) => setting.pagePath === pagePath);
  };

  // Mutation to update SEO settings
  const updateSeoSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/admin/seo', data);
      if (!response.ok) {
        throw new Error('Failed to update SEO settings');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'SEO settings updated successfully',
        variant: 'default',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/seo'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update SEO settings: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Handle form submission
  const handleUpdateSeo = (pagePath: string, formData: FormData) => {
    const data = {
      pagePath,
      language,
      title: formData.get('title') as string,
      metaDescription: formData.get('metaDescription') as string,
      ogTitle: formData.get('ogTitle') as string,
      ogDescription: formData.get('ogDescription') as string,
      ogImage: formData.get('ogImage') as string,
    };
    
    updateSeoSettingsMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>SEO Manager - MetaNord Admin</title>
      </Helmet>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Manager</h1>
          <p className="text-muted-foreground">
            Optimize your website for search engines and social media
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="language">Language:</Label>
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="et">Estonian</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="lv">Latvian</SelectItem>
                <SelectItem value="lt">Lithuanian</SelectItem>
                <SelectItem value="pl">Polish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="default" 
            onClick={() => generateSitemapMutation.mutate()}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Sitemap
              </>
            )}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global SEO Settings</CardTitle>
              <CardDescription>
                Configure global SEO settings that apply to the entire website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingSeo ? (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <form id="global-seo-form" className="space-y-4" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleUpdateSeo('global', formData);
                }}>
                  <div className="space-y-2">
                    <Label htmlFor="title">Default Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="MetaNord - European Infrastructure Solutions"
                      defaultValue={getPageSeoSettings('global')?.title || ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Default Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      name="metaDescription"
                      placeholder="MetaNord provides high-quality infrastructure products and solutions..."
                      defaultValue={getPageSeoSettings('global')?.metaDescription || ''}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended length: 150-160 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ogTitle">Default OG Title</Label>
                    <Input
                      id="ogTitle"
                      name="ogTitle"
                      placeholder="MetaNord - Premium Infrastructure Products"
                      defaultValue={getPageSeoSettings('global')?.ogTitle || ''}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ogDescription">Default OG Description</Label>
                    <Textarea
                      id="ogDescription"
                      name="ogDescription"
                      placeholder="Premium aluminum profiles and infrastructure products for European markets..."
                      defaultValue={getPageSeoSettings('global')?.ogDescription || ''}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ogImage">Default OG Image URL</Label>
                    <Input
                      id="ogImage"
                      name="ogImage"
                      placeholder="/og-image.jpg"
                      defaultValue={getPageSeoSettings('global')?.ogImage || ''}
                    />
                  </div>
                </form>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                form="global-seo-form"
                disabled={isLoadingSeo || updateSeoSettingsMutation.isPending}
              >
                {updateSeoSettingsMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save Global Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sitemap & Robots.txt</CardTitle>
              <CardDescription>
                Configure and generate your sitemap and robots.txt files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>About Sitemaps</AlertTitle>
                <AlertDescription>
                  Sitemaps help search engines discover and index your content. 
                  The sitemap is automatically generated based on your website structure.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="rounded-md border p-4">
                    <div className="mb-2 font-medium">sitemap.xml</div>
                    <div className="text-sm text-muted-foreground">
                      A structured XML file that lists all your website's URLs with additional metadata.
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/sitemap.xml', '_blank')}
                        className="w-full"
                      >
                        <FileCode className="mr-2 h-4 w-4" />
                        View Sitemap
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="rounded-md border p-4">
                    <div className="mb-2 font-medium">robots.txt</div>
                    <div className="text-sm text-muted-foreground">
                      A text file that tells search engine crawlers which pages to index or not index.
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/robots.txt', '_blank')}
                        className="w-full"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Robots.txt
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => generateSitemapMutation.mutate()}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Files
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="pages" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page-Specific SEO</CardTitle>
              <CardDescription>
                Configure SEO settings for individual pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingSeo ? (
                <div className="flex items-center justify-center p-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Home Page */}
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Home Page</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <form id="home-seo-form" className="space-y-3" onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          handleUpdateSeo('/', formData);
                        }}>
                          <div className="space-y-1">
                            <Label htmlFor="home-title" className="text-xs">Title</Label>
                            <Input
                              id="home-title"
                              name="title"
                              placeholder="MetaNord - Home"
                              defaultValue={getPageSeoSettings('/')?.title || ''}
                              className="h-8 text-sm"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="home-metaDescription" className="text-xs">Meta Description</Label>
                            <Textarea
                              id="home-metaDescription"
                              name="metaDescription"
                              placeholder="MetaNord homepage description..."
                              defaultValue={getPageSeoSettings('/')?.metaDescription || ''}
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          type="submit"
                          form="home-seo-form"
                          size="sm"
                          className="w-full"
                        >
                          <CheckCircle className="mr-2 h-3 w-3" />
                          Save
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    {/* Products Page */}
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Products Page</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <form id="products-seo-form" className="space-y-3" onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          handleUpdateSeo('/products', formData);
                        }}>
                          <div className="space-y-1">
                            <Label htmlFor="products-title" className="text-xs">Title</Label>
                            <Input
                              id="products-title"
                              name="title"
                              placeholder="Products - MetaNord"
                              defaultValue={getPageSeoSettings('/products')?.title || ''}
                              className="h-8 text-sm"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="products-metaDescription" className="text-xs">Meta Description</Label>
                            <Textarea
                              id="products-metaDescription"
                              name="metaDescription"
                              placeholder="Explore MetaNord's product catalog..."
                              defaultValue={getPageSeoSettings('/products')?.metaDescription || ''}
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          type="submit"
                          form="products-seo-form"
                          size="sm"
                          className="w-full"
                        >
                          <CheckCircle className="mr-2 h-3 w-3" />
                          Save
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    {/* About Page */}
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">About Page</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <form id="about-seo-form" className="space-y-3" onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          handleUpdateSeo('/about', formData);
                        }}>
                          <div className="space-y-1">
                            <Label htmlFor="about-title" className="text-xs">Title</Label>
                            <Input
                              id="about-title"
                              name="title"
                              placeholder="About Us - MetaNord"
                              defaultValue={getPageSeoSettings('/about')?.title || ''}
                              className="h-8 text-sm"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="about-metaDescription" className="text-xs">Meta Description</Label>
                            <Textarea
                              id="about-metaDescription"
                              name="metaDescription"
                              placeholder="Learn about MetaNord's history and mission..."
                              defaultValue={getPageSeoSettings('/about')?.metaDescription || ''}
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          type="submit"
                          form="about-seo-form"
                          size="sm"
                          className="w-full"
                        >
                          <CheckCircle className="mr-2 h-3 w-3" />
                          Save
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    {/* Contact Page */}
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Contact Page</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <form id="contact-seo-form" className="space-y-3" onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          handleUpdateSeo('/contact', formData);
                        }}>
                          <div className="space-y-1">
                            <Label htmlFor="contact-title" className="text-xs">Title</Label>
                            <Input
                              id="contact-title"
                              name="title"
                              placeholder="Contact Us - MetaNord"
                              defaultValue={getPageSeoSettings('/contact')?.title || ''}
                              className="h-8 text-sm"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="contact-metaDescription" className="text-xs">Meta Description</Label>
                            <Textarea
                              id="contact-metaDescription"
                              name="metaDescription"
                              placeholder="Get in touch with MetaNord's team..."
                              defaultValue={getPageSeoSettings('/contact')?.metaDescription || ''}
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          type="submit"
                          form="contact-seo-form"
                          size="sm" 
                          className="w-full"
                        >
                          <CheckCircle className="mr-2 h-3 w-3" />
                          Save
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    {/* Projects Page */}
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">Projects Page</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <form id="projects-seo-form" className="space-y-3" onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.currentTarget);
                          handleUpdateSeo('/projects', formData);
                        }}>
                          <div className="space-y-1">
                            <Label htmlFor="projects-title" className="text-xs">Title</Label>
                            <Input
                              id="projects-title"
                              name="title"
                              placeholder="Our Projects - MetaNord"
                              defaultValue={getPageSeoSettings('/projects')?.title || ''}
                              className="h-8 text-sm"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <Label htmlFor="projects-metaDescription" className="text-xs">Meta Description</Label>
                            <Textarea
                              id="projects-metaDescription"
                              name="metaDescription"
                              placeholder="Explore MetaNord's featured projects and case studies..."
                              defaultValue={getPageSeoSettings('/projects')?.metaDescription || ''}
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                        </form>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button 
                          type="submit"
                          form="projects-seo-form"
                          size="sm"
                          className="w-full"
                        >
                          <CheckCircle className="mr-2 h-3 w-3" />
                          Save
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    {/* Add More Pages Card */}
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <PlusCircle className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-center text-sm text-muted-foreground">
                          Add SEO settings for custom pages and routes
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-4"
                          onClick={() => setActiveTab('advanced')}
                        >
                          Add More Pages
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced SEO Settings</CardTitle>
              <CardDescription>
                Configure structured data, canonical URLs, and other advanced SEO features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 border-amber-500 text-amber-800 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Advanced Settings</AlertTitle>
                <AlertDescription>
                  These settings provide fine-grained control over your site's SEO. Incorrect configurations may negatively impact your search rankings.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-medium">Structured Data</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Structured data helps search engines understand your content better and can enable rich results in search listings.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div className="font-medium">Organization Schema</div>
                        <div className="text-sm text-muted-foreground">
                          Add organization information (logo, social profiles, contact details)
                        </div>
                      </div>
                      <Switch id="organization-schema" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div className="font-medium">Product Schema</div>
                        <div className="text-sm text-muted-foreground">
                          Add product details (name, description, images) for product pages
                        </div>
                      </div>
                      <Switch id="product-schema" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div className="font-medium">Breadcrumb Schema</div>
                        <div className="text-sm text-muted-foreground">
                          Enable breadcrumb navigation in search results
                        </div>
                      </div>
                      <Switch id="breadcrumb-schema" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="mb-2 text-lg font-medium">Custom URL Settings</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Configure custom URLs and path handling for improved SEO performance.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div className="font-medium">Use Pretty URLs</div>
                        <div className="text-sm text-muted-foreground">
                          Convert product IDs to URL-friendly slugs (e.g., "/product/aluminum-t-profile")
                        </div>
                      </div>
                      <Switch id="pretty-urls" />
                    </div>
                    
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div className="font-medium">Automatic Canonical Tags</div>
                        <div className="text-sm text-muted-foreground">
                          Automatically generate canonical URLs for all pages
                        </div>
                      </div>
                      <Switch id="canonical-tags" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Advanced Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}