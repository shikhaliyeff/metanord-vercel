import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight } from "lucide-react";
import MetaTags from "@/components/seo/MetaTags";
import SchemaOrg from "@/components/seo/SchemaOrg";
import { Project, ProjectCategory } from "@shared/project-schema";
import { useLanguage } from "@/hooks/use-language";

export default function Projects() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [category, setCategory] = useState<ProjectCategory>("all");

  // Fetch projects data
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/projects"],
    enabled: true,
  });

  // Filter projects by category
  const filteredProjects = React.useMemo(() => {
    if (!data?.projects) return [];
    
    if (category === "all") {
      return data.projects;
    }
    
    return data.projects.filter((project: Project) => project.category === category);
  }, [data, category]);

  // Get translatable field
  const getLocalizedField = (project: any, field: string) => {
    if (!project || !project[field]) return "";
    return project[field][language] || project[field]["en"] || "";
  };

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <h2 className="text-2xl font-bold mb-4">{t("common.error")}</h2>
        <p>{t("common.errorLoading")}</p>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={t("projects.metaTitle", "Featured Projects - MetaNord")}
        description={t("projects.metaDescription", "Explore our successful featured projects. See how MetaNord has delivered infrastructure solutions across commercial, industrial, and residential sectors.")}
        keywords={["projects", "infrastructure", "commercial", "industrial", "residential", "featured projects", "MetaNord projects"]}
        type="website"
      />
      
      <SchemaOrg
        type="website"
        title={t("projects.metaTitle", "Featured Projects - MetaNord")}
        description={t("projects.metaDescription", "Explore our successful featured projects. See how MetaNord has delivered infrastructure solutions across commercial, industrial, and residential sectors.")}
        url="/projects"
        breadcrumbs={[
          { name: t('home', 'Home'), url: '/' },
          { name: t('projects.pageTitle', 'Featured Projects'), url: '/projects' }
        ]}
      />
      
      <PageHeader
        title={t("projects.pageTitle")}
        description={t("projects.pageDescription")}
      />

      <div className="container py-6 sm:py-8 px-4 sm:px-6">
        {/* Filter Tabs */}
        <div className="mb-6 sm:mb-8 overflow-x-hidden">
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setCategory(value as ProjectCategory)}>
            <TabsList className="grid grid-cols-3 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 w-full max-w-4xl mx-auto gap-1 xs:gap-2">
              <TabsTrigger value="all" className="px-2 sm:px-3 text-xs sm:text-sm">{t("projects.filterAll")}</TabsTrigger>
              <TabsTrigger value="infrastructure" className="px-2 sm:px-3 text-xs sm:text-sm">{t("projects.filterInfrastructure")}</TabsTrigger>
              <TabsTrigger value="commercial" className="px-2 sm:px-3 text-xs sm:text-sm">{t("projects.filterCommercial")}</TabsTrigger>
              <TabsTrigger value="industrial" className="px-2 sm:px-3 text-xs sm:text-sm">{t("projects.filterIndustrial")}</TabsTrigger>
              <TabsTrigger value="residential" className="px-2 sm:px-3 text-xs sm:text-sm">{t("projects.filterResidential")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {filteredProjects.length > 0 ? (
          <>
            <p className="text-center text-sm text-muted-foreground mb-6 sm:mb-8">
              {t("projects.totalProjects", { count: filteredProjects.length })}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
              {filteredProjects.map((project: any) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col h-full"
                >
                  <Link href={`/projects/${project.id}`}>
                    <Card className="overflow-hidden h-full hover-lift transition-300 cursor-pointer">
                      <div className="relative h-48 xs:h-56 sm:h-64 overflow-hidden">
                        <img
                          src={project.featuredImage}
                          alt={getLocalizedField(project, "title")}
                          className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
                          loading="lazy"
                        />
                        <Badge className="absolute top-3 right-3 bg-primary text-xs xs:text-sm whitespace-nowrap">
                          {t(`projects.${project.category}`)}
                        </Badge>
                      </div>
                      <CardContent className="pt-4 xs:pt-5 sm:pt-6 pb-3 sm:pb-4 flex-grow">
                        <h3 className="text-lg xs:text-xl font-bold mb-2">{getLocalizedField(project, "title")}</h3>
                        <p className="text-muted-foreground text-sm xs:text-base mb-3 xs:mb-4 line-clamp-3">{getLocalizedField(project, "shortDescription")}</p>
                        <div className="flex flex-wrap gap-1.5 xs:gap-2 mt-auto">
                          {(getLocalizedField(project, "tags") || []).slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-background/50 text-xs xs:text-sm py-1">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 pb-3 xs:pb-4">
                        <Button variant="ghost" className="p-0 hover:bg-transparent hover:text-primary text-sm xs:text-base">
                          {t("projects.viewProject")}
                          <ArrowRight className="ml-1.5 xs:ml-2 h-3.5 w-3.5 xs:h-4 xs:w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">{t("projects.noProjectsFound")}</h3>
            <p className="text-muted-foreground mb-6">{t("projects.tryDifferentFilter")}</p>
            <Button variant="outline" onClick={() => setCategory("all")}>
              {t("projects.viewAllProjects")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}