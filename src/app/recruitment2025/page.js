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
  const validateUrl = (v) =>
    !v || /^(https?:\/\/)[^\s$.?#].[^\s]*$/i.test(String(v).trim())

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

    if (!validateUrl(form.resumeUrl))
      e.resumeUrl = "Enter a valid URL (starting with http/https)"

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
      const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbyMvx6BiFaiAXbx8kT3wByykPRH90_e9T9kJaQbW5PxJie7OdJtfSUrAscJoA4DIZeQUQ/exec"

      const submitForm = () => {
        return new Promise((resolve) => {
          const iframe = document.createElement("iframe")
          iframe.style.display = "none"
          iframe.name = "script-frame"

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

          const formElement = document.createElement("form")
          formElement.action = SCRIPT_URL
          formElement.method = "POST"
          formElement.target = "script-frame"
          formElement.style.display = "none"

          Object.entries(form).forEach(([key, value]) => {
            const input = document.createElement("input")
            input.type = "hidden"
            input.name = key
            input.value = value || ""
            formElement.appendChild(input)
          })

          const timestampInput = document.createElement("input")
          timestampInput.type = "hidden"
          timestampInput.name = "timestamp"
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

  const headingStyle = {
    color: "#C76BFF",
    textShadow: headingTextShadow,
    lineHeight: 1,
  }

  const labelStyle = {
    fontSize: "clamp(12px, 1.6vw, 16px)",
    textShadow: "0 0 5px #8B9DF8",
  }

  const inputBaseClasses =
    "w-full rounded-2xl border-2 border-purple-400/70 bg-[#230035f2] px-3 text-sm md:text-base text-[#916BB1] placeholder:text-purple-300/60 focus:outline-none"

  const inputHeightClass = "h-10 md:h-12"
  const errorTextClass = "text-xs text-rose-300 mt-0.5"

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center px-4 py-6"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Inline component CSS so not to edit globals.css */}
      <style>{`
        /* custom scrollbar for the card (WebKit) */
        .custom-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(199,107,255,0.85) 0%, rgba(101,50,160,0.85) 100%);
          border-radius: 9999px;
          border: 2px solid rgba(0,0,0,0);
          box-shadow: 0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover { filter: brightness(0.95); }
        .custom-scroll::-webkit-scrollbar-thumb:active { filter: brightness(0.9); }

        /* Firefox scrollbar */
        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(199,107,255,0.85) transparent;
        }

        /* make sure the select's displayed text uses the same color as inputs */
        .match-input-color {
          color: #916BB1; /* matches input text color */
        }
        /* on some browsers the focused option uses default selection color; keep select appearance none */
        .no-native-arrow {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        /* ensure the select's caret/icon area doesn't show white text */
        .select-inner svg { display: block; }
      `}</style>

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative mx-auto w-full flex items-center justify-center">
        <div
          className="
            w-full 
            max-w-[740px]       
            lg:max-w-[560px]    
            xl:max-w-[600px]    
            rounded-3xl border border-white/25 
            bg-purple-900/40 backdrop-blur-md 
            shadow-2xl overflow-y-auto custom-scroll
          "
          style={{
            boxShadow: cardInsetShadows,
            maxHeight: "calc(100vh - 64px)",
          }}
        >
          <div className="p-4 sm:p-5 md:p-6">
            <div className="text-center mb-3">
              <h1
                className="mx-auto text-2xl sm:text-3xl md:text-4xl font-semibold"
                style={headingStyle}
              >
                Registration Form
              </h1>
              <hr className="mx-auto w-11/12 border-t border-white/20 my-2" />
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center"
              aria-describedby="form-status"
            >
              {/* Roll Number */}
              <div className="w-full flex justify-center">
                <div className="w-full max-w-[640px] md:max-w-[480px]">
                  <label className="text-indigo-300 font-medium block mb-1" style={labelStyle}>
                    Roll Number
                  </label>
                  <input
                    id="rollNumber"
                    name="rollNumber"
                    type="text"
                    value={form.rollNumber}
                    onChange={handleChange}
                    placeholder="Enter your roll number"
                    className={`${inputBaseClasses} ${inputHeightClass}`}
                    aria-invalid={!!errors.rollNumber}
                    aria-describedby={errors.rollNumber ? "err-rollNumber" : undefined}
                  />
                  {errors.rollNumber && <p id="err-rollNumber" className={errorTextClass}>{errors.rollNumber}</p>}
                </div>
              </div>

              {/* Name */}
              <div className="w-full flex justify-center mt-3">
                <div className="w-full max-w-[640px] md:max-w-[480px]">
                  <label className="text-indigo-300 font-medium block mb-1" style={labelStyle}>
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`${inputBaseClasses} ${inputHeightClass}`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "err-name" : undefined}
                  />
                  {errors.name && <p id="err-name" className={errorTextClass}>{errors.name}</p>}
                </div>
              </div>

              {/* Phone */}
              <div className="w-full flex justify-center mt-3">
                <div className="w-full max-w-[640px] md:max-w-[480px]">
                  <label className="text-indigo-300 font-medium block mb-1" style={labelStyle}>
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={`${inputBaseClasses} ${inputHeightClass}`}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                  />
                  {errors.phone && <p id="err-phone" className={errorTextClass}>{errors.phone}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="w-full flex justify-center mt-3">
                <div className="w-full max-w-[640px] md:max-w-[480px]">
                  <label className="text-indigo-300 font-medium block mb-1" style={labelStyle}>
                    Email ID
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your KIIT email ID"
                    className={`${inputBaseClasses} ${inputHeightClass}`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "err-email" : undefined}
                  />
                  {errors.email && <p id="err-email" className={errorTextClass}>{errors.email}</p>}
                </div>
              </div>

              {/* Year + Domain */}
              <div className="w-full flex flex-col md:flex-row gap-3 justify-center items-start mt-3">
                {/* Year */}
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="w-full max-w-[300px]">
                    <label className="text-indigo-300 font-medium block mb-1" style={labelStyle}>
                      Year
                    </label>
                    <div className="relative select-inner">
                      <select
                        id="year"
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        className="match-input-color no-native-arrow w-full rounded-2xl border-2 border-purple-400/70 bg-[#230035f2] px-3 pr-9 text-sm md:text-base focus:outline-none h-10 md:h-12"
                        aria-invalid={!!errors.year}
                        aria-describedby={errors.year ? "err-year" : undefined}
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

                    {errors.year && <p id="err-year" className={errorTextClass}>{errors.year}</p>}
                  </div>
                </div>

                {/* Domain */}
                <div className="w-full md:w-1/2 flex justify-center">
                  <div className="w-full max-w-[380px]">
                    <label className="text-indigo-300 font-medium block mb-1" style={labelStyle}>
                      Domain
                    </label>
                    <div className="relative select-inner">
                      <select
                        id="domain"
                        name="domain"
                        value={form.domain}
                        onChange={handleChange}
                        className="match-input-color no-native-arrow w-full rounded-2xl border-2 border-purple-400/70 bg-[#230035f2] px-3 pr-9 text-sm md:text-base focus:outline-none h-10 md:h-12"
                        aria-invalid={!!errors.domain}
                        aria-describedby={errors.domain ? "err-domain" : undefined}
                      >
                        <option value="" disabled>
                          Select domain
                        </option>
                        <option>Administration</option>
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

                    {errors.domain && <p id="err-domain" className={errorTextClass}>{errors.domain}</p>}
                  </div>
                </div>
              </div>

              {/* Resume URL */}
              <div className="w-full flex justify-center mt-3">
                <div className="w-full max-w-[640px] md:max-w-[480px]">
                  <label className="text-indigo-300 font-medium block mb-1" style={labelStyle}>
                    Resume URL
                  </label>
                  <input
                    id="resumeUrl"
                    name="resumeUrl"
                    type="url"
                    value={form.resumeUrl}
                    onChange={handleChange}
                    placeholder="Paste link to your GitHub profile / resume"
                    className={`${inputBaseClasses} ${inputHeightClass}`}
                    aria-invalid={!!errors.resumeUrl}
                    aria-describedby={errors.resumeUrl ? "err-resumeUrl" : undefined}
                  />
                  {errors.resumeUrl && <p id="err-resumeUrl" className={errorTextClass}>{errors.resumeUrl}</p>}
                </div>
              </div>

              {/* Submit */}
              <div className="w-full flex justify-center mt-4">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[220px] rounded-full text-white border-2 border-green-300 font-semibold px-4"
                  style={{
                    height: "clamp(44px, 4.6vh, 56px)",
                    background: "linear-gradient(90deg, #229200 0%, #19b226 100%)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                  }}
                >
                  {status === "loading" ? "Submitting…" : "Submit"}
                </button>
              </div>

              {/* Status */}
              <div
                id="form-status"
                tabIndex={-1}
                ref={statusRef}
                aria-live="polite"
                className="w-full text-center mt-3 mb-1"
              >
                {status === "success" && (
                  <p className="text-green-300 text-sm md:text-xs">
                    Successfully submitted — thank you!
                  </p>
                )}
                {status === "error" && (
                  <p className="text-rose-300 text-sm md:text-xs">
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