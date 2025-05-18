import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactInquirySchema } from "@shared/schema";
import { useTranslation } from "react-i18next";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Extend the schema with validation
const formSchema = insertContactInquirySchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      inquiryType: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest("POST", "/api/contact", data);
      if (response.ok) {
        toast({
          title: t("contact.form.success"),
          description: t("contact.form.success"),
          variant: "default",
        });
        form.reset();
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: t("contact.form.error"),
        description: t("contact.form.error"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="glass-card bg-white/90 backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-xl border border-white/40 shadow-soft neumorph">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-4 sm:mb-6">
              <FormLabel className="text-accent font-inter font-semibold text-sm sm:text-base transform transition-transform duration-300 hover:translate-x-1">{t("contact.form.name")}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t("contact.form.namePlaceholder", "Enter your name")} 
                  {...field} 
                  className="neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow text-sm sm:text-base h-9 sm:h-10" 
                />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-4 sm:mb-6">
              <FormLabel className="text-accent font-inter font-semibold text-sm sm:text-base transform transition-transform duration-300 hover:translate-x-1">{t("contact.form.email")}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t("contact.form.emailPlaceholder", "Enter your email address")} 
                  {...field} 
                  className="neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow text-sm sm:text-base h-9 sm:h-10" 
                />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem className="mb-4 sm:mb-6">
              <FormLabel className="text-accent font-inter font-semibold text-sm sm:text-base transform transition-transform duration-300 hover:translate-x-1">{t("contact.form.company") || "Company"}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t("contact.form.companyPlaceholder", "Enter your company name (optional)")}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  value={field.value || ''}
                  className="neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow text-sm sm:text-base h-9 sm:h-10" 
                />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inquiryType"
          render={({ field }) => (
            <FormItem className="mb-4 sm:mb-6">
              <FormLabel className="text-accent font-inter font-semibold text-sm sm:text-base transform transition-transform duration-300 hover:translate-x-1">{t("contact.form.subject") || "Subject"}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value as string || undefined}
              >
                <FormControl>
                  <SelectTrigger className="neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow text-sm sm:text-base h-9 sm:h-10">
                    <SelectValue placeholder={t("contact.form.selectOption") || "Select an option"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="text-sm sm:text-base">
                  <SelectItem value="product">{t("contact.form.productInfo") || "Product Information"}</SelectItem>
                  <SelectItem value="quote">{t("contact.form.requestQuote") || "Request a Quote"}</SelectItem>
                  <SelectItem value="support">{t("contact.form.technicalSupport") || "Technical Support"}</SelectItem>
                  <SelectItem value="other">{t("contact.form.other") || "Other"}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="mb-5 sm:mb-6">
              <FormLabel className="text-accent font-inter font-semibold text-sm sm:text-base transform transition-transform duration-300 hover:translate-x-1">{t("contact.form.message") || "Message"}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("contact.form.messagePlaceholder", "Write your message here...")}
                  className="resize-none neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow text-sm sm:text-base" 
                  rows={4} 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-xs sm:text-sm" />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full btn-gradient text-white hover-lift hover-glow shadow-accent px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border border-white/20 font-medium transition-all duration-300 group relative overflow-hidden text-sm sm:text-base"
          disabled={isSubmitting}
        >
          <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
          {isSubmitting ? t("contact.form.sending") || "Sending..." : t("contact.form.submit") || "Send Message"}
        </Button>
      </form>
    </Form>
  );
}
