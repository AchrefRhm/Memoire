"use client";

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";

const Page = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    // {
    //   name: "Free",
    //   price: "$0",
    //   period: "forever",
    //   features: [
    //     "1 technical & 1 HR interview per day",
    //     "Max 10 quiz questions (easy only)",
    //     "1 CV generation per day (no AI)",
    //     "1 ATS-optimized CV per day",
    //     "Challenges (no results/rankings)",
    //     "No chat feature",
    //   ],
    //   color: "bg-gradient-to-br from-gray-400 to-gray-500",
    //   href: "/signup",
    // },
    {
      name: "Premium",
      price: "$19",
      period: "monthly",
      features: [
        "10 technical & HR interviews per day",
        "20 quiz questions (easy & medium)",
        "Sweet notes feature",
        "10 CVs per day (no AI)",
        "10 ATS-optimized CVs per day",
        "Challenges (see others' results)",
      ],
      color: "bg-gradient-to-br from-blue-500 to-purple-600",
      href: "/checkout/premium",
      popular: true,
    },
    {
      name: "Ultimate",
      price: "$39",
      period: "monthly",
      features: [
        "Unlimited technical & HR interviews",
        "20 quiz questions (all difficulties)",
        "Unlimited AI-powered CV generation",
        "Unlimited ATS-optimized CVs",
        "Challenges with rankings",
        "Chat feature included",
      ],
      color: "bg-gradient-to-br from-purple-600 to-pink-500",
      href: "/checkout/ultimate",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Select the subscription that works best for your job search
          </p>
        </div>

        <div className="flex flex-col justify-center gap-8 md:flex-row">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex-1 overflow-hidden rounded-2xl shadow-xl transition-all duration-300 ${
                selectedPlan === plan.name
                  ? "scale-105 transform ring-4 ring-blue-400"
                  : "hover:scale-105 hover:transform"
              } ${plan.name === "Premium" ? "md:scale-105" : ""}`}
            >
              <div className={`${plan.color} p-1`}>
                {plan.popular && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-900">
                    MOST POPULAR
                  </div>
                )}
                <div className="rounded-xl bg-white p-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.price !== "$0" && (
                      <span className="ml-1 text-xl font-medium text-gray-500">
                        /{plan.period}
                      </span>
                    )}
                  </div>

                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <a
                      href={plan.href}
                      className={`flex w-full items-center justify-center rounded-lg border border-transparent px-6 py-3 text-base font-medium text-white ${
                        plan.name === "Ultimate"
                          ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
                          : plan.name === "Premium"
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                      } shadow-sm transition-all duration-300`}
                      onClick={() => setSelectedPlan(plan.name)}
                    >
                      {plan.price === "$0" ? "Get Started" : `Get ${plan.name}`}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>All paid plans include a 7-day free trial. Cancel anytime.</p>
          <p className="mt-2">
            Need help choosing?{" "}
            <a
              href="/contact"
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
