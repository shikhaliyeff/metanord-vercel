import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

// Utility to generate unique offer numbers
export const generateOfferNumber = (): string => {
  const currentYear = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `OFF-${currentYear}-${random}`;
};

// Interface for offer item
export interface OfferItem {
  productName: string;
  specifications?: string;
  quantity: number;
  price?: number;
  total?: number;
}

// Interface for client information
export interface ClientInfo {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
}

// Interface for offer details
export interface OfferDetails {
  offerNumber: string;
  date: Date;
  expiryDate?: Date;
  items: OfferItem[];
  totalAmount?: number;
  currency?: string;
  notes?: string;
  terms?: string;
  paymentTerms?: string;
  clientInfo: ClientInfo;
}

/**
 * Generate PDF from an HTML element
 * @param elementId ID of the HTML element to convert to PDF
 * @param filename Name of the file to save
 */
export const generatePDFFromElement = async (
  elementId: string,
  filename: string
): Promise<Blob> => {
  // Get the element
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID '${elementId}' not found`);
  }

  // Create canvas from element
  const canvas = await html2canvas(element, {
    scale: 2,
    logging: false,
    useCORS: true,
  });

  // Calculate dimensions based on A4 paper
  const imgWidth = 210; // A4 width in mm
  const pageHeight = 297; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  // Create PDF
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Add image to PDF
  let position = 0;
  let heightLeft = imgHeight;
  
  // Add first page
  pdf.addImage(
    canvas.toDataURL('image/png', 1.0),
    'PNG',
    0,
    position,
    imgWidth,
    imgHeight
  );
  heightLeft -= pageHeight;
  
  // Add additional pages if needed
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(
      canvas.toDataURL('image/png', 1.0),
      'PNG',
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;
  }
  
  // Return the generated PDF as a Blob
  return pdf.output('blob');
};

/**
 * Generate a PDF offer document
 * @param offer Offer details
 * @returns The created PDF document as a blob
 */
export const generateOfferPDF = async (
  offer: OfferDetails
): Promise<Blob> => {
  // Create a new PDF document
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Set up metadata
  pdf.setProperties({
    title: `Offer ${offer.offerNumber}`,
    subject: `Commercial offer for ${offer.clientInfo.name}`,
    author: 'MetaNord OÜ',
    creator: 'MetaNord Admin System'
  });
  
  // Add MetaNord logo and header
  // In a real application, you would load the logo from an asset
  try {
    // Add header
    pdf.setFontSize(20);
    pdf.setTextColor(0, 94, 165); // MetaNord blue color
    pdf.text('MetaNord OÜ', 10, 20);
    
    // Company info
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text([
      'Harju maakond, Tallinn',
      'Kesklinna linnaosa, Tornimäe tn 5, 10145',
      'Registry Code: 17235227',
      'Email: info@metanord.eu',
      'Website: www.metanord.eu'
    ], 10, 30);
    
    // Offer title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`OFFER ${offer.offerNumber}`, 10, 60);
    
    // Offer date and expiry
    pdf.setFontSize(11);
    pdf.text(`Date: ${format(offer.date, 'dd.MM.yyyy')}`, 10, 70);
    if (offer.expiryDate) {
      pdf.text(`Valid until: ${format(offer.expiryDate, 'dd.MM.yyyy')}`, 10, 75);
    }
    
    // Client info
    pdf.setFontSize(12);
    pdf.text('Client Information', 10, 85);
    pdf.line(10, 87, 100, 87); // Add a separator line
    
    pdf.setFontSize(11);
    const clientInfoText = [
      `Name: ${offer.clientInfo.name}`,
      `Email: ${offer.clientInfo.email}`
    ];
    
    if (offer.clientInfo.company) {
      clientInfoText.push(`Company: ${offer.clientInfo.company}`);
    }
    
    if (offer.clientInfo.phone) {
      clientInfoText.push(`Phone: ${offer.clientInfo.phone}`);
    }
    
    if (offer.clientInfo.address) {
      clientInfoText.push(`Address: ${offer.clientInfo.address}`);
    }
    
    pdf.text(clientInfoText, 10, 95);
    
    // Items table
    pdf.setFontSize(12);
    pdf.text('Offer Details', 10, 125);
    pdf.line(10, 127, 100, 127); // Add a separator line
    
    // Table header
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    
    pdf.text('Product', 10, 135);
    pdf.text('Specifications', 70, 135);
    pdf.text('Quantity', 120, 135);
    pdf.text('Price', 150, 135);
    pdf.text('Total', 180, 135);
    
    pdf.line(10, 137, 200, 137); // Add a separator line
    
    // Table data
    let yPos = 145;
    pdf.setTextColor(0, 0, 0);
    
    offer.items.forEach((item, index) => {
      pdf.text(item.productName, 10, yPos);
      pdf.text(item.specifications || '', 70, yPos);
      pdf.text(item.quantity.toString(), 120, yPos);
      pdf.text(item.price ? `${item.price} ${offer.currency || '€'}` : '-', 150, yPos);
      pdf.text(item.total ? `${item.total} ${offer.currency || '€'}` : '-', 180, yPos);
      
      yPos += 10;
      
      // Add a page if we're running out of space
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
    });
    
    // Total amount
    if (offer.totalAmount) {
      pdf.line(10, yPos, 200, yPos); // Add a separator line
      yPos += 10;
      pdf.setFontSize(12);
      pdf.text(`Total: ${offer.totalAmount} ${offer.currency || '€'}`, 150, yPos);
    }
    
    // Notes
    if (offer.notes) {
      // Add a page if we're running out of space
      if (yPos > 240) {
        pdf.addPage();
        yPos = 20;
      } else {
        yPos += 20;
      }
      
      pdf.setFontSize(12);
      pdf.text('Notes', 10, yPos);
      pdf.line(10, yPos + 2, 100, yPos + 2); // Add a separator line
      
      pdf.setFontSize(10);
      pdf.text(offer.notes, 10, yPos + 10);
    }
    
    // Terms
    if (offer.terms || offer.paymentTerms) {
      // Add a page if we're running out of space
      if (yPos > 200) {
        pdf.addPage();
        yPos = 20;
      } else {
        yPos += 30;
      }
      
      pdf.setFontSize(12);
      pdf.text('Terms and Conditions', 10, yPos);
      pdf.line(10, yPos + 2, 100, yPos + 2); // Add a separator line
      
      pdf.setFontSize(10);
      
      if (offer.terms) {
        pdf.text(offer.terms, 10, yPos + 10);
        yPos += 20;
      }
      
      if (offer.paymentTerms) {
        pdf.text(`Payment Terms: ${offer.paymentTerms}`, 10, yPos + 10);
      }
    }
    
    // Footer
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Page ${i} of ${pageCount}`, 170, 290);
      pdf.text('MetaNord OÜ - www.metanord.eu', 10, 290);
    }
    
    // Return the PDF as a blob
    return pdf.output('blob');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF offer');
  }
};

/**
 * Generate a filename for the offer PDF
 * @param offerNumber The offer number
 * @param clientName The client name
 * @returns A filename for the offer PDF
 */
export const generateOfferFilename = (offerNumber: string, clientName: string): string => {
  const formattedClientName = clientName.replace(/[^a-zA-Z0-9]/g, '_');
  return `MetaNord_Offer_${offerNumber}_${formattedClientName}.pdf`;
};