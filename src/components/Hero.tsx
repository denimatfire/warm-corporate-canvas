import { Calendar, Award, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
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
                <span className="text-white">
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
      year: 2017,
      title: "Started Career",
      description: "Began professional journey in Factory Planning",
      icon: Briefcase,
      color: "text-primary"
    },
    {
      year: 2019,
      title: "First Major Achievement",
      description: "Successfully completed the first project on Autonomous Grinding Manufacturing Line",
      icon: Award,
      color: "text-primary"
    },
    {
      year: 2021,
      title: "Career Shift",
      description: "Moved to Corporate/ Product Strategy and Planning",
      icon: GraduationCap,
      color: "text-primary"
    },
    {
      year: 2023,
      title: "Academic Excellence",
      description: "Awarded the prestigious MBA degree from SPJIMR",
      icon: Award,
      color: "text-primary"
    },
    {
      year: 2024,
      title: "Current Focus",
      description: "Building Software Defined Vehicles Solutions in Autonomous Driving",
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

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden">
          <div className="relative pl-12">
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-muted" />
            {timelineData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.year} className="relative mb-12">
                  <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary ring-3 ring-background flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="ml-2">
                    <div className="text-base font-semibold text-primary ml-12">{item.year}</div>
                    <div className="mt-2 inline-block bg-card text-card-foreground border border-primary/40 px-3 py-1 rounded-md shadow-soft ml-12">
                      {item.title}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed ml-12">
                      {item.description}
                    </p>
                    {index < timelineData.length - 1 && (
                      <div className="ml-12 mt-6 border-t border-dashed border-muted opacity-60" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop: alternating horizontal timeline */}
        <div className="relative h-[360px] hidden lg:block">
          {/* Core timeline bar */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 rounded-full bg-foreground/60" />
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 rounded-full bg-foreground/30" />

          {/* Columns for items */}
          <div className="grid grid-cols-5 h-full">
            {timelineData.map((item, index) => {
              const isTop = index % 2 === 0; // alternate like the reference: top, bottom, top, bottom, top
              const Icon = item.icon;
              const yearPositionClass = isTop ? "top-[calc(50%+56px)]" : "top-[calc(50%-64px)]";
              return (
                <div key={item.year} className="relative flex items-center justify-center">
                  {/* Circle on the bar */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-primary shadow-glow ring-4 ring-background flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary-foreground" />
                  </div>

                  {/* Year label on the bar */}
                  <div className={`absolute left-1/2 -translate-x-1/2 ${yearPositionClass} text-lg font-semibold text-primary`}>
                    {item.year}
                  </div>

                  {/* Stem to caption */}
                  {isTop ? (
                    <>
                      <div
                        className="absolute left-1/2 -translate-x-1/2 w-1 bg-foreground/40"
                        style={{ bottom: "calc(50% + 28px)", height: "72px" }}
                      />
                      <div
                        className="absolute -translate-x-1/2 left-1/2"
                        style={{ bottom: "calc(50% + 112px)" }}
                      >
                        <div className="bg-card text-card-foreground border border-primary/40 px-4 py-2 rounded-md shadow-soft text-center whitespace-nowrap">
                          {item.title}
                        </div>
                        <div className="mt-3 w-56 text-sm text-muted-foreground text-center leading-relaxed">
                          {item.description}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="absolute left-1/2 -translate-x-1/2 w-1 bg-foreground/40"
                        style={{ top: "calc(50% + 28px)", height: "72px" }}
                      />
                      <div
                        className="absolute -translate-x-1/2 left-1/2"
                        style={{ top: "calc(50% + 112px)" }}
                      >
                        <div className="bg-card text-card-foreground border border-primary/40 px-4 py-2 rounded-md shadow-soft text-center whitespace-nowrap">
                          {item.title}
                        </div>
                        <div className="mt-3 w-56 text-sm text-muted-foreground text-center leading-relaxed">
                          {item.description}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Timeline };
export default Hero;