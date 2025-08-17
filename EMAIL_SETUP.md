# EmailJS Setup Guide for Contact Form

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/) and create a free account
2. Verify your email address

## Step 2: Set Up Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Note down your **Service ID**

## Step 3: Create Email Template
1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Create a template with these variables:
   ```
   To: {{to_email}}
   From: {{from_name}} <{{from_email}}>
   Subject: {{subject}}
   
   Message:
   {{message}}
   ```
4. Note down your **Template ID**

## Step 4: Get Public Key
1. Go to "Account" → "API Keys"
2. Copy your **Public Key**

## Step 5: Update Configuration
1. Open `src/lib/email-config.ts`
2. Replace the placeholder values:
   ```typescript
   export const EMAILJS_CONFIG = {
     SERVICE_ID: "service_xxxxxxx", // Your actual service ID
     TEMPLATE_ID: "template_xxxxxxx", // Your actual template ID
     PUBLIC_KEY: "xxxxxxxxxxxxxxxxxxxxx", // Your actual public key
   };
   ```

## Step 6: Test
1. Fill out the contact form on your website
2. Submit the form
3. Check your email (dhrubajyoti.das5793@gmail.com) for the notification
4. Check the sender's email for the welcome message

## Email Flow
- **Notification Email**: Sent to dhrubajyoti.das5793@gmail.com when someone submits the form
- **Welcome Email**: Sent to the person who submitted the form as confirmation

## Template Variables Used
The contact form sends these variables to EmailJS:
- `to_email` - Recipient email address
- `from_name` - Sender's name
- `from_email` - Sender's email address
- `message` - The message content
- `subject` - Email subject line

## Troubleshooting
- Make sure all IDs are correct
- Check browser console for errors
- Verify EmailJS service is active
- Ensure template variables match the code
- Check that your email service allows sending emails

## Free Tier Limits
- EmailJS free tier: 200 emails/month
- Consider upgrading if you expect more traffic
