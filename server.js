import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Serve static files from the public directory
app.use(express.static('public'));

// Handle form submissions (for contact form)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API endpoint for contact form
app.post('/api/contact', (req, res) => {
  // In a real app, we would process the form data, validate it and send emails
  console.log('Contact form submission:', req.body);
  
  // For demo purposes, just respond with success
  res.json({ 
    success: true, 
    message: 'Thank you for your message! We will get back to you soon.' 
  });
});

// For any other routes, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});