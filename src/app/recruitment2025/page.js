"use client";

import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Confetti from "react-confetti";
import Link from "next/link";

const RegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    RollNo: "",
    Phone: "",
    Year: "",
    Domain: "",
    Email: "",
    GitHubLink: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbyUxfAXBBs_laW5goqx6qRjyfpbnNov27rAKDFpdm9O1UtiIHVPtZ0zSAZCZLv0TfZRTQ/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      toast.success("Registration submitted successfully!");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
      setFormData({
        Name: "",
        RollNo: "",
        Phone: "",
        Year: "",
        Domain: "",
        Email: "",
        GitHubLink: "",
      });
    } catch (error) {
      toast.error("Error submitting form.");
      console.error("Submission error:", error);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('/RecruitmentBg.png')] bg-cover bg-[position:center_1px] bg-no-repeat px-2 sm:px-6">
      {showConfetti && (
        <Confetti
          width={typeof window !== "undefined" ? window.innerWidth : 300}
          height={typeof window !== "undefined" ? window.innerHeight : 300}
          recycle={false}
          numberOfPieces={400}
        />
      )}
      {/* Use Next.js Link for client-side navigation */}
      <Link href="/" passHref legacyBehavior>
        <a>
          <img
            src="/CodingNinjas.png"
            alt="Logo"
            className="absolute top-4 left-4 h-auto z-20 w-[160px] sm:w-[190px] drop-shadow-xl cursor-pointer"
          />
        </a>
      </Link>
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-white/10 to-orange-100/10 z-0" />
      <div className="relative z-10 flex flex-col items-center w-full md:max-w-xl max-w-xl px-2 sm:px-8 pt-16 pb-8">
        {/* Banner at the top */}
        <img
          src="/Recruitment.png"
          alt="Registration Banner"
          className="w-[170px] sm:w-[210px] h-auto object-contain drop-shadow-2xl mb-[-36px]"
        />
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl pt-5 pb-8 px-4 sm:px-8 w-full border border-orange-200 md:max-w-lg mx-auto">
          <Toaster />
          <div className="text-center mb-7">
            <h2 className="text-orange-600 font-extrabold text-[20px] tracking-wider uppercase bungee-font drop-shadow-sm">
              Registration Form (पंजीकरण फॉर्म)
            </h2>
            {/* <p className="text-xs text-gray-600 mt-1">All fields are mandatory (सभी फ़ील्ड अनिवार्य हैं)</p> */}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto  sm:max-h-full">
            {/* Roll Number */}
            <div>
              <label className="text-[15px] block font-bold text-gray-800 mb-1">
                Roll Number (रोल नंबर)
              </label>
              <input
                type="text"
                name="RollNo"
                value={formData.RollNo}
                onChange={handleChange}
                className="w-full text-black border border-orange-300 focus:border-[#ee6220] outline-none px-3 py-2 rounded-lg bg-white/90 shadow-sm focus:bg-orange-50 transition"
                required
                placeholder="Enter your roll number (अपना रोल नंबर लिखें)"
              />
            </div>
            {/* Name */}
            <div>
              <label className="text-[15px] block font-bold text-gray-800 mb-1">
                Name (नाम)
              </label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="w-full text-black border border-orange-300 focus:border-[#ee6220] outline-none px-3 py-2 rounded-lg bg-white/90 shadow-sm focus:bg-orange-50 transition"
                required
                placeholder="Enter your name (अपना नाम लिखें)"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-[15px] block font-bold text-gray-800 mb-1">
                Phone Number (फ़ोन नंबर)
              </label>
              <input
                type="text"
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
                className="w-full text-black border border-orange-300 focus:border-[#ee6220] outline-none px-3 py-2 rounded-lg bg-white/90 shadow-sm focus:bg-orange-50 transition"
                required
                placeholder="Enter your phone number (अपना फ़ोन नंबर लिखें)"
              />
            </div>
            {/* Email */}
            <div>
              <label className="text-[15px] block font-bold text-gray-800 mb-1">
                Email (ईमेल)
              </label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
                className="w-full text-black border border-orange-300 focus:border-[#ee6220] outline-none px-3 py-2 rounded-lg bg-white/90 shadow-sm focus:bg-orange-50 transition"
                required
                placeholder="Enter your email (अपना ईमेल लिखें)"
              />
            </div>
            {/* Year and Domain in a row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Year dropdown */}
              <div className="flex-1">
                <label className="text-[15px] block font-bold text-gray-800 mb-1">
                  Year (वर्ष)
                </label>
                <select
                  name="Year"
                  value={formData.Year}
                  onChange={handleChange}
                  className="w-full text-black border border-orange-300 focus:border-[#ee6220] outline-none px-3 py-2 rounded-lg bg-white/90 shadow-sm focus:bg-orange-50 transition"
                  required
                >
                  <option value="" disabled>
                    Select your year (अपना वर्ष चुनें)
                  </option>
                  <option value="1st">1st (पहला)</option>
                  <option value="2nd">2nd (दूसरा)</option>
                  <option value="3rd">3rd (तीसरा)</option>
                </select>
              </div>
              {/* Domain dropdown */}
              <div className="flex-1">
                <label className="text-[15px] block font-bold text-gray-800 mb-1">
                  Domain (डोमेन)
                </label>
                <select
                  name="Domain"
                  value={formData.Domain}
                  onChange={handleChange}
                  className="w-full text-black border border-orange-300 focus:border-[#ee6220] outline-none px-3 py-2 rounded-lg bg-white/90 shadow-sm focus:bg-orange-50 transition"
                  required
                >
                  <option value="" disabled>
                    Select your domain (अपना डोमेन चुनें)
                  </option>
                  <option value="Admin">Admin (प्रशासन)</option>
                  <option value="Design & Branding">Design & Branding (डिज़ाइन और ब्रांडिंग)</option>
                  <option value="Public Relations">Public Relations (जनसंपर्क)</option>
                  <option value="Web Development">Web Development (वेब विकास)</option>
                  <option value="Cyber Security">Cyber Security (साइबर सुरक्षा)</option>
                  <option value="App Development">App Development (ऐप विकास)</option>
                  <option value="Social">Social (सामाजिक)</option>
                  <option value="Competitive Programming">Competitive Programming (प्रतियोगी प्रोग्रामिंग)</option>
                  <option value="Marketing">Marketing (विपणन)</option>
                  <option value="Machine Learning">Machine Learning (मशीन लर्निंग)</option>
                </select>
              </div>
            </div>

            {/* GitHub URL / Resume URL */}
            <div>
              <label className="text-[15px] block font-bold text-gray-800 mb-1">
                RESUME URL (आपका रेस्यूम यूआरएल)
              </label>
              <input
                type="url"
                name="GitHubLink"
                value={formData.GitHubLink}
                onChange={handleChange}
                className="w-full text-black border border-orange-300 focus:border-[#ee6220] outline-none px-3 py-2 rounded-lg bg-white/90 shadow-sm focus:bg-orange-50 transition"
                placeholder="Paste your GitHub profile link (अपना गिटहब लिंक पेस्ट करें)"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 mt-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-orange-700 text-white font-bold text-base tracking-wide shadow-lg hover:from-orange-600 hover:to-orange-800 transition-all duration-200 focus:ring-2 focus:ring-orange-400 focus:outline-none cursor-pointer"
            >
              {isSubmitting ? "Submitting... (सबमिट हो रहा है...)" : "Submit (सबमिट करें)"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
