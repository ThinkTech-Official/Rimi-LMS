import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAdminAuth, type SignInDto } from "../hooks/useAdminAuth";
import { useAdminContext } from "../context/AdminContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import useNotification from "../hooks/useNotification";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FaUserLock } from "react-icons/fa6";

const LoginAdmin: React.FC = () => {
  const navigate = useNavigate();

  const { login, loading, error: loginError } = useAdminAuth();
  const { reload: reloadAdmin } = useAdminContext();
  const [showPassword, setShowPassword] = useState(false);
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInDto>();
  const { NotificationComponent, triggerNotification } = useNotification();
  // useEffect(() => {
  //   if (state?.type && state?.message) {
  //     triggerNotification({
  //       type: state.type,
  //       message: state.message,
  //       duration: 3000,
  //     });

  //     navigate(location.pathname, { replace: true });
  //   }
  // }, [state, triggerNotification, navigate, location.pathname]);

  const onSubmit: SubmitHandler<SignInDto> = async (data: SignInDto) => {
    try {
      const ok = await login(data);
      if (ok) {
        await reloadAdmin();
        navigate("/admin/home");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Login failed"
      triggerNotification({
        type: "error",
        message: t(errorMessage) || t("Login failed"),
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
          <Link to="/" className="flex items-center gap-2">
            <FaUserLock className="text-primary" />
            <p className="text-primary font-semibold">{t("Advisor SignIn")}</p>
          </Link>
        </div>
      </header>
      <div className="flex items-center justify-center bg-white px-4 h-[calc(100vh-64px)]">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/rimilogo.png"
              alt="RIMI Logo"
              className="h-12 w-32 sm:h-[75px] sm:w-40"
            />
          </div>
          <h3 className="text-center text-base font-semibold text-primary mb-4">
            {t("Sign in as admin")}
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
                <p className="mt-1 text-sm text-red-600">
                  {t(String(errors.email.message))}
                </p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                {t("Password")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-zinc-300 focus:border-0 focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 cursor-pointer"
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
                <p className="mt-1 text-sm text-red-600">
                  {t(String(errors.password.message))}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 sm:py-3 bg-primary text-white font-semibold cursor-pointer transition-all delay-100 shadow hover:bg-indigo-700"
            >
              {loading ? `${t("Signing In")}...` : t("Sign In")}
            </button>
          </form>
        </div>
      </div>
      {NotificationComponent}
    </div>
  );
};

export default LoginAdmin;
