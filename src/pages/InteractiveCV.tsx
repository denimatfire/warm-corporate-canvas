import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { 
  Mail, 
  Phone, 
  Linkedin, 
  MapPin, 
  Calendar, 
  Award, 
  GraduationCap,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const InteractiveCV = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    experience: true,
    education: true,
    certifications: true,
    projects: false,
    awards: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBackNavigation = () => {
    // Try to go back, if no history, go to home page
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-12 pt-24">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackNavigation}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        {/* Header Section */}
        <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-6xl font-bold">
                DD
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">Dhrubajyoti Das</h1>
                <p className="text-xl opacity-90 mb-4">Product Owner & Corporate Strategist</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:dhrubajyoti.das5793@gmail.com" className="hover:underline">
                      dhrubajyoti.das5793@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href="tel:+918011985310" className="hover:underline">
                      +91 8011985310
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    <a 
                      href="https://www.linkedin.com/in/mrdhrubajyotidas/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1"
                    >
                      LinkedIn <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => scrollToSection('highlights')}>
                Career Highlights
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection('experience')}>
                Experience
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection('education')}>
                Education
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection('certifications')}>
                Certifications
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection('projects')}>
                Projects
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection('awards')}>
                Awards
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Career Highlights */}
        <Card id="highlights" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Career Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>7+ years of experience in the Automotive industry: Product Management, Product Strategy & Corporate Strategy</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>End-to-End Project Management - IT & Non-IT, Financial Management (Capex), New Product Planning & Development</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p>Worked in Software Defined Vehicles (SDVs), Telematics, Connected Vehicles, ADAS, IOT Hub and Data Management</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p>Adept at managing project timelines, Budgeting and deliverables, business case preparation, Vendor Management</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p>Coordinated with CFTs & CXOs for crafting a Strategic Business Plans and Technology Roadmaps</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card id="experience" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Work Experience
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('experience')}
              >
                {expandedSections.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          {expandedSections.experience && (
            <CardContent className="space-y-6">
              {/* Royal Enfield */}
              <div className="border-l-4 border-blue-500 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-semibold">Product Owner</h3>
                  <Badge variant="secondary" className="w-fit">2024 - Present</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-4">Royal Enfield Motorcycles LTD.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm">Defined product vision, created a roadmap, and aligned stakeholders, leading to <strong>9% user adoption</strong> and <strong>2% revenue growth</strong></p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm">Identified market gaps, executed GTM strategy, and launched features, boosting <strong>retention by 12%</strong> and <strong>adoption by 20%</strong> in 8 months</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm">Led sprint planning, backlog grooming, and user story creation, improving development efficiency, <strong>reducing rework by 15%</strong></p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm">Leveraged IoT, APIs, and cloud knowledge to bridge product-engineering gaps while using analytics to optimize features</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm">Implemented real-time monitoring and user feedback collection, increasing <strong>OTA update success rate from 70% to 85%</strong></p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm">Conducted user research and A/B testing, refining UX flows and increasing <strong>feature adoption rates by 15%</strong></p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Tata Motors */}
              <div className="border-l-4 border-purple-500 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-xl font-semibold">Corporate Planner, Buses PL & Research Centre</h3>
                  <Badge variant="secondary" className="w-fit">2017 - 2022</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-4">TATA Motors LTD.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      <p className="text-sm">Led the development of a 5-year strategic plan, driving market share increase, and built data-driven business cases</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      <p className="text-sm">Successfully led <strong>10+ capital projects worth ₹25 Cr</strong>, overseeing planning, budgeting, execution, and closure</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      <p className="text-sm">Managed budgeting for 7 plants and 5 product lines, saving <strong>₹200 Cr through asset leasing and deferred CAPEX</strong></p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      <p className="text-sm">Developed financial models for investment appraisal, evaluating <strong>₹2500 Cr in opportunities</strong> to maximize profitability</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      <p className="text-sm">Led ERP architecture development using SAP PS and MM modules; integrated IoT and Cloud solutions</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      <p className="text-sm">Developed Power Apps dashboards, improving <strong>CSAT scores by 20%</strong>, and implemented RPA, reducing <strong>MIS time by 80%</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Education */}
        <Card id="education" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('education')}
              >
                {expandedSections.education ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          {expandedSections.education && (
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold">International Immersion</h3>
                    <p className="text-muted-foreground">INSEAD, France</p>
                  </div>
                  <Badge variant="outline">2024</Badge>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold">MBA (General Management)</h3>
                    <p className="text-muted-foreground">SP Jain Institute of Management & Research, Mumbai</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">2022 - 2024</Badge>
                    <Badge variant="secondary">3.01/4</Badge>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold">M.Tech (Aerodynamics)</h3>
                    <p className="text-muted-foreground">IIT Guwahati</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">2015 - 2017</Badge>
                    <Badge variant="secondary">9.36/10</Badge>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                  <div>
                    <h3 className="font-semibold">B.E (Mechanical Engineering)</h3>
                    <p className="text-muted-foreground">Assam Engineering College</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">2011 - 2015</Badge>
                    <Badge variant="secondary">85%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Certifications & Tools */}
        <Card id="certifications" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certifications & Tools
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('certifications')}
              >
                {expandedSections.certifications ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          {expandedSections.certifications && (
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Certifications</h3>
                  <div className="space-y-2">
                    <Badge variant="outline" className="mr-2 mb-2">Microsoft Azure Fundamentals</Badge>
                    <Badge variant="outline" className="mr-2 mb-2">Lean Six Sigma Green Belt</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Software & Tools</h3>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">JIRA</Badge>
                      <Badge variant="secondary" className="text-xs">Confluence</Badge>
                      <Badge variant="secondary" className="text-xs">Figma</Badge>
                      <Badge variant="secondary" className="text-xs">SAP S/4 HANA</Badge>
                      <Badge variant="secondary" className="text-xs">SQL</Badge>
                      <Badge variant="secondary" className="text-xs">Tableau</Badge>
                      <Badge variant="secondary" className="text-xs">Power BI</Badge>
                      <Badge variant="secondary" className="text-xs">MS Office Suite</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Academic Projects */}
        <Card id="projects" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Academic Projects
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('projects')}
              >
                {expandedSections.projects ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          {expandedSections.projects && (
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">Business Consulting - Royal Enfield Electric Strategy</h3>
                  <p className="text-muted-foreground text-sm">Devised a Go-To-Market (GTM) strategy for Royal Enfield into the Electric Two Wheeler Segment</p>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">Design Thinking - Roadside Artist Support</h3>
                  <p className="text-muted-foreground text-sm">Devised a solution to support roadside artist's business during inclement weather conditions</p>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">Business Analytics - Swiggy Optimization</h3>
                  <p className="text-muted-foreground text-sm">Leveraged Business Analytics tools – Power BI to analyze Swiggy order delivery and driving optimizations</p>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">Market Research - Johnson's Baby Products</h3>
                  <p className="text-muted-foreground text-sm">Drafted business plan for new baby products of Johnsons through extensive field survey and market research</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Awards */}
        <Card id="awards" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Awards & Achievements
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSection('awards')}
              >
                {expandedSections.awards ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          {expandedSections.awards && (
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                  <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">National Finalist - Henkle Hackathon</h3>
                    <p className="text-sm text-muted-foreground">Presented a case on "Streamlining Supply Chain by AI ML and Blockchain"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Merit Award Holder</h3>
                    <p className="text-sm text-muted-foreground">BE and XII standard</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg">
                  <Award className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Top Rank Holder</h3>
                    <p className="text-sm text-muted-foreground">National Science Olympiad</p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Download CV Button */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Download className="w-4 h-4 mr-2" />
            Download CV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveCV;
