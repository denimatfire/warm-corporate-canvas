import { Calendar, Award, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import profilePhoto from "@/assets/profile-photo.jpg";

const Hero = () => {
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
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <div className="mb-8">
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
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore My Journey
              </Button>
            </div>

            {/* Profile Photo - Mobile */}
            <div className="lg:hidden mb-8 flex justify-center">
              <div className="relative">
                <img
                  src={profilePhoto}
                  alt="Alex Johnson"
                  className="w-64 h-64 object-cover rounded-2xl shadow-soft"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>

          {/* Right Content - Photo & Timeline */}
          <div className="animate-slide-up">
            {/* Profile Photo - Desktop */}
            <div className="hidden lg:block mb-12">
              <div className="relative">
                <img
                  src={profilePhoto}
                  alt="Alex Johnson"
                  className="w-full max-w-md mx-auto object-cover rounded-2xl shadow-soft hover-lift"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
              </div>
            </div>

            {/* Interactive Timeline */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Career Milestones</h3>
              <div className="space-y-4">
                {timelineData.map((item, index) => (
                  <Card 
                    key={item.year} 
                    className="glass-card hover-lift cursor-pointer group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <item.icon className={`w-6 h-6 ${item.color}`} />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl font-bold text-primary">{item.year}</span>
                            <div className="h-px bg-border flex-grow"></div>
                          </div>
                          <h4 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;