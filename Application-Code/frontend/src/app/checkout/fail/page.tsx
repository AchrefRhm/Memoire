"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const PaymentFailurePage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
          {/* Top banner with gradient */}
          <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-8 text-center text-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight">
              Payment Failed
            </h1>
            <p className="mt-2 text-white/90">
              There was an issue processing your payment
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="rounded-2xl bg-red-50 p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <div>
                    <h3 className="text-lg font-medium text-red-800">
                      Payment Error
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      We were unable to process your payment. Please check your
                      payment details and try again.
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-red-100 pt-4 text-sm text-gray-700">
                  <p className="font-medium">What you can try:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1 pl-2">
                    <li>Check your card details and try again</li>
                    <li>Use a different payment method</li>
                    <li>Verify with your bank if there are any restrictions</li>
                    <li>Try again in a few minutes</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex space-x-4">
                <Link
                  href="/checkout/premium"
                  className="flex w-1/2 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-4 text-base font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Try Premium
                </Link>

                <Link
                  href="/checkout/ultimate"
                  className="flex w-1/2 items-center justify-center rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-4 py-4 text-base font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Try Ultimate
                </Link>
              </div>

              <Link
                href="/payment-methods"
                className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-4 text-base font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Change Payment Method
              </Link>
            </div>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center space-x-4">
                <Link
                  href="/faq/payments"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Payment FAQ
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
