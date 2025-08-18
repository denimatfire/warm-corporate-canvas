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
                alt="Dhrubajyoti Das"
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
                  Dhrubajyoti Das
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
      description: "Began professional journey in technology with focus on innovation",
      icon: Briefcase,
    },
    {
      year: 2020,
      title: "First Major Achievement",
      description: "Led a team of 5 developers on a successful project delivery",
      icon: Award,
    },
    {
      year: 2021,
      title: "Advanced Certification",
      description: "Completed advanced professional development and specialization",
      icon: GraduationCap,
    },
    {
      year: 2023,
      title: "Leadership Role",
      description: "Promoted to senior position, mentoring and guiding teams",
      icon: Award,
    },
    {
      year: 2024,
      title: "Current Focus",
      description: "Building innovative solutions and sharing industry knowledge",
      icon: Calendar,
    }
  ];

  return (
    <section id="timeline" className="py-20 px-6 bg-gradient-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Career <span className="bg-gradient-accent bg-clip-text text-transparent">Timeline</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A journey through key moments that shaped my professional path
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main Timeline Bar */}
          <div className="hidden lg:block">
            <div className="absolute top-1/2 left-0 right-0 h-12 bg-gray-800 transform -translate-y-1/2 rounded-lg shadow-lg"></div>
            
            {/* Year Labels on Timeline Bar */}
            <div className="relative flex justify-between items-center h-24">
              {timelineData.map((item, index) => (
                <div key={item.year} className="flex flex-col items-center relative">
                  {/* Year Label on Bar */}
                  <div className="absolute top-1/2 transform -translate-y-1/2 bg-gray-800 text-white font-bold text-lg px-4 py-2 rounded">
                    {item.year}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Items with Alternating Positions */}
            <div className="relative">
              {timelineData.map((item, index) => {
                const isTop = index % 2 === 0;
                const leftPosition = (index / (timelineData.length - 1)) * 100;
                
                return (
                  <div
                    key={item.year}
                    className="absolute"
                    style={{ left: `${leftPosition}%`, transform: 'translateX(-50%)' }}
                  >
                    {/* Connecting Line */}
                    <div 
                      className={`absolute left-1/2 w-0.5 bg-green-600 transform -translate-x-1/2 ${
                        isTop ? 'top-12 h-16' : 'top-0 h-16'
                      }`}
                    ></div>
                    
                    {/* Timeline Circle */}
                    <div 
                      className={`absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white ${
                        isTop ? 'top-24' : '-top-8'
                      }`}
                    >
                      <item.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Caption Box */}
                    <Card 
                      className={`w-72 bg-white border-2 border-green-600 shadow-lg hover:shadow-xl transition-all duration-300 ${
                        isTop ? 'mt-44' : '-mt-32'
                      }`}
                    >
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden space-y-8">
            {timelineData.map((item, index) => (
              <div key={item.year} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <Card className="flex-1 bg-white border-2 border-green-600">
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-green-600 mb-2">{item.year}</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Timeline };
export default Hero;