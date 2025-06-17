"use client";

import React from "react";
import {
  CheckCircle,
  Calendar,
  Download,
  ArrowRight,
  Home,
} from "lucide-react";

const SuccessPaymentPage = () => {
  // Sample payment details - in a real app these would come from your payment processor
  const paymentDetails = {
    orderId: "ORD-2483917",
    date: "April 9, 2025",
    amount: "$14.99",
    plan: "Ultimate Subscription",
    nextBillingDate: "May 9, 2025",
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">
            Payment Successful!
          </h1>
          <p className="mt-2 text-emerald-50">
            Your subscription has been activated
          </p>
        </div>

        <div className="p-8">
          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span className="font-medium">{paymentDetails.orderId}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">{paymentDetails.date}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-medium">{paymentDetails.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Plan</span>
              <span className="font-medium">{paymentDetails.plan}</span>
            </div>
          </div>

          <div className="mb-6 flex items-center rounded-lg bg-emerald-50 p-4">
            <Calendar className="mr-3 h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-sm text-gray-600">Next billing date</p>
              <p className="font-medium text-gray-900">
                {paymentDetails.nextBillingDate}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href="/"
              className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-emerald-600 hover:to-green-600"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <Home className="mr-1 h-4 w-4" />
          Return to Homepage
        </a>
      </div>
    </div>
  );
};

export default SuccessPaymentPage;
