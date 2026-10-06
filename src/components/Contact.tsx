import { useState } from "react";
import { Send, Mail, Linkedin, Github, Twitter, Instagram, ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sendNotificationEmail, sendWelcomeEmail } from "@/lib/email-config";
import { contactApi } from "@/lib/contact-api";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

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

      // Log to Supabase database (non-blocking error handling)
      try {
        await contactApi.create(formData);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.warn("Supabase logging failed:", errorMessage);
        toast({
          title: "Message sent, but logging skipped",
          description: "Email delivered successfully. Couldn't log to database.",
        });
      }

      toast({
        title: "Message sent successfully!",
        description: "Thanks for reaching out. I'll get back to you soon, and you should receive a confirmation email.",
      });

      // Reset form
      setFormData({ name: "", email: "", message: "" });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Failed to send email:', errorMessage);
      toast({
        title: "Failed to send message",
        description: errorMessage ? String(errorMessage).slice(0, 400) : "There was an error sending your message. Please try again or contact me directly.",
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
    { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/mrdhrubajyotidas/" },
    { icon: Github, label: "GitHub", href: "https://github.com/denimatfire" },
    { icon: Twitter, label: "Twitter", href: "https://x.com/Dhrubajyoti57" },
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/dhruba_das_?igsh=MXFtbHdxM3hqdmUwNw%3D%3D&utm_source=qr" },
    { icon: Mail, label: "Email", href: "mailto:dhrubajyoti.das5793@gmail.com" }
  ];

  const fieldClass =
    "w-full rounded-2xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-24">
      <div className="aurora aurora-soft opacity-60" />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let's <span className="text-gradient">connect</span>
            </>
          }
          description="I'm always interested in new opportunities, collaborations, or just a good conversation. Don't hesitate to reach out!"
        />

        <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Reveal className="glass rounded-3xl p-6 sm:p-8">
            <h3 className="mb-6 font-display text-2xl font-semibold text-foreground">Send a message</h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-foreground">
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-foreground">
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={fieldClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project, questions, or just say hello..."
                  rows={5}
                  className={`${fieldClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 font-semibold text-[hsl(240_24%_6%)] shadow-glow transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </form>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={0.08} className="glass rounded-3xl p-6 sm:p-8">
              <h3 className="mb-2 font-display text-xl font-semibold text-foreground">Connect with me</h3>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                Feel free to connect with me on social media or drop me an email.
                I'm active on several platforms and love engaging with the community.
              </p>
              <div className="flex flex-col gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-foreground/10 px-4 py-3 text-foreground transition-colors hover:border-primary/50 hover:bg-foreground/5"
                  >
                    <span className="flex items-center gap-3">
                      <social.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                      <span className="font-medium">{social.label}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.14} className="glass rounded-3xl p-6 sm:p-8">
              <h4 className="mb-4 font-display text-lg font-semibold text-foreground">Quick info</h4>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Response time</dt>
                  <dd className="text-right text-foreground">Usually within 24 hours</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Best time to reach</dt>
                  <dd className="text-right text-foreground">Mon–Fri, 9AM–6PM IST</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="text-right text-foreground">Chennai, India</dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;