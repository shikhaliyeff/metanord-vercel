import { ContactForm } from "@/components/forms/ContactForm";
import { MapPin, Phone, Mail, Globe, Briefcase, Clipboard } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function ContactSection() {
  const { t } = useTranslation();
  return (
    <section id="contact" className="py-10 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-5xl font-inter font-bold mb-4 sm:mb-6 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary">{t("contact.reachOut", "联系我们")}</span>
          </motion.h2>
          <motion.p 
            className="text-sm sm:text-base md:text-lg text-neutral-dark max-w-3xl mx-auto font-roboto glass-card bg-white/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-white/30 shadow-soft"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {t("contact.subtitle")}
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1" // Mobile-first: Form comes second on mobile
          >
            <ContactForm />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2" // Mobile-first: Info comes first on mobile
          >
            <div className="mb-6 sm:mb-8 glass-card bg-white/80 backdrop-blur-lg p-4 sm:p-5 md:p-6 rounded-xl border border-white/40 shadow-soft neumorph">
              <h3 className="text-xl sm:text-2xl font-inter font-bold mb-2 sm:mb-4 text-primary">{t("contact.info.title")}</h3>
              <p className="text-sm sm:text-base md:text-lg text-neutral-dark mb-4 sm:mb-6 font-roboto">
                {t("contact.info.subtitle")}
              </p>
              
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                {/* Company Details - moved to top */}
                <div className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg glass-card bg-white/70 backdrop-blur-sm border border-white/30 shadow-soft">
                  <div className="text-gradient-accent flex items-center justify-center p-1.5 sm:p-2 rounded-full neumorph-btn shadow-soft">
                    <Briefcase className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <div>
                    <h4 className="font-inter font-semibold text-accent text-sm sm:text-base">{t("contact.headers.company", "Company")}</h4>
                    <p className="font-roboto text-neutral-dark font-medium text-sm sm:text-base">MetaNord OÜ</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg glass-card bg-white/70 backdrop-blur-sm border border-white/30 shadow-soft">
                  <div className="text-gradient-accent flex items-center justify-center p-1.5 sm:p-2 rounded-full neumorph-btn shadow-soft">
                    <Clipboard className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <div>
                    <h4 className="font-inter font-semibold text-accent text-sm sm:text-base">{t("contact.headers.registry", "Registry Code")}</h4>
                    <p className="font-roboto text-neutral-dark font-medium text-sm sm:text-base">17235227</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg glass-card bg-white/70 backdrop-blur-sm border border-white/30 shadow-soft">
                  <div className="text-gradient-accent flex items-center justify-center p-1.5 sm:p-2 rounded-full neumorph-btn shadow-soft">
                    <MapPin className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <div>
                    <h4 className="font-inter font-semibold text-accent text-sm sm:text-base">{t("contact.headers.address", "Address")}</h4>
                    <p className="font-roboto text-neutral-dark font-medium text-sm sm:text-base">Tornimäe tn 5, Kesklinna linnaosa, Tallinn, Harju maakond, 10145, Estonia</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg glass-card bg-white/70 backdrop-blur-sm border border-white/30 shadow-soft">
                  <div className="text-gradient-accent flex items-center justify-center p-1.5 sm:p-2 rounded-full neumorph-btn shadow-soft">
                    <Phone className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <div>
                    <h4 className="font-inter font-semibold text-accent text-sm sm:text-base">{t("contact.headers.phone", "Phone")}</h4>
                    <p className="font-roboto text-neutral-dark font-medium text-sm sm:text-base">+372 5123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg glass-card bg-white/70 backdrop-blur-sm border border-white/30 shadow-soft">
                  <div className="text-gradient-accent flex items-center justify-center p-1.5 sm:p-2 rounded-full neumorph-btn shadow-soft">
                    <Mail className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <div>
                    <h4 className="font-inter font-semibold text-accent text-sm sm:text-base">{t("contact.headers.email", "Email")}</h4>
                    <p className="font-roboto text-neutral-dark font-medium text-sm sm:text-base">info@metanord.eu</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg glass-card bg-white/70 backdrop-blur-sm border border-white/30 shadow-soft">
                  <div className="text-gradient-accent flex items-center justify-center p-1.5 sm:p-2 rounded-full neumorph-btn shadow-soft">
                    <Globe className="h-4 sm:h-5 w-4 sm:w-5" />
                  </div>
                  <div>
                    <h4 className="font-inter font-semibold text-accent text-sm sm:text-base">{t("contact.headers.website", "Website")}</h4>
                    <a 
                      href="https://www.metanord.eu" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:text-accent font-medium transition-colors duration-300 border-b border-primary/30 hover:border-accent pb-0.5 text-sm sm:text-base"
                    >
                      www.metanord.eu
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card bg-white/80 backdrop-blur-lg p-4 sm:p-5 md:p-6 rounded-xl border border-white/40 shadow-soft neumorph">
              <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-xl sm:text-2xl font-inter font-bold text-primary">{t("contact.location")}</h3>
                <a 
                  href="https://goo.gl/maps/YJ4SytAoGHbQXauy8" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-accent font-medium transition-colors duration-300 flex items-center gap-1 text-xs sm:text-sm"
                >
                  <MapPin className="h-3 sm:h-4 w-3 sm:w-4" />
                  <span>View on Maps</span>
                </a>
              </div>
              <div className="rounded-xl overflow-hidden h-60 sm:h-70 md:h-80 shadow-soft neumorph border border-white/30">
                {/* This would be replaced with an actual map integration in a real implementation */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2028.9458746964403!2d24.761525!3d59.4371126!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46929499df5bc37d%3A0x45ac5d5cff02b2ba!2sTornim%C3%A4e%205%2C%2010145%20Tallinn%2C%20Estonia!5e0!3m2!1sen!2sus!4v1688557762015!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MetaNord Office Location"
                  className="filter grayscale-[30%] contrast-[105%]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
