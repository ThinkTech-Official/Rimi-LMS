import React, { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import useNotification from "../hooks/useNotification";
import { useLogin } from "../hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaUserLock } from "react-icons/fa6";

interface LoginFormInput {
  email: string;
  password: string;
}

const LoginClient: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>();
  const { NotificationComponent, triggerNotification } = useNotification();
  const [isLanguageSelectOpen, setIsLanguageSelectOpen] = useState(false);
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  type Language = "en" | "fr";
  const previousSelectedLanguage = localStorage
    .getItem("i18nextLng")
    ?.split("-")[0];
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    previousSelectedLanguage as Language
  );

  const { login, loading, error } = useLogin();
  const { reload } = useAuth();


  useEffect(() => {
    // page title
    document.title = 'Agent Training portal - Rimi';
    
    // description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Secure login for rimi agents training portal. Access training and certification programs.'
      );
    }
  }, []);



  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    try {
      await login(data);
      // await refreshUser();
      await reload();
      navigate("/advisor");
    } catch(error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Login failed"
      triggerNotification({
        type: "error",
        message: errorMessage || t("Login failed"),
        duration: 3000,
      });
    }
  };
  const toggleLanguageSelect = () => {
    setIsLanguageSelectOpen(!isLanguageSelectOpen);
  };
  const handleLanguageSelect = (lang: Language) => {
    if (lang === selectedLanguage) {
      setIsLanguageSelectOpen(false);
      return;
    }

    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
    setIsLanguageSelectOpen(false);
  };
  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-[#E9EEF1] flex items-center justify-end px-6 sm:px-14 space-x-4 py-4 gap-3">
        <div className="flex gap-6 items-center">
          <div className="relative">
            <button
              role="language-btn"
              className="flex items-center gap-2 text-primary text-[16px] 2xl:text-xl font-medium relative cursor-pointer"
              onClick={toggleLanguageSelect}
            >
              <span className="flex gap-2 items-center">
                {" "}
                <img
                  src="/ion_language.svg"
                  alt=""
                  className="h-5 w-5 2xl:w-6 2xl:h-6"
                />{" "}
                {selectedLanguage}
              </span>
              <MdKeyboardArrowRight
                className={`h-4 w-4 2xl:w-6 2xl:h-6 transform transition ${
                  isLanguageSelectOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {isLanguageSelectOpen && (
              <div className="absolute mt-4 w-24 2xl:w-28 rounded-sm shadow-lg bg-white border border-[#E9EEF1] z-10">
                <ul className="py-1 text-sm 2xl:text-lg text-gray-700">
                  <li>
                    <button
                      onClick={() => handleLanguageSelect("en")}
                      className="block w-full text-left px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                    >
                      En
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleLanguageSelect("fr")}
                      className="block w-full text-left px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                    >
                      Fr
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <Link to="/adminlogin" className="flex items-center gap-2">
            <FaUserLock className="text-primary" />
            <p className="text-primary font-semibold">Admin SignIn</p>
          </Link>
        </div>
      </header>
      <div className="flex items-center justify-center bg-white px-4 h-[calc(100vh-64px)]">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          {/* Logo */}
          <div className="flex justify-center mb-5">
            <img
              src="/rimilogo.png"
              alt="RIMI Logo"
              className="h-12 w-32 sm:h-[75px] sm:w-40"
            />
          </div>
          <h3 className="text-center text-base font-semibold text-primary mb-4">
            {t("Sign in as Advisor")}
          </h3>
          {/* Heading */}
          <h2 className="text-center text-2xl font-bold text-neutral-800 mb-8 capitalize">
            {t("RIMI agent training and certification portal")}
          </h2>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Username/email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  setValueAs: (value) => value.trim().toLowerCase(),
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Email"
                className="w-full px-4 py-3 border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {t(String(errors.email.message))}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  {...register("password", {
                    setValueAs: (value) => value.trim(),
                    required: t("Password is required"),
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    validate: {
                      hasLetter: (value) =>
                        /[A-Za-z]/.test(value) ||
                        "Password must contain at least one letter",
                      hasNumber: (value) =>
                        /\d/.test(value) ||
                        "Password must contain at least one number",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500"
                >
                  {showPassword ? (
                    <EyeIcon
                      className="h-5 w-5 cursor-pointer"
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeSlashIcon
                      className="h-5 w-5 cursor-pointer"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">
                  {t(String(errors.password.message))}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold cursor-pointer transition-all delay-100 shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? `${t("Signing In")}...` : t("Sign In")}
            </button>
          </form>
          <p className="text-text-light-2 text-center mt-4">
                  New to our platform?{" "}
                  <a href="/signup" className="text-primary font-semibold hover:text-indigo-700 hover:underline transition-all delay-100">
                    Sign up
                  </a>
                </p>
        </div>
      </div>
      {NotificationComponent}
    </div>
  );
};

export default LoginClient;
