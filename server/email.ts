import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable is not set. Email notifications will not work.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Generic function to send an email using SendGrid
 * @param to Email recipient
 * @param subject Email subject
 * @param text Plain text content
 * @param html HTML content
 * @returns Promise<boolean> Success status
 */
export async function sendCustomEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY not configured, skipping email');
    return false;
  }

  try {
    await mailService.send({
      to,
      from: 'info@metanord.eu',
      subject,
      text,
      html: html || text.replace(/\n/g, '<br>')
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Email templates for various notification types
 */
const emailTemplates = {
  contactInquiry: {
    admin: {
      subject: 'New Contact Inquiry Received - MetaNord',
      text: (data: any) => `
New contact inquiry received from ${data.name} (${data.email})
        
Subject: ${data.subject || 'N/A'}
Company: ${data.company || 'N/A'}
Type: ${data.inquiryType || 'General Inquiry'}

Message:
${data.message}

This inquiry is awaiting your response in the admin dashboard.
`,
      html: (data: any) => `
<h2>New Contact Inquiry Received</h2>
<p>You have received a new inquiry from <strong>${data.name}</strong> (${data.email}).</p>

<h3>Details:</h3>
<ul>
  <li><strong>Subject:</strong> ${data.subject || 'N/A'}</li>
  <li><strong>Company:</strong> ${data.company || 'N/A'}</li>
  <li><strong>Type:</strong> ${data.inquiryType || 'General Inquiry'}</li>
</ul>

<h3>Message:</h3>
<div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #005fa3; margin: 10px 0;">
  ${data.message.replace(/\n/g, '<br>')}
</div>

<p>This inquiry is awaiting your response in the <a href="https://meta-nord-trade-shikhaliyeff.replit.app/admin">admin dashboard</a>.</p>
<hr>
<p style="color: #666; font-size: 0.8em;">© ${new Date().getFullYear()} MetaNord OÜ, Estonia</p>
`
    },
    confirmation: {
      subject: 'Thank you for contacting MetaNord',
      text: (data: any) => `
Thank you for your message, ${data.name}.

We've received your inquiry and our team will review it shortly. If needed, we'll reach out to you at ${data.email} with any questions or updates.

For your reference, here's a copy of your message:
${data.message}

Best regards,
MetaNord OÜ Team
`,
      html: (data: any) => `
<h2>Thank you for contacting MetaNord</h2>
<p>Dear ${data.name},</p>

<p>Thank you for your message. We've received your inquiry and our team will review it shortly. If needed, we'll reach out to you at ${data.email} with any questions or updates.</p>

<h3>For your reference, here's a copy of your message:</h3>
<div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #005fa3; margin: 10px 0;">
  ${data.message.replace(/\n/g, '<br>')}
</div>

<p>Best regards,<br>
MetaNord OÜ Team</p>
<hr>
<p style="color: #666; font-size: 0.8em;">© ${new Date().getFullYear()} MetaNord OÜ, Estonia<br>
Harju maakond, Tallinn, Kesklinna linnaosa, Tornimäe tn 5, 10145<br>
Registry Code: 17235227</p>
`
    }
  },
  quoteRequest: {
    admin: {
      subject: 'New Quote Request Received - MetaNord',
      text: (data: any) => `
New quote request received from ${data.name} (${data.email})
        
Product: ${data.productName}
Company: ${data.company || 'N/A'}
Quantity: ${data.quantity || 'Not specified'}

Additional Comments:
${data.comment || 'No comments provided'}

This quote request is awaiting your response in the admin dashboard.
`,
      html: (data: any) => `
<h2>New Quote Request Received</h2>
<p>You have received a new quote request from <strong>${data.name}</strong> (${data.email}).</p>

<h3>Details:</h3>
<ul>
  <li><strong>Product:</strong> ${data.productName}</li>
  <li><strong>Company:</strong> ${data.company || 'N/A'}</li>
  <li><strong>Quantity:</strong> ${data.quantity || 'Not specified'}</li>
  ${data.phone ? `<li><strong>Phone:</strong> ${data.phone}</li>` : ''}
</ul>

<h3>Additional Comments:</h3>
<div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #005fa3; margin: 10px 0;">
  ${data.comment ? data.comment.replace(/\n/g, '<br>') : 'No comments provided'}
</div>

<p>This quote request is awaiting your response in the <a href="https://meta-nord-trade-shikhaliyeff.replit.app/admin">admin dashboard</a>.</p>
<hr>
<p style="color: #666; font-size: 0.8em;">© ${new Date().getFullYear()} MetaNord OÜ, Estonia</p>
`
    },
    confirmation: {
      subject: 'Your Quote Request - MetaNord',
      text: (data: any) => `
Thank you for your quote request, ${data.name}.

We've received your request for ${data.productName} and our team will prepare a quotation shortly. We'll reach out to you at ${data.email} with the quote details.

For your reference, here's a summary of your request:
Product: ${data.productName}
Quantity: ${data.quantity || 'Not specified'}

Best regards,
MetaNord OÜ Team
`,
      html: (data: any) => `
<h2>Your Quote Request</h2>
<p>Dear ${data.name},</p>

<p>Thank you for your interest in our products. We've received your request for <strong>${data.productName}</strong> and our team will prepare a quotation shortly. We'll reach out to you at ${data.email} with the quote details.</p>

<h3>For your reference, here's a summary of your request:</h3>
<ul>
  <li><strong>Product:</strong> ${data.productName}</li>
  <li><strong>Quantity:</strong> ${data.quantity || 'Not specified'}</li>
</ul>

<p>Best regards,<br>
MetaNord OÜ Team</p>
<hr>
<p style="color: #666; font-size: 0.8em;">© ${new Date().getFullYear()} MetaNord OÜ, Estonia<br>
Harju maakond, Tallinn, Kesklinna linnaosa, Tornimäe tn 5, 10145<br>
Registry Code: 17235227</p>
`
    }
  },
  statusUpdate: {
    contactInquiry: {
      subject: 'Update on Your Inquiry - MetaNord',
      text: (data: any, status: string) => `
Dear ${data.name},

We wanted to provide you with an update on your recent inquiry to MetaNord.

Your inquiry status has been updated to: ${status}

${getStatusMessage(status)}

Original message:
${data.message}

If you have any questions, please don't hesitate to reply to this email.

Best regards,
MetaNord OÜ Team
`,
      html: (data: any, status: string) => `
<h2>Update on Your Inquiry</h2>
<p>Dear ${data.name},</p>

<p>We wanted to provide you with an update on your recent inquiry to MetaNord.</p>

<p><strong>Your inquiry status has been updated to:</strong> ${status}</p>

<div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #005fa3; margin: 10px 0;">
  ${getStatusMessage(status)}
</div>

<h3>Original message:</h3>
<div style="padding: 15px; background-color: #f5f5f5; border: 1px solid #ddd; margin: 10px 0;">
  ${data.message.replace(/\n/g, '<br>')}
</div>

<p>If you have any questions, please don't hesitate to reply to this email.</p>

<p>Best regards,<br>
MetaNord OÜ Team</p>
<hr>
<p style="color: #666; font-size: 0.8em;">© ${new Date().getFullYear()} MetaNord OÜ, Estonia<br>
Harju maakond, Tallinn, Kesklinna linnaosa, Tornimäe tn 5, 10145</p>
`
    },
    quoteRequest: {
      subject: 'Update on Your Quote Request - MetaNord',
      text: (data: any, status: string) => `
Dear ${data.name},

We wanted to provide you with an update on your recent quote request for ${data.productName}.

Your request status has been updated to: ${status}

${getStatusMessage(status)}

If you have any questions, please don't hesitate to reply to this email.

Best regards,
MetaNord OÜ Team
`,
      html: (data: any, status: string) => `
<h2>Update on Your Quote Request</h2>
<p>Dear ${data.name},</p>

<p>We wanted to provide you with an update on your recent quote request for <strong>${data.productName}</strong>.</p>

<p><strong>Your request status has been updated to:</strong> ${status}</p>

<div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #005fa3; margin: 10px 0;">
  ${getStatusMessage(status)}
</div>

<p>If you have any questions, please don't hesitate to reply to this email.</p>

<p>Best regards,<br>
MetaNord OÜ Team</p>
<hr>
<p style="color: #666; font-size: 0.8em;">© ${new Date().getFullYear()} MetaNord OÜ, Estonia<br>
Harju maakond, Tallinn, Kesklinna linnaosa, Tornimäe tn 5, 10145</p>
`
    }
  }
};

/**
 * Helper function to get appropriate message based on status
 */
function getStatusMessage(status: string): string {
  switch (status.toLowerCase()) {
    case 'in progress':
      return 'Our team is currently working on your request. We will provide more information soon.';
    case 'completed':
      return 'We have completed processing your request. Thank you for your patience.';
    case 'pending':
      return 'Your request is currently in our queue and will be addressed by our team soon.';
    case 'closed':
      return 'This request has been closed. If you need further assistance, please submit a new inquiry.';
    default:
      return 'Our team will be in touch with you soon regarding your request.';
  }
}

/**
 * Send an email via SendGrid
 */
export async function sendEmail(params: {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("Email not sent - SENDGRID_API_KEY is not set");
    return false;
  }
  
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      content: [
        {
          type: 'text/plain',
          value: params.text || ''
        },
        {
          type: 'text/html',
          value: params.html || ''
        }
      ]
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

/**
 * Send notifications for a new contact inquiry
 */
export async function sendContactInquiryNotifications(inquiryData: any): Promise<void> {
  const adminEmail = 'info@metanord.eu'; // Admin email address
  const senderEmail = 'noreply@metanord.eu'; // Sender email address (verified in SendGrid)
  
  // Send notification to admin
  await sendEmail({
    to: adminEmail,
    from: senderEmail,
    subject: emailTemplates.contactInquiry.admin.subject,
    text: emailTemplates.contactInquiry.admin.text(inquiryData),
    html: emailTemplates.contactInquiry.admin.html(inquiryData)
  });
  
  // Send confirmation to customer
  await sendEmail({
    to: inquiryData.email,
    from: senderEmail,
    subject: emailTemplates.contactInquiry.confirmation.subject,
    text: emailTemplates.contactInquiry.confirmation.text(inquiryData),
    html: emailTemplates.contactInquiry.confirmation.html(inquiryData)
  });
}

/**
 * Send notifications for a new quote request
 */
export async function sendQuoteRequestNotifications(requestData: any): Promise<void> {
  const adminEmail = 'info@metanord.eu'; // Admin email address
  const senderEmail = 'noreply@metanord.eu'; // Sender email address (verified in SendGrid)
  
  // Send notification to admin
  await sendEmail({
    to: adminEmail,
    from: senderEmail,
    subject: emailTemplates.quoteRequest.admin.subject,
    text: emailTemplates.quoteRequest.admin.text(requestData),
    html: emailTemplates.quoteRequest.admin.html(requestData)
  });
  
  // Send confirmation to customer
  await sendEmail({
    to: requestData.email,
    from: senderEmail,
    subject: emailTemplates.quoteRequest.confirmation.subject,
    text: emailTemplates.quoteRequest.confirmation.text(requestData),
    html: emailTemplates.quoteRequest.confirmation.html(requestData)
  });
}

/**
 * Send status update notification for a contact inquiry
 */
export async function sendContactInquiryStatusUpdate(inquiryData: any, status: string): Promise<void> {
  const senderEmail = 'noreply@metanord.eu'; // Sender email address (verified in SendGrid)
  
  // Send update to customer
  await sendEmail({
    to: inquiryData.email,
    from: senderEmail,
    subject: emailTemplates.statusUpdate.contactInquiry.subject,
    text: emailTemplates.statusUpdate.contactInquiry.text(inquiryData, status),
    html: emailTemplates.statusUpdate.contactInquiry.html(inquiryData, status)
  });
}

/**
 * Send status update notification for a quote request
 */
export async function sendQuoteRequestStatusUpdate(requestData: any, status: string): Promise<void> {
  const senderEmail = 'noreply@metanord.eu'; // Sender email address (verified in SendGrid)
  
  // Send update to customer
  await sendEmail({
    to: requestData.email,
    from: senderEmail,
    subject: emailTemplates.statusUpdate.quoteRequest.subject,
    text: emailTemplates.statusUpdate.quoteRequest.text(requestData, status),
    html: emailTemplates.statusUpdate.quoteRequest.html(requestData, status)
  });
}

/**
 * Send email to client from the CRM
 * @param to Email recipient
 * @param subject Email subject
 * @param content Email content
 * @returns Promise<boolean> Success status
 */
export async function sendCrmClientEmail(to: string, subject: string, content: string): Promise<boolean> {
  const senderEmail = 'info@metanord.eu';
  
  // Clean up the content for HTML
  const htmlContent = content.replace(/\n/g, '<br>');
  
  // Send the email
  return await sendEmail({
    to,
    from: senderEmail,
    subject,
    text: content,
    html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${htmlContent}</div>`
  });
}

/**
 * Send notification to team about new CRM client
 * @param clientName Client name
 * @param clientEmail Client email
 * @param companyName Company name (optional)
 * @returns Promise<boolean> Success status
 */
export async function sendNewClientNotification(
  clientName: string, 
  clientEmail: string,
  companyName?: string | null
): Promise<boolean> {
  const senderEmail = 'info@metanord.eu';
  const subject = `New Client Added: ${clientName}`;
  
  // Create a simple HTML message
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>New Client Added to CRM</h2>
      <p>A new client has been added to the CRM system:</p>
      <ul>
        <li><strong>Name:</strong> ${clientName}</li>
        <li><strong>Email:</strong> ${clientEmail}</li>
        ${companyName ? `<li><strong>Company:</strong> ${companyName}</li>` : ''}
      </ul>
      <p>Please log in to the admin dashboard to view more details.</p>
    </div>
  `;
  
  const text = `New Client Added to CRM

A new client has been added to the CRM system:

Name: ${clientName}
Email: ${clientEmail}
${companyName ? `Company: ${companyName}` : ''}

Please log in to the admin dashboard to view more details.`;
  
  // Send the email to the team
  return await sendEmail({
    to: 'info@metanord.eu',
    from: senderEmail,
    subject,
    text,
    html
  });
}