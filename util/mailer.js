// Email transporter configuration using Nodemailer and Brevo SMTP service
// Handles sending transactional emails for user authentication and notifications
// Import nodemailer
const nodemailer = require('nodemailer');

// Create transporter using Brevo's SMTP relay
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',        // Brevo SMTP host
  port: 587,                            // TLS port
  auth: {
    user: process.env.BREVO_SMTP_USER,  // your Brevo SMTP login (from dashboard)
    pass: process.env.BREVO_SMTP_KEY    // your Brevo SMTP key (not your account password)
  }
});

// Export the transporter for use in other modules
module.exports = transporter;