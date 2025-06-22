"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

// Types for our service tiers
interface ServiceDetails {
  name: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  brandColor: string;
}

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("plan");
  console.log(serviceId);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const email = user?.email;
  // Service configurations
  const services: Record<string, ServiceDetails> = {
    premium: {
      name: "Premium",
      description: "You've unlocked our Premium plan with enhanced features.",
      features: [
        "10 technical & HR interviews per day",
        "20 quiz questions (easy & medium)",
        "Sweet notes feature",
        " 10 CVs per day (no AI)",
        "10 ATS-optimized CVs per day",
        "Challenges (see others' results)",
      ],
      ctaText: "Go to Dashboard",
      ctaLink: "/dashboard",
      brandColor: "from-blue-500 to-indigo-600",
    },
    ultimate: {
      name: "Ultimate",
      description: "You now have access to our all-inclusive Ultimate package.",
      features: [
        "Unlimited technical & HR interviews",
        "20 quiz questions (all difficulties)",
        "Unlimited AI-powered CV generation",
        "Unlimited ATS-optimized CVs",
        "Challenges with rankings",
        "Chat feature included",
      ],
      ctaText: "Access Ultimate Portal",
      ctaLink: "/ultimate-portal",
      brandColor: "from-violet-500 to-purple-700",
    },
  };

  // Get the active service
  const currentService =
    serviceId && typeof serviceId === "string"
      ? services[serviceId.toLowerCase()]
      : services.premium; // Default to premium

  useEffect(() => {
    setMounted(true);

    // Fire confetti effect when component mounts
    if (typeof window !== "undefined") {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const runFireworks = () => {
        const interval: any = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);

          // Create star-shaped burst
          confetti({
            particleCount: Math.floor(randomInRange(25, 50)),
            spread: randomInRange(50, 100),
            origin: { y: 0.6, x: randomInRange(0.2, 0.8) },
            colors: ["#5D5FEF", "#4F46E5", "#7E22CE", "#EC4899"],
            shapes: ["star", "circle"],
            scalar: randomInRange(0.8, 1.2),
          });
        }, 250);
      };

      runFireworks();
    }
  }, []);

  useEffect(() => {
    if (email && serviceId) {
      axios.post("http://k8s-threetie-mainlb-11c5700e30-1182053200.us-east-1.elb.amazonaws.com/api/auth/subscriptions/confirm", {
        email,
        plan: serviceId,
      });
    }
  }, [email, serviceId]);
  // Prevent SSR mismatch
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl">
          {/* Top banner with gradient */}
          <div
            className={`bg-gradient-to-r ${currentService?.brandColor} px-6 py-8 text-center text-white`}
          >
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-tight">
              Payment Successful!
            </h1>
            <p className="mt-2 text-white/90">
              Thank you for subscribing to our {currentService?.name} service
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="rounded-2xl bg-gray-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Your plan</p>
                  <p className="text-xl font-bold text-gray-900">
                    {currentService?.name} Service
                  </p>
                </div>
                <div className="rounded-full bg-green-100 px-3 py-1">
                  <p className="text-sm font-medium text-green-800">Active</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {currentService?.description}
                </p>
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Included features:
                </p>
                <ul className="space-y-2">
                  {currentService?.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-sm text-gray-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-4 w-4 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <Link
                href={currentService?.ctaLink || "#"}
                className={`flex w-full items-center justify-center rounded-xl bg-gradient-to-r ${currentService?.brandColor} px-6 py-4 text-base font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                {currentService?.ctaText}
              </Link>

              <Link
                href="/account/settings"
                className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-4 text-base font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                Manage Subscription
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to your inbox with all the
                details.
              </p>

              <div className="mt-4 flex items-center justify-center space-x-4">
                <Link
                  href="/help"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Need help?
                </Link>
                <span className="text-gray-300">|</span>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Contact support
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

export default PaymentSuccessPage;
