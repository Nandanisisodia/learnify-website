# 🎓 Learnify — HR Assessment & Learning Platform

> A full-stack web platform enabling candidates to practice HR interview questions, attempt assessments, and review performance scores — while giving HR teams real-time visibility into candidate progress.

---

## 🚀 Live Demo

> Coming soon (Deployment in progress)

**Demo Credentials:**
| Role | How to Access |
|------|--------------|
| Student | Register on the platform |
| Admin | Contact the project owner for admin credentials |

---

## 📸 Screenshots

### Landing Page
![Landing Page](./screenshots/landing.png)

### Student Dashboard
![Student Dashboard](./screenshots/student-dashboard.png)

### Admin Panel
![Admin Panel](./screenshots/admin-panel.png)

### Assessment/Quiz
![Assessment](./screenshots/assessment.png)

### HR Practice
![HR Practice](./screenshots/hr-practice.png)

---

## ✨ Features

### 👨‍🎓 Candidate Side
- **Secure Registration & Login** — bcrypt password hashing, role-based access
- **Student Dashboard** — real-time stats (attendance, tasks, reward points), notice board, assignments
- **HR Questions Practice** — practice common HR interview questions with rule-based AI feedback & scoring
- **Assessment/Quiz System** — attempt MCQ-based quizzes, get instant scores, view performance history
- **Edit Profile** — update personal info, LinkedIn/GitHub URLs, domains of interest
- **My Projects** — submit and track personal projects
- **Skill Badges** — add and showcase skill achievements
- **Notifications** — real-time platform notices

### 👨‍💼 HR/Admin Side
- **Admin Dashboard** — real-time platform overview (students, companies, hires, projects)
- **Student Management** — approve/reject candidates, track progress
- **Company Management** — add/approve companies, track hire counts
- **Assignment Management** — assign tasks to specific students (reflects instantly on student dashboard)
- **Assessment Management** — create MCQ quizzes with multiple questions and correct answers
- **HR Questions Management** — add categorized HR questions with keywords for feedback scoring
- **Notice Board** — post/delete platform-wide announcements
- **Project Management** — track all student projects with mentor assignment
- **Analytics** — real data charts (student domain interests, top mentors, company hires)
- **Mentor Reviews** — add/manage mentor ratings and feedback
- **Contact Messages** — view and manage messages from contact form

---

## 🛠️ Tech Stack

### Frontend
- **React.js** — component-based UI
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — smooth animations
- **Axios** — HTTP requests
- **React Router DOM** — client-side routing
- **Recharts / Chart.js** — data visualization
- **Lucide React** — icons

### Backend
- **Node.js** — runtime environment
- **Express.js** — REST API framework
- **bcryptjs** — password hashing
- **dotenv** — environment variable management
- **CORS** — cross-origin resource sharing

### Database
- **PostgreSQL** — relational database
- **pg (node-postgres)** — database client

---

## 📁 Project Structure

```
learnify-website/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── routes/
│   │   ├── auth.js              # Login
│   │   ├── userProfile.js       # Profile CRUD
│   │   ├── stats.js             # Student stats & profile completion
│   │   ├── notices.js           # Notice board
│   │   ├── assignments.js       # Assignments CRUD
│   │   ├── students.js          # Student management
│   │   ├── companies.js         # Company management
│   │   ├── projects.js          # Admin projects
│   │   ├── mentorReviews.js     # Mentor reviews
│   │   ├── analytics.js         # Analytics & dashboard
│   │   ├── quiz.js              # Quiz/Assessment system
│   │   ├── hrQuestions.js       # HR practice questions
│   │   ├── studentProjects.js   # Student project submissions
│   │   ├── skillBadges.js       # Skill badges
│   │   ├── messages.js          # User messages
│   │   └── contact.js           # Contact form
│   ├── .env                     # Environment variables (not in repo)
│   └── server.js                # Express server entry point
│
└── src/
    ├── pages/
    │   ├── Landing.jsx           # Home page
    │   ├── Login.jsx             # Login page
    │   ├── Register.jsx          # Registration page
    │   ├── Student_Dashboard.jsx # Student dashboard
    │   ├── AdminPanel.jsx        # Admin panel
    │   └── ContactPage.jsx       # Contact page
    ├── components/
    │   ├── AdminPanelDashboard/  # All admin components
    │   └── Student_Dashboard/    # All student components
    └── App.jsx                   # Routes configuration
```

---

## 🗄️ Database Schema

| Table | Description |
|-------|-------------|
| `user_details` | All users (students + admin) with roles |
| `assignments` | Tasks assigned by admin to students |
| `notices` | Platform announcements |
| `quizzes` | Assessment quizzes |
| `quiz_questions` | MCQ questions per quiz |
| `quiz_results` | Student quiz scores |
| `hr_questions` | HR practice questions with keywords |
| `hr_practice_answers` | Student answers with AI-style feedback |
| `companies` | Hiring companies |
| `projects` | Admin-managed projects |
| `student_projects` | Student-submitted projects |
| `skill_badges` | Student skill achievements |
| `mentor_reviews` | Mentor ratings and feedback |
| `student_stats` | Attendance and progress stats |
| `messages` | User-to-user messages |
| `contact_messages` | Contact form submissions |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/Nandanisisodia/learnify-website.git
cd learnify-website
```

### 2. Frontend setup
```bash
npm install
```

### 3. Backend setup
```bash
cd backend
npm install
```

### 4. Database setup
Create a PostgreSQL database:
```sql
CREATE DATABASE learnify;
```

### 5. Environment variables
Create `backend/.env` file with your PostgreSQL credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=learnify
DB_USER=your_db_user
DB_PASSWORD=your_db_password
PORT=5000
```
> ⚠️ Never share your actual `.env` file — it's already in `.gitignore`

### 6. Create admin account
Run the server once and hit the create-admin endpoint, or directly insert:
```sql
-- Use bcrypt hash for password
INSERT INTO user_details (full_name, email, password, contact_number, role, why_hire_me, ai_skill_summary, domains_of_interest)
VALUES ('Admin User', 'admin@learnify.com', '<bcrypt_hash>', '9999999999', 'administrator', 'Admin', 'N/A', '{Administration}');
```

### 7. Run the application
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd ..
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Key Technical Decisions

| Decision | Reason |
|----------|--------|
| PostgreSQL over MongoDB | Relational data (students → assignments → results), native array support for `domains_of_interest` |
| bcrypt hashing | Plain text passwords never stored in database |
| Role-based routing | Students → `/dashboard`, Admins → `/adminPanel` |
| Rule-based HR feedback | Cost-free alternative to AI API; scores based on answer length, keyword matching, STAR method detection |
| localStorage for session | Simple, sufficient for demo; JWT would be used in production |
| Parameterized SQL queries | Prevents SQL injection attacks |

---

## 🤝 Contributing

This is a portfolio project. Feel free to fork and build upon it!

---

## 📧 Contact

**Nandani Sisodia**  
📧 nandanisisodia525@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/nandani-sisodia-928077338)  
💻 [GitHub](https://github.com/Nandanisisodia)

---

## 📄 License

MIT License — feel free to use this project for learning purposes.

---

*Built with ❤️ as a full-stack portfolio project*
