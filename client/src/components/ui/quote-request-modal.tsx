import { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuoteRequestForm } from "@/components/forms/QuoteRequestForm";

interface QuoteRequestModalProps {
  productId: string;
  productName: string;
  trigger?: React.ReactNode;
}

export function QuoteRequestModal({ productId, productName, trigger }: QuoteRequestModalProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-accent hover:bg-accent/90 text-white font-inter font-medium py-6 rounded-lg shadow-md transition-all duration-300 glassmorphism-btn border border-white/20">
            {t('header.requestQuote', 'Request a Quote')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] glassmorphism-panel border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-inter font-bold text-white">
            {t('quoteRequest.title', 'Request a Quote')}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {t('quoteRequest.description', 'Fill out the form below to request a quotation for this product.')}
          </DialogDescription>
        </DialogHeader>
        
        <QuoteRequestForm 
          productId={productId} 
          productName={productName}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}