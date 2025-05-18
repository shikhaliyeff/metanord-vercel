import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertQuoteRequestSchema } from "@shared/schema";
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
import { Loader2 } from "lucide-react";

// Extend the schema with validation
const formSchema = insertQuoteRequestSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  quantity: z.string().optional(),
});

interface QuoteRequestFormProps {
  productId?: string;
  productName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function QuoteRequestForm({ productId, productName, onSuccess, onCancel }: QuoteRequestFormProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      productId: productId || "",
      productName: productName || "",
      quantity: "",
      comment: "",
      status: "new",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/quote", values);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit quote request");
      }
      
      toast({
        title: t("quoteRequest.success.title", "Quote Request Submitted"),
        description: t("quoteRequest.success.description", "We'll get back to you with a quotation soon."),
      });
      
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Quote request error:", error);
      toast({
        title: t("quoteRequest.error.title", "Submission Failed"),
        description: error instanceof Error 
          ? error.message 
          : t("quoteRequest.error.generic", "Failed to submit quote request. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-accent font-inter font-semibold">
                  {t("quoteRequest.form.name", "Your Name")} *
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t("quoteRequest.form.namePlaceholder", "Enter your full name")} 
                    className="neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-accent font-inter font-semibold">
                  {t("quoteRequest.form.email", "Email Address")} *
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t("quoteRequest.form.emailPlaceholder", "Enter your email")} 
                    className="neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-accent font-inter font-semibold">
                  {t("quoteRequest.form.company", "Company Name")}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t("quoteRequest.form.companyPlaceholder", "Enter your company name")} 
                    className="neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-accent font-inter font-semibold">
                  {t("quoteRequest.form.phone", "Phone Number")}
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t("quoteRequest.form.phonePlaceholder", "Enter your phone number")} 
                    className="neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-accent font-inter font-semibold">
                {t("quoteRequest.form.product", "Product")} *
              </FormLabel>
              <FormControl>
                <Input 
                  className="neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow"
                  {...field} 
                  readOnly={!!productName}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-accent font-inter font-semibold">
                {t("quoteRequest.form.quantity", "Quantity")}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={t("quoteRequest.form.quantityPlaceholder", "Enter quantity needed")} 
                  className="neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-accent font-inter font-semibold">
                {t("quoteRequest.form.comments", "Additional Comments")}
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("quoteRequest.form.commentsPlaceholder", "Enter any specific requirements or questions")} 
                  className="min-h-[120px] neumorph-input glass-input border-white/30 focus:border-accent/40 rounded-lg shadow-inner focus:shadow-glow"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-white/30 text-white hover:bg-white/10 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md"
            >
              {t("common.cancel", "Cancel")}
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-accent hover:bg-accent/90 text-white rounded-lg shadow-md transition-all duration-300 glassmorphism-btn border border-white/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.submitting", "Submitting...")}
              </>
            ) : (
              t("quoteRequest.form.submit", "Request Quote")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}