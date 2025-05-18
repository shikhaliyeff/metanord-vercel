import { ServiceCard } from "@/components/ui/service-card";
import { Truck, ClipboardCheck, Bolt } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function ServicesSection() {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: Truck,
      title: t("services.logistics.title"),
      description: t("services.logistics.description"),
      features: [
        t("services.logistics.features.0"),
        t("services.logistics.features.1"),
        t("services.logistics.features.2")
      ]
    },
    {
      icon: ClipboardCheck,
      title: t("services.consulting.title"),
      description: t("services.consulting.description"),
      features: [
        t("services.consulting.features.0"),
        t("services.consulting.features.1"),
        t("services.consulting.features.2")
      ]
    },
    {
      icon: Bolt,
      title: t("services.custom.title"),
      description: t("services.custom.description"),
      features: [
        t("services.custom.features.0"),
        t("services.custom.features.1"),
        t("services.custom.features.2")
      ]
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
    <section id="services" className="py-20 bg-gradient-to-b from-primary via-primary-dark to-primary-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/5 to-transparent"></div>
      
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      
      {/* Top wave effect */}
      <div className="absolute top-0 left-0 right-0 h-12 opacity-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#FFFFFF" fillOpacity="0.3" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,165.3C672,149,768,75,864,58.7C960,43,1056,85,1152,117.3C1248,149,1344,171,1392,181.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="h-1 w-20 bg-accent rounded-full mb-1 mx-auto animate-shimmer"></div>
            <div className="h-1 w-12 bg-white/60 rounded-full mx-auto"></div>
          </div>
          <motion.h2 
            className="text-3xl md:text-4xl font-inter font-bold mb-4 text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t("services.title")} <span className="text-accent">{t("services.titleHighlight")}</span>
          </motion.h2>
          <motion.p 
            className="text-lg max-w-3xl mx-auto font-roboto text-white/90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("services.subtitle")}
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
