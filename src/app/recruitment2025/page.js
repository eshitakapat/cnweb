"use client"
import React, { useState, useRef } from "react"

export default function RegisterOverlay({ onSubmit }) {
  const [form, setForm] = useState({
    rollNumber: "",
    name: "",
    phone: "",
    email: "",
    year: "",
    domain: "",
    resumeUrl: "",
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) 
  const statusRef = useRef(null)

  const validateEmail = (v) => /^\S+@\S+\.\S+$/.test(String(v).trim())
  const validatePhone = (v) => /^[0-9()+\-\s]{7,20}$/.test(String(v).trim())

  function validateAll() {
    const e = {}
    if (!form.rollNumber.trim()) e.rollNumber = "Roll number is required"
    if (!form.name.trim()) e.name = "Name is required"
    if (!form.email.trim()) e.email = "Email is required"
    else if (!validateEmail(form.email)) e.email = "Email is invalid"
    if (!form.phone.trim()) e.phone = "Phone is required"
    else if (!validatePhone(form.phone)) e.phone = "Phone is invalid"
    if (!form.year) e.year = "Year is required"
    if (!form.domain) e.domain = "Domain is required"
    return e
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
    setErrors((p) => ({ ...p, [name]: undefined }))
    if (status === "error") setStatus(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const eobj = validateAll()
    setErrors(eobj)
    if (Object.keys(eobj).length > 0) {
      setStatus("error")
      statusRef.current?.focus?.()
      return
    }

    setStatus("loading")
    try {
      // Google Apps Script Web App URL for info extraction
      const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMvx6BiFaiAXbx8kT3wByykPRH90_e9T9kJaQbW5PxJie7OdJtfSUrAscJoA4DIZeQUQ/exec"
      
      const params = new URLSearchParams({
        rollNumber: form.rollNumber,
        name: form.name,
        phone: form.phone,
        email: form.email,
        year: form.year,
        domain: form.domain,
        resumeUrl: form.resumeUrl || "",
        timestamp: new Date().toISOString()
      })

      const submitForm = () => {
        return new Promise((resolve) => {
          const iframe = document.createElement('iframe')
          iframe.style.display = 'none'
          iframe.name = 'script-frame'
          
          iframe.onload = () => {
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe)
              }
              resolve(true)
            }, 1500)
          }
          
          iframe.onerror = () => {
            setTimeout(() => {
              if (document.body.contains(iframe)) {
                document.body.removeChild(iframe)
              }
              resolve(false)
            }, 1500)
          }
          
          document.body.appendChild(iframe)
          
          const formElement = document.createElement('form')
          formElement.action = SCRIPT_URL
          formElement.method = 'POST'
          formElement.target = 'script-frame'
          formElement.style.display = 'none'
          
          
          Object.entries(form).forEach(([key, value]) => {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = key
            input.value = value || ""
            formElement.appendChild(input)
          })
          
          const timestampInput = document.createElement('input')
          timestampInput.type = 'hidden'
          timestampInput.name = 'timestamp'
          timestampInput.value = new Date().toISOString()
          formElement.appendChild(timestampInput)
          
          document.body.appendChild(formElement)
          formElement.submit()
          
          setTimeout(() => {
            if (document.body.contains(formElement)) {
              document.body.removeChild(formElement)
            }
          }, 100)
        })
      }

      const success = await submitForm()
      
      if (success) {
        setStatus("success")
        setForm({
          rollNumber: "",
          name: "",
          phone: "",
          email: "",
          year: "",
          domain: "",
          resumeUrl: "",
        })
      } else {
        setStatus("error")
      }
      
    } catch (err) {
      console.error(err)
      setStatus("error")
    } finally {
      statusRef.current?.focus?.()
    }
  }

  const cardInsetShadows =
    "inset -49.2px 49.2px 49.2px 0 rgba(255,255,255,0.10), inset 49.2px -49.2px 49.2px 3px rgba(165,165,165,0.10)"

  const headingTextShadow = "0 0 3.39px #C76BFF, 0 0 100px #C76BFF"
  const bgImage = "/tm.jpg"

  const containerStyle = {
    maxWidth: "min(540px, 65vw, 95%)",
    width: "100%",
  }

  const headingStyle = {
    color: "#C76BFF",
    textShadow: headingTextShadow,
    lineHeight: 1,
  }

  const labelStyle = {
    fontSize: "clamp(12px, 1.6vw, 16px)",
    textShadow: "0 0 5px #8B9DF8",
  }

  const inputHeight = {
    height: "clamp(40px, 3.6vh, 46px)",
  }

  const inputBaseClasses =
    "w-full rounded-2xl border-2 border-purple-400/70 bg-[#230035f2] px-3 text-sm text-[#916BB1] placeholder:text-purple-300/60 focus:outline-none"

  const errorTextClass = "text-xs text-rose-300 mt-0.5"

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center px-3 py-4"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/45" />

      <div
        className="relative mx-auto w-full flex items-center justify-center"
        style={containerStyle}
      >
        {/* Card */}
        <div
          className="w-full rounded-3xl border border-white/25 bg-purple-900/40 backdrop-blur-md shadow-2xl overflow-y-auto custom-scroll"
          style={{
            boxShadow: cardInsetShadows,
            maxHeight: "calc(100vh - 80px)", 
          }}
        >
          <div className="p-5 md:p-6">
            {/* Heading + underline */}
            <div className="text-center mb-3">
              <h1 className="text-4xl mx-auto" style={headingStyle}>
                Registration Form
              </h1>
              <hr className="mx-auto w-11/12 border-t border-white/20 my-2" />
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center"
              aria-describedby="form-status"
            >
              {/* Roll Number */}
              <div className="w-full flex justify-center">
                <div
                  className="w-full"
                  style={{ maxWidth: "min(420px, 86%)" }}
                >
                  <label
                    htmlFor="rollNumber"
                    className="text-indigo-300 font-medium block mb-1"
                    style={labelStyle}
                  >
                    Roll Number
                  </label>
                  <input
                    id="rollNumber"
                    name="rollNumber"
                    value={form.rollNumber}
                    onChange={handleChange}
                    aria-invalid={!!errors.rollNumber}
                    aria-describedby={
                      errors.rollNumber ? "err-rollNumber" : undefined
                    }
                    placeholder="Enter your roll number"
                    className={inputBaseClasses}
                    style={inputHeight}
                  />
                  {errors.rollNumber && (
                    <p id="err-rollNumber" className={errorTextClass}>
                      {errors.rollNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Name */}
              <div className="w-full flex justify-center mt-2">
                <div
                  className="w-full"
                  style={{ maxWidth: "min(420px, 86%)" }}
                >
                  <label
                    htmlFor="name"
                    className="text-indigo-300 font-medium block mb-1"
                    style={labelStyle}
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                    placeholder="Enter your name"
                    className={inputBaseClasses}
                    style={inputHeight}
                  />
                  {errors.name && (
                    <p id="err-name" className={errorTextClass}>
                      {errors.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="w-full flex justify-center mt-2">
                <div
                  className="w-full"
                  style={{ maxWidth: "min(420px, 86%)" }}
                >
                  <label
                    htmlFor="phone"
                    className="text-indigo-300 font-medium block mb-1"
                    style={labelStyle}
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                    placeholder="Enter your phone number"
                    className={inputBaseClasses}
                    style={inputHeight}
                  />
                  {errors.phone && (
                    <p id="err-phone" className={errorTextClass}>
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="w-full flex justify-center mt-2">
                <div
                  className="w-full"
                  style={{ maxWidth: "min(420px, 86%)" }}
                >
                  <label
                    htmlFor="email"
                    className="text-indigo-300 font-medium block mb-1"
                    style={labelStyle}
                  >
                    Email ID
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "err-email" : undefined}
                    placeholder="Enter your KIIT email ID"
                    className={inputBaseClasses}
                    style={inputHeight}
                  />
                  {errors.email && (
                    <p id="err-email" className={errorTextClass}>
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Year & Domain */}
              <div className="w-full flex flex-row flex-wrap gap-3 justify-center items-start mt-2">
                <div
                  className="w-1/2 min-w-[130px]"
                  style={{ maxWidth: "min(200px, 40vw)" }}
                >
                  <label
                    htmlFor="year"
                    className="text-indigo-300 font-medium block mb-1"
                    style={labelStyle}
                  >
                    Year
                  </label>
                  <div className="relative">
                    <select
                      required
                      id="year"
                      name="year"
                      value={form.year}
                      onChange={handleChange}
                      aria-invalid={!!errors.year}
                      aria-describedby={errors.year ? "err-year" : undefined}
                      className="w-full rounded-2xl border-2 border-purple-400/70 bg-[#230035f2] px-3 pr-9 text-sm text-white focus:outline-none appearance-none"
                      style={inputHeight}
                    >
                      <option value="" disabled>
                        Select year
                      </option>
                      <option value="1st">1st</option>
                      <option value="2nd">2nd</option>
                     </select>

                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="#C56BFF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.year && (
                    <p id="err-year" className={errorTextClass}>
                      {errors.year}
                    </p>
                  )}
                </div>

                <div
                  className="w-1/2 min-w-[160px]"
                  style={{ maxWidth: "min(260px, 45vw)" }}
                >
                  <label
                    htmlFor="domain"
                    className="text-indigo-300 font-medium block mb-1"
                    style={labelStyle}
                  >
                    Domain
                  </label>
                  <div className="relative">
                    <select
                      required
                      id="domain"
                      name="domain"
                      value={form.domain}
                      onChange={handleChange}
                      aria-invalid={!!errors.domain}
                      aria-describedby={
                        errors.domain ? "err-domain" : undefined
                      }
                      className="w-full rounded-2xl border-2 border-purple-400/70 bg-[#230035f2] px-3 pr-9 text-sm text-white focus:outline-none appearance-none"
                      style={inputHeight}
                    >
                      <option value="" disabled>
                        Select domain
                      </option>
                      <option>Admin</option>
                      <option>Design & Branding</option>
                      <option>Public Relations</option>
                      <option>Web Development</option>
                      <option>Cyber Security</option>
                      <option>App Development</option>
                      <option>Social</option>
                      <option>Competitive Programming</option>
                      <option>Marketing</option>
                      <option>Machine Learning</option>
                    </select>

                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          stroke="#C56BFF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.domain && (
                    <p id="err-domain" className={errorTextClass}>
                      {errors.domain}
                    </p>
                  )}
                </div>
              </div>

              {/* Resume URL */}
              <div className="w-full flex justify-center mt-2">
                <div
                  className="w-full"
                  style={{ maxWidth: "min(420px, 86%)" }}
                >
                  <label
                    htmlFor="resumeUrl"
                    className="text-indigo-300 font-medium block mb-1"
                    style={labelStyle}
                  >
                    Resume URL
                  </label>
                  <input
                    id="resumeUrl"
                    name="resumeUrl"
                    type="url"
                    value={form.resumeUrl}
                    onChange={handleChange}
                    placeholder="Paste link to your GitHub profile / resume"
                    className={inputBaseClasses}
                    style={inputHeight}
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="w-full flex justify-center mt-[10px]">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full max-w-[220px] rounded-full text-white border-2 border-green-300 font-semibold px-4"
                  style={{
                    height: "clamp(42px, 4.2vh, 54px)",
                    background:
                      "linear-gradient(90deg, #229200 0%, #19b226 100%)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                  }}
                >
                  {status === "loading" ? "Submitting…" : "Submit"}
                </button>
              </div>

              {/* aria-live status */}
              <div
                id="form-status"
                tabIndex={-1}
                ref={statusRef}
                aria-live="polite"
                className="w-full text-center mt-1 mb-1"
              >
                {status === "success" && (
                  <p className="text-green-300 text-xs">
                    Successfully submitted — thank you!
                  </p>
                )}
                {status === "error" && (
                  <p className="text-rose-300 text-xs">
                    Please fix the errors above and try again.
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}