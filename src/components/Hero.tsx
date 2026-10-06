import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  ArrowRight,
  ArrowDown,
  Sparkles,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import profilePhoto from "@/assets/profile-photo.jpg";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const EASE = [0.22, 1, 0.36, 1] as const;

const quickLinks = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/mrdhrubajyotidas/" },
  { icon: Github, label: "GitHub", href: "https://github.com/denimatfire" },
  { icon: Mail, label: "Email", href: "mailto:dhrubajyoti.das5793@gmail.com" },
];

const Hero = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const fadeUp = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-32">
      <div className="aurora" />
      <div className="grid-fade" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[1.25fr_1fr]">
        <div className="text-center lg:text-left">
          <motion.div
            {...fadeUp(0)}
            className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Good day · Welcome
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Hello, I'm
            <br />
            <span className="text-gradient">Dhrubajyoti Das</span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="mt-6 font-display text-lg font-medium text-foreground/90 sm:text-xl">
            Product strategy for connected &amp; software-defined vehicles
          </motion.p>

          <motion.p
            {...fadeUp(0.22)}
            className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0"
          >
            A passionate professional crafting innovative solutions and meaningful experiences.
            Dedicated to excellence, creativity, and making a positive impact.
          </motion.p>

          <motion.div
            {...fadeUp(0.3)}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <button
              onClick={() => navigate("/writing")}
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-accent px-6 py-3.5 font-semibold text-[hsl(240_24%_6%)] shadow-glow transition-transform hover:scale-[1.03]"
            >
              Read my writing
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate("/career")}
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold text-foreground transition-colors hover:bg-foreground/10"
            >
              Explore my journey
            </button>
          </motion.div>

          <motion.div {...fadeUp(0.38)} className="mt-8 flex items-center justify-center gap-2 lg:justify-start">
            {quickLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/10 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-accent opacity-25 blur-3xl" />
          <div className="gradient-ring relative rounded-[2rem]">
            <img
              src={profilePhoto}
              alt="Dhrubajyoti Das"
              className="aspect-[4/5] w-full rounded-[2rem] object-cover"
            />
          </div>

          <div className="glass absolute -left-4 top-8 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-10">
            <span className="font-display text-2xl font-semibold text-gradient">7+</span>
            <span className="text-xs leading-tight text-muted-foreground">
              years in
              <br />
              automotive
            </span>
          </div>
          <div className="glass absolute -right-4 bottom-10 max-w-[13rem] rounded-2xl px-4 py-3 sm:-right-8">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Now
            </div>
            <p className="text-sm leading-snug text-foreground">Software-defined vehicles &amp; autonomous driving</p>
          </div>
        </motion.div>
      </div>

      <button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground md:flex"
      >
        Scroll
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </button>
    </section>
  );
};

const timelineData = [
  {
    year: 2017,
    title: "Started Career",
    description: "Began professional journey in Factory Planning",
    icon: Briefcase,
  },
  {
    year: 2019,
    title: "First Major Achievement",
    description: "Successfully completed the first project on Autonomous Grinding Manufacturing Line",
    icon: Award,
  },
  {
    year: 2021,
    title: "Career Shift",
    description: "Moved to Corporate/ Product Strategy and Planning",
    icon: GraduationCap,
  },
  {
    year: 2023,
    title: "Academic Excellence",
    description: "Awarded the prestigious MBA degree from SPJIMR",
    icon: Award,
  },
  {
    year: 2024,
    title: "Current Focus",
    description: "Building Software Defined Vehicles Solutions in Autonomous Driving",
    icon: Calendar,
  },
];

const Timeline = () => (
  <section id="timeline" className="relative px-6 py-24">
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        eyebrow="Journey"
        title={
          <>
            Career <span className="text-gradient">milestones</span>
          </>
        }
        description="A journey through key moments that shaped my professional path."
      />

      <div className="relative">
        {/* Connecting line: vertical on mobile, horizontal on desktop */}
        <div className="absolute bottom-0 left-[1.375rem] top-0 w-px bg-gradient-to-b from-primary/60 via-accent/40 to-transparent lg:hidden" />
        <div className="absolute left-0 right-0 top-[1.375rem] hidden h-px bg-gradient-to-r from-primary/60 via-accent/50 to-primary/10 lg:block" />

        <ol className="grid gap-8 lg:grid-cols-5 lg:gap-5">
          {timelineData.map((item, index) => {
            const Icon = item.icon;
            const isCurrent = index === timelineData.length - 1;
            return (
              <Reveal as="li" key={item.year} delay={index * 0.08} className="relative flex gap-5 lg:flex-col">
                  <span
                    className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${
                      isCurrent
                        ? "border-transparent bg-gradient-accent text-[hsl(240_24%_6%)] shadow-glow"
                        : "border-foreground/15 bg-background text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="glass glow-card flex-1 rounded-2xl p-5">
                    <div className="font-display text-3xl font-semibold text-gradient">{item.year}</div>
                    <h3 className="mt-2 font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </div>
  </section>
);

export { Timeline };
export default Hero;
