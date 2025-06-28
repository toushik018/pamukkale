"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import SuccessModal from "@/components/Modals/SuccessModal";
import Script from "next/script";

declare global {
  interface Window {
    grecaptcha: any;
    onRecaptchaLoad: () => void;
  }
}

type FormValues = {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  activity: string;
  message: string;
};

const Section6 = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Formspark form URL - replace the form ID
  const FORM_ID = "6sdxAsHxn";
  const FORMSPARK_ACTION_URL = `https://submit-form.com/${FORM_ID}`;
  const RECAPTCHA_SITE_KEY = "6LckPfYqAAAAABVe7mZi8vXNSpzIJUcGOtaPEytl";

  useEffect(() => {
    window.onRecaptchaLoad = () => {
      window.grecaptcha.render("recaptcha-container", {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token: string) => {
          setCaptchaToken(token);
        },
        "expired-callback": () => {
          setCaptchaToken(null);
        },
      });
    };
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Erforderlich"),
    lastName: Yup.string().required("Erforderlich"),
    email: Yup.string().email("Ungültige E-Mail").required("Erforderlich"),
    phoneNumber: Yup.string().required("Erforderlich"),
    activity: Yup.string().required("Bitte wählen Sie eine Option"),
    message: Yup.string().required("Erforderlich"),
  });

  const contactForm = useFormik<FormValues>({
    initialValues: {
      name: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      activity: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!captchaToken) {
        alert("Bitte bestätigen Sie, dass Sie kein Roboter sind");
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch(FORMSPARK_ACTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...values,
            "g-recaptcha-response": captchaToken,
          }),
        });

        if (response.ok) {
          contactForm.resetForm();
          setShowSuccessModal(true);
          window.grecaptcha.reset();
          setCaptchaToken(null);
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const inputStyle = (fieldName: keyof FormValues) => `
    w-full px-6 py-4 bg-transparent rounded-xl
    ${
      contactForm.touched[fieldName] && contactForm.errors[fieldName]
        ? "border-red-300"
        : "border-black/10"
    }
    border
    focus:outline-none focus:border-black/30 focus:ring-0
    placeholder:text-black/30 text-black/80
    transition-all duration-200
  `;

  const labelStyle =
    "text-sm font-light tracking-wide text-black/50 mb-2 block";

  return (
    <section id="reservation-section" className="py-32 bg-[#FAFAFA]">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-6">
            Planen Sie Ihre <span className="font-normal">Veranstaltung</span>
          </h2>
          <div className="h-[1px] w-24 bg-black/20 mx-auto mb-6" />
          <p className="text-black/60 text-lg max-w-2xl mx-auto font-light">
            Teilen Sie uns Ihre Wünsche mit, und wir melden uns innerhalb von 24
            Stunden bei Ihnen
          </p>
        </div>

        {/* Form */}
        <form
          action={FORMSPARK_ACTION_URL}
          method="POST"
          onSubmit={contactForm.handleSubmit}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Name Fields */}
            <div>
              <label className={labelStyle} htmlFor="name">
                Vorname
              </label>
              <input
                type="text"
                id="name"
                {...contactForm.getFieldProps("name")}
                className={inputStyle("name")}
                placeholder="John"
                required
              />
              {contactForm.touched.name && contactForm.errors.name && (
                <p className="mt-2 text-sm text-red-400 ml-1 font-light">
                  {contactForm.errors.name}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyle} htmlFor="lastName">
                Nachname
              </label>
              <input
                type="text"
                id="lastName"
                {...contactForm.getFieldProps("lastName")}
                className={inputStyle("lastName")}
                placeholder="Doe"
                required
              />
              {contactForm.touched.lastName && contactForm.errors.lastName && (
                <p className="mt-2 text-sm text-red-400 ml-1 font-light">
                  {contactForm.errors.lastName}
                </p>
              )}
            </div>

            {/* Contact Fields */}
            <div>
              <label className={labelStyle} htmlFor="email">
                E-Mail
              </label>
              <input
                type="email"
                id="email"
                {...contactForm.getFieldProps("email")}
                className={inputStyle("email")}
                placeholder="john@example.com"
                required
              />
              {contactForm.touched.email && contactForm.errors.email && (
                <p className="mt-2 text-sm text-red-400 ml-1 font-light">
                  {contactForm.errors.email}
                </p>
              )}
            </div>

            <div>
              <label className={labelStyle} htmlFor="phoneNumber">
                Telefon
              </label>
              <input
                type="tel"
                id="phoneNumber"
                {...contactForm.getFieldProps("phoneNumber")}
                className={inputStyle("phoneNumber")}
                placeholder="+49 123 456 789"
                required
              />
              {contactForm.touched.phoneNumber &&
                contactForm.errors.phoneNumber && (
                  <p className="mt-2 text-sm text-red-400 ml-1 font-light">
                    {contactForm.errors.phoneNumber}
                  </p>
                )}
            </div>

            {/* Full Width Fields */}
            <div className="md:col-span-2">
              <label className={labelStyle} htmlFor="activity">
                Art der Veranstaltung
              </label>
              <select
                id="activity"
                {...contactForm.getFieldProps("activity")}
                className={`${inputStyle(
                  "activity"
                )} appearance-none bg-[url('/chevron-down.svg')] bg-no-repeat bg-[center_right_1.25rem]`}
                required
              >
                <option value="">Bitte wählen Sie</option>
                <option value="hochzeit">Hochzeit</option>
                <option value="firmenfeier">Firmenfeier</option>
                <option value="geburtstag">Geburtstag</option>
                <option value="konferenz">Konferenz</option>
                <option value="andere">Andere</option>
              </select>
              {contactForm.touched.activity && contactForm.errors.activity && (
                <p className="mt-2 text-sm text-red-400 ml-1 font-light">
                  {contactForm.errors.activity}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className={labelStyle} htmlFor="message">
                Ihre Nachricht
              </label>
              <textarea
                id="message"
                rows={5}
                {...contactForm.getFieldProps("message")}
                className={`${inputStyle("message")} resize-none`}
                placeholder="Beschreiben Sie Ihre Veranstaltung..."
                required
              />
              {contactForm.touched.message && contactForm.errors.message && (
                <p className="mt-2 text-sm text-red-400 ml-1 font-light">
                  {contactForm.errors.message}
                </p>
              )}
            </div>
          </div>

          {/* reCAPTCHA and Submit Button */}
          <div className="mt-12 space-y-8">
            <div id="recaptcha-container" className="flex justify-center"></div>

            <button
              type="submit"
              disabled={
                !contactForm.isValid ||
                !contactForm.dirty ||
                isSubmitting ||
                !captchaToken
              }
              className="w-full bg-black text-white font-light tracking-wide px-8 py-4 rounded-xl
                       transition-all duration-200 
                       enabled:hover:bg-black/90 enabled:hover:-translate-y-0.5
                       disabled:opacity-30 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Wird gesendet...</span>
                </>
              ) : (
                "Nachricht senden"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* reCAPTCHA Script */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`}
        strategy="lazyOnload"
      />
    </section>
  );
};

export default Section6;
