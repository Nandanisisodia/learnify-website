import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import LearnifyLogo from "../assets/Learnify_logo.png";


const LoginForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    role: "student",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      alert("Login successful 🎉");

      if (data.role === "student") {
        navigate("/dashboard");
      } else if (data.role === "administrator") {
        navigate("/adminPanel");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-6 bg-gray-50">
      <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg flex overflow-hidden">

        {/* LEFT IMAGE */}
        <div className="hidden md:block w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url(https://static.vecteezy.com/system/resources/previews/008/415/006/non_2x/employment-agency-for-recruitment-or-placement-job-service-with-skilled-and-experienced-career-laborers-in-flat-cartoon-illustration-vector.jpg)",
          }}
        />
        
        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-10">
        {/* LOGO */}
<div className="flex justify-center mb-6">
  <img
    src={LearnifyLogo}
    alt="Learnify"
    className="h-12 object-contain"
  />
</div>
          <h1 className="text-4xl font-extrabold text-center mb-2">
            <span className="text-[#00BDA6] capitalize">{formData.role}</span>{" "}
            <span className="text-[#FF6D34]">Login</span>
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Enter your details to login
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ROLE */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border"
            >
              <option value="student">Login as Student</option>
              <option value="administrator">Login as Administrator</option>
            </select>

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter registered email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border"
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#FF6D34] hover:bg-[#00BDA6] text-white py-3 rounded-lg font-semibold transition"
            >
              Login
            </button>

            {/* SIGN UP */}
            <p className="text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-[#00BDA6] font-semibold">
                Sign up
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;