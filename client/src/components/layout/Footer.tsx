import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Layers, Linkedin, Facebook, Instagram, ChevronRight, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const { t, i18n } = useTranslation();
  
  // Get current language
  const currentLang = i18n.language || "en";
  
  return (
    <footer className="text-white pt-8 xs:pt-10 sm:pt-16 pb-6 xs:pb-8 sm:pb-10 relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-gray-900 pointer-events-none"></div>
      
      {/* Simple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/20"></div>
      
      {/* Top wave effect */}
      <div className="absolute top-0 left-0 right-0 h-8 xs:h-10 sm:h-12 opacity-30">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#FFFFFF" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,122.7C672,139,768,213,864,229.3C960,245,1056,203,1152,170.7C1248,139,1344,117,1392,106.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 relative z-10">
        {/* Top section with logo and links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 xs:gap-x-6 md:gap-x-8 gap-y-6 xs:gap-y-8 md:gap-y-12">
          {/* Logo and Description */}
          <div className="md:col-span-4 lg:col-span-5">
            <div className="flex flex-col space-y-4 xs:space-y-5 sm:space-y-6">
              <div className="bg-gradient-to-b from-white to-gray-100 inline-flex items-center justify-center p-3 xs:p-4 sm:p-5 rounded-xl self-start shadow-xl border border-white">
                <Logo variant="footer" className="w-auto max-w-[120px] xs:max-w-[140px] sm:max-w-[180px]" />
              </div>
              <p className="text-white/90 text-xs xs:text-sm sm:text-base font-light leading-relaxed mb-1 xs:mb-2 sm:mb-3 max-w-md">
                {t("footer.description", "MetaNord OÜ specializes in premium aluminum profiles and infrastructure products for European and international markets.")}
              </p>
              
              {/* Contact information */}
              <div className="space-y-2 xs:space-y-3 text-white/90">
                <a href="mailto:info@metanord.eu" className="flex items-center gap-2 xs:gap-3 hover:text-white transition-colors duration-300">
                  <Mail className="text-accent h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">info@metanord.eu</span>
                </a>
                <a href="tel:+3725555555" className="flex items-center gap-2 xs:gap-3 hover:text-white transition-colors duration-300">
                  <Phone className="text-accent h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">+372 5555 5555</span>
                </a>
                <div className="flex items-start gap-2 xs:gap-3">
                  <MapPin className="text-accent mt-0.5 h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Harju maakond, Tallinn, Kesklinna linnaosa, Tornimäe tn 5, 10145</span>
                </div>
              </div>
              
              {/* Social links */}
              <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 pt-1 xs:pt-2 sm:pt-3">
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Linkedin className="text-white relative z-10 h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Facebook className="text-white relative z-10 h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Instagram className="text-white relative z-10 h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-4 sm:w-4" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Links Section */}
          <div className="md:col-span-8 lg:col-span-7">
            <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6 sm:gap-8">
              {/* Products Links */}
              <div>
                <h4 className="text-sm xs:text-base sm:text-lg font-medium mb-2 xs:mb-3 sm:mb-5 text-white relative inline-block">
                  {t("footer.products.title", "Products")}
                  <div className="absolute -bottom-1 left-0 flex flex-col gap-0.5 xs:gap-1">
                    <div className="h-0.5 w-5 xs:w-6 sm:w-8 bg-accent rounded-full animate-shimmer"></div>
                    <div className="h-0.5 w-2.5 xs:w-3 sm:w-4 bg-white/60 rounded-full"></div>
                  </div>
                </h4>
                <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3 mt-3 xs:mt-4">
                  <li>
                    <Link to="/products#aluminum">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.products.aluminum", "Aluminum Products")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/products#polyethylene">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.products.polyethylene", "Polyethylene Products")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/products#steel">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.products.steel", "Steel Products")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/products#cast-iron">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.products.castIron", "Cast Iron Products")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/products#infrastructure">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.products.infrastructure", "Infrastructure Products")}
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Quick Links */}
              <div>
                <h4 className="text-sm xs:text-base sm:text-lg font-medium mb-2 xs:mb-3 sm:mb-5 text-white relative inline-block">
                  {t("footer.links.title", "Quick Links")}
                  <div className="absolute -bottom-1 left-0 flex flex-col gap-0.5 xs:gap-1">
                    <div className="h-0.5 w-5 xs:w-6 sm:w-8 bg-accent rounded-full animate-shimmer"></div>
                    <div className="h-0.5 w-2.5 xs:w-3 sm:w-4 bg-white/60 rounded-full"></div>
                  </div>
                </h4>
                <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3 mt-3 xs:mt-4">
                  <li>
                    <Link to="/">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.links.home", "Home")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/about">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.links.about", "About Us")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/products">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.links.products", "Products")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/services">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.links.services", "Services")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/projects">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.links.projects", "Featured Projects")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.links.contact", "Contact")}
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Resources Section */}
              <div>
                <h4 className="text-sm xs:text-base sm:text-lg font-medium mb-2 xs:mb-3 sm:mb-5 text-white relative inline-block">
                  {t("footer.resources.title", "Resources")}
                  <div className="absolute -bottom-1 left-0 flex flex-col gap-0.5 xs:gap-1">
                    <div className="h-0.5 w-5 xs:w-6 sm:w-8 bg-accent rounded-full animate-shimmer"></div>
                    <div className="h-0.5 w-2.5 xs:w-3 sm:w-4 bg-white/60 rounded-full"></div>
                  </div>
                </h4>
                <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3 mt-3 xs:mt-4">
                  <li>
                    <Link to="/documents">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.resources.documents", "Documents")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/documents?type=certificates">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.resources.certifications", "Certifications")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.resources.faq", "FAQ")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.resources.privacy", "Privacy Policy")}
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms">
                      <div className="text-white/80 hover:text-accent transition-all duration-200 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5 group">
                        <ChevronRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 h-2.5 w-2.5 xs:h-3 xs:w-3" />
                        {t("footer.resources.terms", "Terms of Use")}
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Newsletter */}
              <div className="col-span-2 lg:col-span-1 mt-2 xs:mt-3 sm:mt-0">
                <h4 className="text-sm xs:text-base sm:text-lg font-medium mb-2 xs:mb-3 sm:mb-5 text-white relative inline-block">
                  {t("footer.newsletter.title", "Newsletter")}
                  <div className="absolute -bottom-1 left-0 flex flex-col gap-0.5 xs:gap-1">
                    <div className="h-0.5 w-5 xs:w-6 sm:w-8 bg-accent rounded-full animate-shimmer"></div>
                    <div className="h-0.5 w-2.5 xs:w-3 sm:w-4 bg-white/60 rounded-full"></div>
                  </div>
                </h4>
                <p className="text-white/80 text-xs sm:text-sm mb-2 xs:mb-3 sm:mb-4 max-w-xs">
                  {t("footer.newsletter.subtitle", "Subscribe to receive updates about our new products and special offers.")}
                </p>
                <div className="flex flex-col space-y-2 xs:space-y-3">
                  <div className="relative">
                    <Input 
                      type="email" 
                      placeholder={t("footer.newsletter.placeholder", "Your email address")}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 focus:border-accent/40 focus:ring-1 focus:ring-accent placeholder:text-white/40 text-white rounded-full text-xs sm:text-sm pr-10 neumorph-inset shadow-inner h-8 xs:h-9 sm:h-10"
                      aria-label={t("footer.newsletter.placeholder", "Your email address")}
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 h-3.5 w-3.5 xs:h-4 xs:w-4" />
                  </div>
                  <Button 
                    className="btn-gradient text-white hover-lift hover-glow text-xs sm:text-sm font-semibold rounded-lg shadow-accent border border-white/20 px-3 sm:px-4 py-1.5 sm:py-2 h-8 xs:h-9 sm:h-10 group relative overflow-hidden"
                    aria-label={t("footer.newsletter.button", "Subscribe")}
                  >
                    <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <Layers className="mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform duration-300 h-3 w-3 xs:h-3.5 xs:w-3.5" />
                    <span className="relative">{t("footer.newsletter.button", "Subscribe")}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright and Policies */}
        <div className="mt-6 xs:mt-8 sm:mt-12 md:mt-16 pt-4 xs:pt-5 sm:pt-6 flex flex-col md:flex-row justify-between items-center relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          
          <p className="text-white/70 text-[10px] xs:text-xs md:text-sm text-center md:text-left mb-2 xs:mb-3 md:mb-0">
            &copy; {new Date().getFullYear()} MetaNord OÜ · {t("footer.legal.copyright", "All rights reserved.")}
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-6">
            <Link to="/privacy" className="text-white/80 hover:text-white text-[10px] xs:text-xs md:text-sm transition-colors duration-300 border-b border-transparent hover:border-white/40">
              {t("footer.legal.privacy", "Privacy Policy")}
            </Link>
            <Link to="/terms" className="text-white/80 hover:text-white text-[10px] xs:text-xs md:text-sm transition-colors duration-300 border-b border-transparent hover:border-white/40">
              {t("footer.legal.terms", "Terms of Service")}
            </Link>
            <Link to="/shipping" className="text-white/80 hover:text-white text-[10px] xs:text-xs md:text-sm transition-colors duration-300 border-b border-transparent hover:border-white/40">
              {t("footer.legal.cookies", "Shipping Info")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;