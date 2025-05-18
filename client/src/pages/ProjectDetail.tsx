import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Tag, 
  Download, 
  Share2 
} from "lucide-react";
import MetaTags from "@/components/seo/MetaTags";
import SchemaOrg from "@/components/seo/SchemaOrg";
import { useLanguage } from "@/hooks/use-language";

export default function ProjectDetail() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const params = useParams();
  const [, setLocation] = useLocation();
  const projectId = params.id;

  // Fetch project data
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  const project = data?.project;

  // Get translatable field
  const getLocalizedField = (field: string) => {
    if (!project || !project[field]) return "";
    return project[field][language] || project[field]["en"] || "";
  };

  // Get tags
  const getTags = () => {
    if (!project || !project.tags || !project.tags[language]) {
      return project?.tags?.en || [];
    }
    return project.tags[language];
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container py-12 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">{t("projects.projectNotFound")}</h2>
        <p className="mb-8 text-muted-foreground">{t("projects.projectNotFoundDescription")}</p>
        <Button onClick={() => setLocation("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("projects.backToProjects")}
        </Button>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={`${getLocalizedField("title")} - ${t("projects.metaTitle")}`}
        description={getLocalizedField("shortDescription")}
        ogImage={project.featuredImage}
        ogType="article"
        publishedTime={project.publishDate}
        modifiedTime={project.lastUpdated}
        keywords={`${project.category}, projects, MetaNord case studies`}
      />
      
      <SchemaOrg 
        type="article"
        title={getLocalizedField("title")}
        description={getLocalizedField("shortDescription")}
        imageUrl={project.featuredImage}
        url={`/projects/${project.id}`}
        datePublished={project.publishDate}
        dateModified={project.lastUpdated}
        article={{
          headline: getLocalizedField("title"),
          description: getLocalizedField("shortDescription"),
          image: project.featuredImage,
          datePublished: project.publishDate,
          dateModified: project.lastUpdated
        }}
        breadcrumbs={[
          { name: t('home', 'Home'), url: '/' },
          { name: t('projects.title', 'Projects'), url: '/projects' },
          { name: getLocalizedField("title"), url: `/projects/${project.id}` }
        ]}
      />
      
      <div className="container py-8">
        {/* Back button */}
        <div className="mb-8">
          <Button variant="outline" onClick={() => setLocation("/projects")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("projects.backToProjects")}
          </Button>
        </div>
        
        {/* Project header */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{getLocalizedField("title")}</h1>
              <p className="text-lg text-muted-foreground mb-6">{getLocalizedField("shortDescription")}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-primary">{t(`projects.${project.category}`)}</Badge>
                {getTags().slice(0, 5).map((tag: string, index: number) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">{t("projects.projectDetails")}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{t("projects.projectYear")}</p>
                      <p className="text-muted-foreground">{project.year}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{t("projects.location")}</p>
                      <p className="text-muted-foreground">{getLocalizedField("location")}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">{t("projects.projectTags")}</p>
                      <p className="text-muted-foreground">{getTags().join(", ")}</p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex flex-col gap-4">
                  {project.brochureUrl && (
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      {t("projects.downloadBrochure")}
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    {t("projects.shareProject")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Project content */}
        <div className="mb-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full max-w-md mb-6">
              <TabsTrigger className="flex-1" value="description">
                {t("products.description")}
              </TabsTrigger>
              <TabsTrigger className="flex-1" value="gallery">
                {t("projects.projectImages")}
              </TabsTrigger>
              {project.relatedProducts?.length > 0 && (
                <TabsTrigger className="flex-1" value="products">
                  {t("projects.relatedProducts")}
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {getLocalizedField("description").split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="gallery" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.images.map((image, index) => (
                  <div key={index} className="overflow-hidden rounded-lg aspect-[4/3] bg-muted">
                    <img 
                      src={image} 
                      alt={`${getLocalizedField("title")} - ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {project.relatedProducts?.length > 0 && (
              <TabsContent value="products" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.relatedProducts.map((productId, index) => (
                    <Link key={index} href={`/products/${productId}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="pt-6">
                          <h3 className="font-medium mb-2">{t(`products.${productId}`)}</h3>
                          <p className="text-sm text-muted-foreground">{t(`products.${productId}_desc`)}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
}