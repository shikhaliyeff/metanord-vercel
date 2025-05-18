import { ProjectCard } from "@/components/ui/project-card";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import hsawPilesWater from "@assets/Helical Submerged Arc Welded (HSAW) Pipes For Water Purpose.png";
import waterSupplyNetwork from "@assets/water supply network.jpg";

export function ProjectsSection() {
  const { t } = useTranslation();
  
  const projects = [
    {
      image: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&h=700&q=80",
      title: t("projects.office"),
      description: t("projects.officeDesc"),
      category: t("projects.commercial"),
      categoryClass: "bg-accent"
    },
    {
      image: waterSupplyNetwork,
      title: t("projects.pipeline"),
      description: t("projects.pipelineDesc"),
      category: t("projects.infrastructure"),
      categoryClass: "bg-primary"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent opacity-80 z-10"></div>
      <div className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl -top-48 -right-48"></div>
      <div className="absolute w-96 h-96 bg-accent/5 rounded-full blur-3xl -bottom-48 -left-48"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="h-1 w-24 bg-accent rounded-full mb-1 mx-auto animate-shimmer"></div>
            <div className="h-1 w-16 bg-primary rounded-full mx-auto"></div>
          </div>
          <motion.h2 
            className="text-3xl md:text-4xl font-inter font-bold mb-4 text-primary"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("projects.title")}
          </motion.h2>
          <motion.p 
            className="text-lg text-neutral-dark max-w-3xl mx-auto font-roboto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("projects.subtitle")}
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              image={project.image}
              title={project.title}
              description={project.description}
              category={project.category}
              categoryClass={project.categoryClass}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
