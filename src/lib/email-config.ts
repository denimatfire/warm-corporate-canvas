// EmailJS Configuration
export const EMAILJS_CONFIG = {
  SERVICE_ID: "service_l2hds2a", // EmailJS service ID
  TEMPLATE_ID: "template_guzvtrl", // EmailJS template ID
  PUBLIC_KEY: "Vo3HZtehAtALMRxnT", // EmailJS public key
};

// Initialize EmailJS
export const initializeEmailJS = async () => {
  try {
    const emailjs = await import('@emailjs/browser');
    emailjs.default.init(EMAILJS_CONFIG.PUBLIC_KEY);
    return emailjs.default;
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
    throw error;
  }
};

// Send email function
export const sendEmail = async (templateParams: any) => {
  try {
    const emailjs = await initializeEmailJS();
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    
    return response;
  } catch (error) {
    console.error('EmailJS error:', error);
    throw error;
  }
};

// Send notification email to you
export const sendNotificationEmail = async (formData: {
  name: string;
  email: string;
  message: string;
}) => {
  const params = {
    to_email: "dhrubajyoti.das5793@gmail.com",
    from_name: formData.name,
    from_email: formData.email,
    message: formData.message,
    subject: `New Contact Form Submission from ${formData.name}`,
  };
  
  return sendEmail(params);
};

// Send welcome email to user
export const sendWelcomeEmail = async (formData: {
  name: string;
  email: string;
  message: string;
}) => {
  const params = {
    to_email: formData.email,
    to_name: formData.name,
    subject: "Thank you for reaching out!",
    message: `Hi ${formData.name},\n\nThank you for reaching out to me. I've received your message and will get back to you within 24 hours.\n\nBest regards,\nDhrubajyoti Das`,
  };
  
  return sendEmail(params);
};
