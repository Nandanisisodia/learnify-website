import { useState } from "react";
import Sidebar from "../components/Company_Dashboard/Sidebar";
import Navbar from "../components/Company_Dashboard/Navbar";
import StatCard from "../components/Company_Dashboard/StatCard";
import StudentCard from "../components/Company_Dashboard/StudentCard";
import SearchFilters from "../components/Company_Dashboard/SearchFilters";
import InterviewsSection from "../components/Company_Dashboard/InterviewsSection";
import { Button } from "../components/Company_Dashboard/ui/button";
import { motion } from "framer-motion";
import { Users, Calendar, Award, TrendingUp, UserCheck, Target } from "lucide-react";
import HiringAnimation3D from "../components/Company_Dashboard/3DHiringAnimation";
import boy from '../assets/boy2.png'

// Mock students data
const mockStudents = [
  {
    id: "1",
    name: "Amit",
    domain: "MERN Stack Developer",
    skillLevel: "Advanced" ,
    badges: ["React Expert", "Node.js", "AWS Certified", "Open Source Contributor"],
    location: "Jaipur, Rajasthan",
    experience: "3+ years",
    rating: 4.8,
    lastActive: "2 hours ago",
  },
  {
    id: "2",
    name: "Nandani Sisodia",
    domain: "Web Development",
    skillLevel: "Intermediate" ,
    badges: ["Python", "TensorFlow", "Data Analysis"],
    location: "Bangalore, India",
    experience: "2 years",
    rating: 4.9,
    lastActive: "1 day ago",
  },
  {
    id: "3",
    name: "Shashank",
    domain: "Mobile Development",
    skillLevel: "Advanced" ,
    badges: ["React Native", "iOS", "Android", "Flutter"],
    location: "Seoul, South Korea",
    experience: "4+ years",
    rating: 4.9,
    lastActive: "5 hours ago",
  },
  {
    id: "4",
    name: "Panav",
    domain: "UI/UX Design",
    skillLevel: "Intermediate" ,
    badges: ["Figma", "User Research", "Prototyping"],
    location: "Barcelona, Spain",
    experience: "2-3 years",
    rating: 4.7,
    lastActive: "3 hours ago",
  },
  {
    id: "5",
    name: "James Wilson",
    domain: "Data Science",
    skillLevel: "Beginner" ,
    badges: ["Python", "SQL", "Statistics"],
    location: "London, UK",
    experience: "1 year",
    rating: 4.3,
    lastActive: "1 hour ago",
  },
  {
    id: "6",
    name: "Lisa Chen",
    domain: "DevOps",
    skillLevel: "Advanced" ,
    badges: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    location: "Toronto, Canada",
    experience: "5+ years",
    rating: 4.9,
    lastActive: "6 hours ago",
  },
];

export default function Index() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const [filters, setFilters] = useState({
    domain: "All Domains",
    projectExperience: "All Levels",
    skillLevel: "All Skills",
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      domain: "All Domains",
      projectExperience: "All Levels",
      skillLevel: "All Skills",
    });
  };

  const handleViewProfile = (studentId) => {
    console.log("View profile for student:", studentId);
  };

  const handleContact = (studentId) => {
    console.log("Contact student:", studentId);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Navbar */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* Page Content */}
        <div className="pt-20 px-4 sm:px-6 py-6">
          {/* Hero Section */}
          <motion.section
            className="hero-gradient rounded-2xl p-6 sm:p-6 mb-8 text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 items-center">
              <div>
                <motion.h1
                  className="text-3xl sm:text-4xl font-bold mb-8 select-none"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-[#01BDA5] via-[#43cea2] to-[#FF824C] bg-clip-text text-transparent font-extrabold drop-shadow-lg">
                    Candidates
                  </span>{" "}
                  Hiring Dashboard
                </motion.h1>
                <motion.p
                  className="text-base sm:text-xl text-white/90 mb-4  select-none"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Discover talented students, schedule interviews, and build your dream team with our comprehensive hiring platform.
                </motion.p>
                <motion.div
                  className="flex flex-wrap gap-4 "
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  
                    <Button variant="logo" size="lg" className="glass-button text-white border-white/30 hover:border-white/50">
                      
                        <Target className="w-5 h-5 mr-2" />
                    
                      Start Hiring
                    </Button>
                  
                  <Button variant="glass" size="lg" className="border-white/30 hover:border-white/50">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Learn More
                  </Button>
                </motion.div>
              </div>

              {/* 3D Animation */}
              <div className="hidden lg:block">
                <HiringAnimation3D />
              </div>

              {/* Image */}
              <div className="mt-6 lg:mt-0">
                <motion.img
                  src={boy}
                  alt="Programmer"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[340px] h-auto mx-auto drop-shadow-2xl"
                  style={{ borderRadius: "2rem" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
            </div>
          </motion.section>

          {/* Stats Overview */}
          <section className="mb-8">
            <motion.h2
              className="text-2xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Hiring Overview
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Students Available"
                value="2,847"
                subtitle="+12% from last month"
                icon={Users}
                color="primary"
                delay={0.1}
              />
              <StatCard
                title="Interviews Scheduled"
                value="24"
                subtitle="This week"
                icon={Calendar}
                color="secondary"
                delay={0.2}
              />
              <StatCard
                title="Mentored Students"
                value="156"
                subtitle="Active mentorships"
                icon={UserCheck}
                color="success"
                delay={0.3}
              />
              <StatCard
                title="Verified Badges"
                value="1,923"
                subtitle="Across all students"
                icon={Award}
                color="warning"
                delay={0.4}
              />
            </div>
          </section>

          {/* Filters + Student Cards */}
          <section className="mb-8">
            <motion.h2
              className="text-2xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Find the Perfect Candidate
            </motion.h2>

            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockStudents.map((student, index) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onViewProfile={handleViewProfile}
                  onContact={handleContact}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </section>

          {/* Interviews Section */}
          <section className="mb-8">
            <InterviewsSection />
          </section>

          {/* Footer */}
          <footer className="text-center py-8 border-t border-border mt-12">
            <p className="text-muted-foreground">
              © 2025. Empowering the next generation of talent.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
