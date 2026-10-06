import { ClipboardList, Cpu, BarChart3, Users, LineChart, Waves, Plane, Trophy } from "lucide-react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

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

const stats = [
  { value: "7", label: "Years Experience" },
  { value: "10+", label: "Projects Completed" },
  { value: "10+", label: "Team Members Led" },
  { value: "20+", label: "Articles Written" },
];

const hobbies = [
  { icon: Waves, label: "Swimming" },
  { icon: Trophy, label: "Badminton" },
  { icon: Plane, label: "Traveling" },
];

// The first two highlights get wider tiles so five cards fill two rows evenly
const highlightSpan = (index: number) => (index < 2 ? "lg:col-span-3" : "lg:col-span-2");

const About = () => (
  <section id="about" className="relative px-6 py-24">
    <div className="mx-auto max-w-6xl">
      <SectionHeading
        eyebrow="About"
        title={
          <>
            Bridging technology <span className="text-gradient">&amp; people</span>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Reveal className="glass relative col-span-2 overflow-hidden rounded-3xl p-6 sm:p-8 lg:row-span-2">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <p className="relative text-lg leading-relaxed text-foreground/90">
            I'm a dedicated professional with over 7 years of experience in the automotive industry,
            specializing in product management, corporate strategy, and digital transformation.
            My work spans connected vehicles, software-defined vehicles, telematics, and
            IoT solutions—where I bridge the gap between technology and user needs.
          </p>
          <p className="relative mt-4 leading-relaxed text-muted-foreground">
            With a strong engineering foundation and an MBA from SPJIMR,
            I combine technical depth with strategic insight to deliver products that drive
            measurable business outcomes and enhance customer experiences.
          </p>
        </Reveal>

        {stats.map((stat, index) => (
          <Reveal
            key={stat.label}
            delay={0.05 * (index + 1)}
            className="glass glow-card flex flex-col justify-between rounded-3xl p-5 sm:p-6"
          >
            <div className="font-display text-4xl font-semibold tracking-tight text-gradient sm:text-5xl">{stat.value}</div>
            <div className="mt-6 text-sm text-muted-foreground">{stat.label}</div>
          </Reveal>
        ))}

        <Reveal className="glass col-span-2 rounded-3xl p-6 sm:p-8 lg:col-span-4">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">Beyond work</div>
              <p className="leading-relaxed text-muted-foreground">
                I am passionate about continuous learning and collaboration. I enjoy swimming, badminton,
                and traveling, which help me explore new perspectives and fuel creativity. I believe in shaping products
                that not only solve complex challenges but also create meaningful impact—connecting people,
                technology, and possibilities.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {hobbies.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-4 py-2 text-sm text-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <h3 className="mb-6 mt-20 font-display text-2xl font-semibold text-foreground">What I do</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {highlights.map((highlight, index) => (
          <Reveal
            key={highlight.title}
            delay={index * 0.06}
            className={`glass glow-card group rounded-3xl p-7 ${highlightSpan(index)}`}
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <highlight.icon className="h-6 w-6" />
            </div>
            <h4 className="font-display text-lg font-semibold leading-snug text-foreground">{highlight.title}</h4>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{highlight.description}</p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default About;
