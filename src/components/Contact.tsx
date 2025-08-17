import { useState } from "react";
import { Send, Mail, Linkedin, Github, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { sendNotificationEmail, sendWelcomeEmail } from "@/lib/email-config";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all fields",
        description: "All fields are required to send your message.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send notification email to you
      await sendNotificationEmail(formData);

      // Send welcome email to the user
      await sendWelcomeEmail(formData);

      toast({
        title: "Message sent successfully!",
        description: "Thanks for reaching out. I'll get back to you soon, and you should receive a confirmation email.",
      });

      // Reset form
      setFormData({ name: "", email: "", message: "" });
      
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again or contact me directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/mrdhrubajyotidas/", color: "hover:text-blue-500" },
    { icon: Github, label: "GitHub", href: "https://github.com/denimatfire", color: "hover:text-purple-500" },
    { icon: Twitter, label: "Twitter", href: "https://x.com/Dhrubajyoti57", color: "hover:text-sky-500" },
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/dhruba_das_?igsh=MXFtbHdxM3hqdmUwNw%3D%3D&utm_source=qr", color: "hover:text-pink-500" },
    { icon: Mail, label: "Email", href: "mailto:dhrubajyoti.das5793@gmail.com", color: "hover:text-primary" }
  ];

  return (
    <section id="contact" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Let's <span className="bg-gradient-accent bg-clip-text text-transparent">Connect</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            I'm always interested in new opportunities, collaborations, or just a good conversation. 
            Don't hesitate to reach out!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <Card className="glass-card animate-slide-up">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell me about your project, questions, or just say hello..."
                    rows={5}
                    className="bg-background border-border focus:border-primary resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary-hover transition-all hover-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Social Links & Info */}
          <div className="space-y-8 animate-slide-up">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Connect With Me</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Feel free to connect with me on social media or drop me an email. 
                I'm active on several platforms and love engaging with the community.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 p-4 rounded-xl bg-card border border-border hover:border-primary transition-all hover-lift ${social.color}`}
                  >
                    <social.icon className="w-6 h-6" />
                    <span className="font-medium">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <h4 className="text-lg font-semibold text-foreground mb-4">Quick Info</h4>
              <div className="space-y-3 text-muted-foreground">
                <div>
                  <strong className="text-foreground">Response Time:</strong> Usually within 24 hours
                </div>
                <div>
                  <strong className="text-foreground">Best Time to Reach:</strong> Monday-Friday, 9AM-6PM EST
                </div>
                <div>
                  <strong className="text-foreground">Location:</strong> San Francisco, CA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;