// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Landing from "./pages/Landing";
import LoginForm from "./pages/Login";
import RegistrationForm from "./pages/Register";

// Student Dashboard
import Student_Dashboard from "./pages/Student_Dashboard";
import EditProfilePage from "./components/Student_Dashboard/EditProfile/EditProfilePage";
import UserProfilePage from "./components/Student_Dashboard/UserProfilePage";
import MyProjects from "./components/Student_Dashboard/myProjects/MyProjects";
import SkillBadgeForm from "./components/Student_Dashboard/SkillBadges/SkillBadgeForm";
import NotificationsPage from "./components/Student_Dashboard/NotificationsPage/NotificationsPage";
import Assessments from "./components/Student_Dashboard/dashboard/Assessments";
import QuizAttempt from "./components/Student_Dashboard/dashboard/QuizAttempt";

// Company / Others
import CompanyDashboardHome from "./pages/Index";
import CompanyNotFound from "./pages/NotFound";
import ContactPage from "./pages/ContactPage";
import ProjectShowcasePage from "./pages/ProjectShowcasePage";

// Mentor / Admin
import MentorDashboardRoutes from "./pages/MentorDashboardRoutes";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* ===== Public Routes ===== */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/projectShowcase" element={<ProjectShowcasePage />} />

        {/* ===== Student Dashboard Routes ===== */}
        <Route path="/dashboard" element={<Student_Dashboard />} />
        <Route path="/dashboard/profile" element={<UserProfilePage />} />
        <Route path="/dashboard/edit-profile" element={<EditProfilePage />} />
        <Route path="/dashboard/my-projects" element={<MyProjects />} />
        <Route path="/dashboard/assessments" element={<Assessments />} />
        <Route path="/dashboard/assessments/:id" element={<QuizAttempt />} />   
        <Route path="/dashboard/skill-badges" element={<SkillBadgeForm />} />
        <Route path="/dashboard/notifications" element={<NotificationsPage />} />
        
        {/* ===== Company Dashboard ===== */}
        <Route path="/company" element={<CompanyDashboardHome />} />
        <Route path="/company/*" element={<CompanyNotFound />} />

        {/* ===== Mentor Dashboard ===== */}
        <Route path="/mentor-dashboard/*" element={<MentorDashboardRoutes />} />

        {/* ===== Admin Panel ===== */}
        <Route path="/adminPanel" element={<AdminPanel />} />

        {/* ===== 404 ===== */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;