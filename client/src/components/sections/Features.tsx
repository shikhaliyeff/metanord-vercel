import { FeatureCard } from "@/components/ui/feature-card";
import { Award, EuroIcon, Truck, Handshake } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function Features() {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: Award,
      title: t("features.quality.title"),
      description: t("features.quality.description"),
      colorClass: "border-accent" as const,
      iconColorClass: "text-accent" as const
    },
    {
      icon: EuroIcon,
      title: t("features.competitive.title"),
      description: t("features.competitive.description"),
      colorClass: "border-primary" as const,
      iconColorClass: "text-primary" as const
    },
    {
      icon: Truck,
      title: t("features.reliability.title"),
      description: t("features.reliability.description"),
      colorClass: "border-secondary" as const,
      iconColorClass: "text-secondary" as const
    },
    {
      icon: Handshake,
      title: t("features.expertise.title"),
      description: t("features.expertise.description"),
      colorClass: "border-accent-dark" as const,
      iconColorClass: "text-accent-dark" as const
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-inter font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("features.title")}
          </motion.h2>
          <motion.p 
            className="text-lg text-neutral-dark max-w-3xl mx-auto font-roboto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("features.subtitle")}
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                colorClass={feature.colorClass}
                iconColorClass={feature.iconColorClass}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
