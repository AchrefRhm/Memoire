"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { useAuth } from "@/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";

// export const metadata: Metadata = {
//   title: "Next.js SignUp Page | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
//   // other metadata
// };

const SignUp: React.FC = () => {
  const { signUp } = useAuth();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRetype, setRetypePassword] = useState("");
  const [job, setJob] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password != passwordRetype) {
      toast.error("Password and confirm password do not match.", {
        position: "top-right",
        className: "text-sm",
      });
    } else {
      await signUp(username, email, password, job);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-12 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800 lg:flex-row">
        {/* Left Side - Brand */}
        <div className="relative hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 lg:block lg:w-1/2">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-white opacity-10"></div>
            <div className="absolute bottom-10 right-10 h-24 w-24 rounded-full bg-white opacity-10"></div>
            <div className="absolute left-1/4 top-1/2 h-40 w-40 rounded-full bg-white opacity-5"></div>
            <div className="absolute h-full w-full opacity-20">
              <svg
                className="absolute left-0 top-0 h-full w-full"
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="smallGrid"
                    width="15"
                    height="15"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 15 0 L 0 0 0 15"
                      fill="none"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)" />
              </svg>
            </div>
          </div>

          <div className="relative z-10 flex h-full flex-col">
            <Link
              href="/"
              className="mb-8 transform transition-transform hover:scale-105"
            >
              <div className="text-4xl font-bold text-white">
                TailAdmin<span className="text-blue-200">Pro</span>
              </div>
            </Link>

            <div className="mb-12 mt-10">
              <h2 className="mb-6 text-3xl font-bold text-white">
                Join Our Platform
              </h2>
              <p className="text-lg leading-relaxed text-blue-100">
                Create your account to access powerful tools designed to
                streamline your workflow and boost productivity.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-white bg-opacity-20 p-2">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="ml-3 text-white">
                    Professional dashboard tools
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-white bg-opacity-20 p-2">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="ml-3 text-white">Real-time analytics</span>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-white bg-opacity-20 p-2">
                    <svg
                      className="h-5 w-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="ml-3 text-white">
                    Customizable templates
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-center">
              <div className="rounded-2xl bg-white bg-opacity-10 p-4 shadow-lg backdrop-blur-sm">
                <svg
                  className="h-52 w-52 text-white opacity-90"
                  viewBox="0 0 350 350"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M33.5825 294.844L30.5069 282.723C25.0538 280.414 19.4747 278.414 13.7961 276.732L13.4079 282.365L11.8335 276.159C4.79107 274.148 0 273.263 0 273.263C0 273.263 6.46998 297.853 20.0448 316.653L35.8606 319.429L23.5737 321.2C25.2813 323.253 27.1164 325.196 29.0681 327.019C48.8132 345.333 70.8061 353.736 78.1898 345.787C85.5736 337.838 75.5526 316.547 55.8074 298.235C49.6862 292.557 41.9968 288.001 34.2994 284.415L33.5825 294.844Z"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                  <path
                    d="M243.681 82.9153H241.762V30.3972C241.762 26.4054 240.975 22.4527 239.447 18.7647C237.918 15.0768 235.677 11.7258 232.853 8.90314C230.028 6.0805 226.674 3.84145 222.984 2.31385C219.293 0.786245 215.337 0 211.343 0H99.99C91.9222 0 84.1848 3.20256 78.48 8.90314C72.7752 14.6037 69.5703 22.3354 69.5703 30.3972V318.52C69.5703 322.512 70.3571 326.465 71.8859 330.153C73.4146 333.841 75.6553 337.192 78.48 340.015C81.3048 342.837 84.6582 345.076 88.3489 346.604C92.0396 348.131 95.9952 348.918 99.99 348.918H211.343C219.41 348.918 227.148 345.715 232.852 340.014C238.557 334.314 241.762 326.582 241.762 318.52V120.299H243.68L243.681 82.9153Z"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                  <path
                    d="M142.368 122.512C142.368 120.501 142.898 118.526 143.904 116.784C144.911 115.043 146.359 113.597 148.102 112.592C146.36 111.587 144.383 111.057 142.371 111.057C140.358 111.057 138.381 111.586 136.639 112.591C134.896 113.596 133.448 115.042 132.442 116.784C131.436 118.525 130.906 120.501 130.906 122.512C130.906 124.522 131.436 126.498 132.442 128.239C133.448 129.981 134.896 131.427 136.639 132.432C138.381 133.437 140.358 133.966 142.371 133.966C144.383 133.966 146.36 133.436 148.102 132.431C146.359 131.426 144.911 129.981 143.905 128.24C142.898 126.499 142.368 124.523 142.368 122.512Z"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                  <path
                    d="M156.779 122.512C156.778 120.501 157.308 118.526 158.315 116.784C159.321 115.043 160.769 113.597 162.513 112.592C160.77 111.587 158.793 111.057 156.781 111.057C154.769 111.057 152.792 111.586 151.049 112.591C149.306 113.596 147.859 115.042 146.852 116.784C145.846 118.525 145.316 120.501 145.316 122.512C145.316 124.522 145.846 126.498 146.852 128.239C147.859 129.981 149.306 131.427 151.049 132.432C152.792 133.437 154.769 133.966 156.781 133.966C158.793 133.966 160.77 133.436 162.513 132.431C160.769 131.426 159.322 129.981 158.315 128.24C157.308 126.499 156.779 124.523 156.779 122.512Z"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                  <path
                    d="M170.862 133.966C177.192 133.966 182.325 128.838 182.325 122.512C182.325 116.186 177.192 111.057 170.862 111.057C164.531 111.057 159.398 116.186 159.398 122.512C159.398 128.838 164.531 133.966 170.862 133.966Z"
                    fill="currentColor"
                    fillOpacity="0.7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full p-6 sm:p-10 md:p-16 lg:w-1/2">
          <div className="mx-auto max-w-md">
            <div className="mb-8 flex justify-center lg:hidden">
              <Link href="/" className="inline-block">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  TailAdmin
                  <span className="text-indigo-600 dark:text-indigo-400">
                    Pro
                  </span>
                </div>
              </Link>
            </div>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Create Your Account
              </h2>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Get started with your free account today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 pl-10 text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 pl-10 text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="job"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Job Title
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 7a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4zm0 6a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <input
                    id="job"
                    name="job"
                    type="text"
                    required
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    placeholder="Product Designer"
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 pl-10 text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 pl-10 text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    value={passwordRetype}
                    onChange={(e) => setRetypePassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-3 pl-10 text-gray-900 placeholder-gray-400 shadow-sm transition duration-150 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-600 dark:text-gray-400"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-lg border border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create account
                  <svg
                    className="ml-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
