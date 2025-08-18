import { Code, Users, Target, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const highlights = [
    {
      icon: Code,
      title: "Technical Excellence",
      description: "Passionate about clean code, innovative solutions, and staying current with industry trends."
    },
    {
      icon: Users,
      title: "Collaborative Leadership",
      description: "Experience leading cross-functional teams and mentoring junior professionals."
    },
    {
      icon: Target,
      title: "Strategic Thinking",
      description: "Focus on delivering measurable results and creating value for organizations."
    },
    {
      icon: Heart,
      title: "Personal Growth",
      description: "Committed to continuous learning and helping others achieve their potential."
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-slide-up">
          {highlights.map((highlight, index) => (
            <Card 
              key={highlight.title}
              className="glass-card hover-lift text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <highlight.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {highlight.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {highlight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">6+</div>
            <div className="text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">50+</div>
            <div className="text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">20+</div>
            <div className="text-muted-foreground">Team Members Led</div>
          </div>
          <div className="text-center">
            <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">15+</div>
            <div className="text-muted-foreground">Articles Written</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;