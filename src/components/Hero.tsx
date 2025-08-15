import { Calendar, Award, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import profilePhoto from "@/assets/profile-photo.jpg";

const Hero = () => {

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Profile Photo - Left */}
          <div className="animate-fade-in order-2 lg:order-1">
            <div className="relative flex justify-center lg:justify-start">
              <img
                src={profilePhoto}
                alt="Alex Johnson"
                className="w-80 h-80 lg:w-96 lg:h-96 object-cover rounded-2xl shadow-soft hover-lift"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          {/* Content - Right */}
          <div className="animate-slide-up order-1 lg:order-2 flex flex-col justify-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                Hello, I'm{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  Alex Johnson
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                A passionate professional crafting innovative solutions and meaningful experiences. 
                Dedicated to excellence, creativity, and making a positive impact.
              </p>
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-hover transition-all hover-glow"
                onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore My Journey
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Horizontal Timeline Component
const Timeline = () => {
  const timelineData = [
    {
      year: 2018,
      title: "Started Career",
      description: "Began professional journey in technology",
      icon: Briefcase,
      color: "text-primary"
    },
    {
      year: 2020,
      title: "First Major Achievement",
      description: "Led a team of 5 developers on a successful project",
      icon: Award,
      color: "text-primary"
    },
    {
      year: 2021,
      title: "Advanced Certification",
      description: "Completed advanced professional development",
      icon: GraduationCap,
      color: "text-primary"
    },
    {
      year: 2023,
      title: "Leadership Role",
      description: "Promoted to senior position, mentoring others",
      icon: Award,
      color: "text-primary"
    },
    {
      year: 2024,
      title: "Current Focus",
      description: "Building innovative solutions and sharing knowledge",
      icon: Calendar,
      color: "text-primary"
    }
  ];

  return (
    <section id="timeline" className="py-20 px-6 bg-gradient-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Career <span className="bg-gradient-accent bg-clip-text text-transparent">Milestones</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A journey through key moments that shaped my professional path
          </p>
        </div>

        {/* Horizontal Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border transform -translate-y-1/2 hidden lg:block"></div>
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-accent transform -translate-y-1/2 hidden lg:block opacity-50"></div>

          {/* Timeline Items */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative">
            {timelineData.map((item, index) => (
              <Card 
                key={item.year}
                className="glass-card hover-lift cursor-pointer group relative"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Timeline Dot */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-glow hidden lg:flex">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>

                <CardContent className="p-6 text-center">
                  {/* Mobile Icon */}
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 lg:hidden">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>

                  <div className="text-3xl font-bold text-primary mb-2">{item.year}</div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Timeline };
export default Hero;