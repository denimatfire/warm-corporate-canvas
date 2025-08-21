import { ClipboardList, Cpu, BarChart3, Users, LineChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const highlights = [
    {
      icon: ClipboardList,
      title: "Product Management & Roadmapping",
      description: "Defining product vision, prioritizing features, and aligning stakeholders to deliver impactful solutions that enhance user adoption and business growth."
    },
    {
      icon: Cpu,
      title: "Connected Vehicles & Digital Innovation",
      description: "Building next-gen mobility products in telematics, IoT, OTA, and SDVs, seamlessly connecting technology with customer needs and experiences."
    },
    {
      icon: BarChart3,
      title: "Strategy & Business Planning",
      description: "Crafting data-driven strategies, business cases, and GTM plans that accelerate growth, optimize resources, and ensure long-term competitive advantage."
    },
    {
      icon: Users,
      title: "Cross-functional Leadership & Stakeholder Management",
      description: "Driving collaboration across CFTs and CXOs, managing roadmaps, and ensuring smooth execution by reducing roadblocks and delivering measurable outcomes."
    },
    {
      icon: LineChart,
      title: "Data-driven Decision Making",
      description: "Leveraging analytics, A/B testing, and visualization tools to refine products, optimize features, and maximize customer satisfaction and engagement."
    }
  ];

  return (
    <section id="about" className="py-20 px-6 bg-gradient-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            About <span className="bg-gradient-accent bg-clip-text text-transparent">Me</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              I'm a dedicated professional with over 7 years of experience in the automotive industry, 
              specializing in product management, corporate strategy, and digital transformation. 
              My work spans connected vehicles, software-defined vehicles, telematics, and 
              IoT solutions—where I bridge the gap between technology and user needs. 
              With a strong engineering foundation and an MBA from SPJIMR, 
              I combine technical depth with strategic insight to deliver products that drive 
              measurable business outcomes and enhance customer experiences.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
            Beyond work, I am passionate about continuous learning and collaboration. 
            I enjoy swimming, badminton, and traveling, which help me explore new perspectives 
            and fuel creativity. I believe in shaping products that not only solve complex 
            challenges but also create meaningful impact—connecting people, technology, and 
            possibilities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-slide-up">
          {highlights.map((highlight, index) => (
            <Card 
              key={highlight.title}
              className="glass-card hover-lift text-center rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <highlight.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 leading-tight">
                  {highlight.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {highlight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">7</div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">10+</div>
            <div className="text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">10+</div>
            <div className="text-muted-foreground">Team Members Led</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">20+</div>
            <div className="text-muted-foreground">Articles Written</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;