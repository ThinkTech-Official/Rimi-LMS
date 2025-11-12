import { useState, useEffect, useRef } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaUserLock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSignup } from "../../hooks/useSignup";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useNotification from "../../hooks/useNotification";

interface SignupFormInput {
  name: string;
  email: string;
  agentCode: string;
  password: string;
  confirmPassword: string;
}

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLanguageSelectOpen, setIsLanguageSelectOpen] = useState(false);
  const previousSelectedLanguage = localStorage
    .getItem("i18nextLng")
    ?.split("-")[0];
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    previousSelectedLanguage as Language
  );
  const { NotificationComponent, triggerNotification } = useNotification();
  const navigate = useNavigate();
  const { signup, loading } = useSignup();
  const { reload } = useAuth();
  const { i18n, t } = useTranslation();
  type Language = "en" | "fr";
  const {
    register,
    handleSubmit,
    watch,

    formState: { errors },
  } = useForm<SignupFormInput>();
  useEffect(() => {
    document.title = "Sign Up - Agent Training Portal - RIMI";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Create your RIMI agent account to access training and certification programs."
      );
    }
  }, []);

  const password = watch("password");

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

  // const onSubmit: SubmitHandler<SignupFormInput> = async (data) => {
  //   try {
  //     await signup(data);
  //     // await refreshUser();
  //     await reload();
  //     navigate("/");
  //   } catch (error: any) {
  //     const errorMessage =
  //       error?.response?.data?.message || error?.message || "Login failed";
  //     triggerNotification({
  //       type: "error",
  //       message: errorMessage || t("Login failed"),
  //       duration: 3000,
  //     });
  //   }
  // };

  const onSubmit: SubmitHandler<SignupFormInput> = async (data) => {
    try {
      const response = await signup(data);

      triggerNotification({
        type: "success",
        message: t(
          "Account created successfully!"
        ),
        duration: 3000,
      });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Signup failed";
      triggerNotification({
        type: "error",
        message: errorMessage || t("Signup failed"),
        duration: 4000,
      });
    }
  };
  const languageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(e.target as Node)
      ) {
        setIsLanguageSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex items-center justify-end px-6 sm:px-14 space-x-4 py-4 gap-3 z-50">
        <div className="flex gap-6 items-center">
          <div className="relative">
            <button
              className="flex items-center gap-2 text-primary text-base 2xl:text-xl font-medium relative cursor-pointer"
              onClick={toggleLanguageSelect}
            >
              <span className="flex gap-2 items-center">
                <svg
                  className="h-5 w-5 2xl:w-6 2xl:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>

                {selectedLanguage}
              </span>

              <MdKeyboardArrowRight
                className={`h-4 w-4 2xl:w-6 2xl:h-6 transform transition ${
                  isLanguageSelectOpen ? "rotate-90" : ""
                }`}
              />
            </button>

            {isLanguageSelectOpen && (
              <div className="absolute mt-4 w-24 2xl:w-28 rounded-sm shadow-lg bg-white border border-gray-200 z-10" ref={languageRef}>
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

          <a href="/adminlogin" className="flex items-center gap-2">
            <FaUserLock className="text-primary" />

            <p className="text-primary font-semibold">{t("Admin SignIn")}</p>
          </a>
        </div>
      </header>
      {/* Main Content */}

      <div className="flex min-h-[calc(100vh-60px)]">
        {/* Left Column - Design Section */}

        <div className="w-full p-5 my-auto">
          <div className="w-full flex items-center justify-center px-0 sm:px-6">
            <div className="w-full max-w-md">
              {/* <div className="flex justify-start px-8 mb-2">
                <img
                  src="/rimilogo.png"
                  alt="RIMI Logo"
                  className="h:12 w-28 sm:h-16 sm:w-32 absolute left-16"
                />
              </div> */}

              <div className="bg-white">
                <div className="mb-3 lg:hidden">
                  <img
                    src="/rimilogo.png"
                    alt="RIMI Logo"
                    className="h:12 w-24 sm:h-16 sm:w-32"
                  />
                </div>
                <div className="mb-4 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-text-dark">
                    {t("Create Your Account")}
                  </h2>

                  <p className="text-text-light-2 text-sm sm:text-base">
                    {t("Join as an advisor and start your journey")}
                  </p>
                </div>

                <form className="space-y-2 sm:space-y-3">
                  {/* Full Name */}

                  <div>
                    <label htmlFor="name" className="text-text-light-2 text-sm">
                      {t("Full Name")}
                    </label>

                    <input
                      id="name"
                      type="text"
                      {...register("name", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                      placeholder={t("Enter your full name")}
                      className="w-full bg-white border border-inputBorder px-4 py-2 sm:py-3 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary text-black/80 placeholder:text-black/50"
                    />

                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}

                  <div>
                    <label
                      htmlFor="email"
                      className="text-text-light-2 text-sm"
                    >
                      {t("Email")}
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
                      placeholder="your.email@example.com"
                      className="w-full bg-white border border-inputBorder px-4 py-2 sm:py-3 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary text-black/80 placeholder:text-black/50"
                    />

                    {errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Agent Code */}

                  <div>
                    <label
                      htmlFor="agentCode"
                      className="text-text-light-2 text-sm"
                    >
                      {t("Agent Code")}
                    </label>

                    <input
                      id="agentCode"
                      type="text"
                      {...register("agentCode", {
                        setValueAs: (value) => value.trim().toUpperCase(),

                        required: "Agent code is required",

                        pattern: {
                          value: /^[A-Z0-9]{4,12}$/i,

                          message:
                            "Agent code must be 4-12 alphanumeric characters",
                        },
                      })}
                      placeholder={t("Enter your agent code")}
                      className="w-full bg-white border border-inputBorder px-4 py-2 sm:py-3 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary text-black/80 placeholder:text-black/50 uppercase placeholder:capitalize"
                    />

                    {errors.agentCode && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.agentCode.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}

                  <div>
                    <label
                      htmlFor="password"
                      className="text-text-light-2 text-sm"
                    >
                      {t("Password")}
                    </label>

                    <div className="relative">
                      <input
                        id="password"
                        {...register("password", {
                          setValueAs: (value) => value.trim(),
                          required: "Password is required",
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
                        autoComplete="new-password"
                        placeholder={t("Enter your password")}
                        className="w-full bg-white border border-inputBorder px-4 py-2 sm:py-3 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary text-black/80 placeholder:text-black/50 pr-12"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-700"
                      >
                        {showPassword ? (
                          <EyeIcon className="h-5 w-5 cursor-pointer" />
                        ) : (
                          <EyeSlashIcon className="h-5 w-5 cursor-pointer" />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="text-text-light-2 text-sm"
                    >
                      {t("Confirm Password")}
                    </label>

                    <div className="relative">
                      <input
                        id="confirmPassword"
                        {...register("confirmPassword", {
                          setValueAs: (value) => value.trim(),
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder={t("Re-enter your password")}
                        className="w-full bg-white border border-inputBorder px-4 py-2 sm:py-3 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary text-black/80 placeholder:text-black/50 pr-12"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-700"
                      >
                        {showConfirmPassword ? (
                          <EyeIcon className="h-5 w-5 cursor-pointer" />
                        ) : (
                          <EyeSlashIcon className="h-5 w-5 cursor-pointer" />
                        )}
                      </button>
                    </div>

                    {errors.confirmPassword && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* Submit button */}

                  <button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="bg-[var(--color-primary)] text-white py-2 sm:py-3 px-4 font-semibold hover:bg-[#2309A1] transition-all duration-200 cursor-pointer disabled:cursor-default disabled:opacity-70 w-full mt-2"
                  >
                    {loading ? `${t("Creating")}...` : t("Create Account")}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-text-light-2">
                    {t("Already have an account?")}{" "}
                    <a
                      href="/"
                      className="text-primary font-semibold hover:text-indigo-700 hover:underline transition-all delay-100"
                    >
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Right Column - Form Section */}
        <div className="hidden lg:flex xl:w-3/5 bg-gradient-to-br from-primary via-indigo-700 to-indigo-900 relative overflow-hidden">
          {/* Background Image */}
          <img src="/Signup.png" alt="" className="absolute  object-cover min-w-full" />

          {/* Content Container */}
          <div className="relative flex flex-col justify-center items-center px-12 text-white w-full">
            <img src="/RIMI.png" alt="rimi" className="mb-5 w-36" />

            {/* Main Heading */}
            <h1 className="text-5xl font-bold text-center mb-6 leading-tight text-white">
              Welcome to the
              <br />
              <span className="text-white">Future of Training</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-white/90 text-center max-w-lg leading-relaxed">
              Join thousands of agents advancing their careers through our
              comprehensive training and certification programs
            </p>
          </div>
        </div>
      </div>
      {NotificationComponent}
    </div>
  );
};

export default SignupPage;
