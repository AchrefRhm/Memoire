"use client";

import React from "react";
import {
  XCircle,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

const CancelPaymentPage = () => {
  // Sample transaction details - in a real app these would come from your payment processor
  const transactionDetails = {
    referenceId: "REF-8273651",
    date: "April 9, 2025",
    errorCode: "ERR-2051",
    reason: "Payment authorization failed",
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-red-50 to-white p-6">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="bg-gradient-to-r from-red-400 to-rose-500 p-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
            <XCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">Payment Failed</h1>
          <p className="mt-2 text-rose-50">
            Your payment could not be processed
          </p>
        </div>

        <div className="p-8">
          <div className="mb-6 rounded-lg border border-red-100 bg-red-50 p-4">
            <div className="flex items-start">
              <AlertTriangle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <div>
                <h3 className="font-medium text-red-800">What happened?</h3>
                <p className="mt-1 text-sm text-red-700">
                  {transactionDetails.reason}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">Reference ID</span>
              <span className="font-medium">
                {transactionDetails.referenceId}
              </span>
            </div>
            <div className="mb-2 flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">{transactionDetails.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Error Code</span>
              <span className="font-medium text-red-600">
                {transactionDetails.errorCode}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href="/checkout"
              className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-rose-500 to-red-500 px-4 py-3 font-medium text-white transition-all duration-200 hover:from-rose-600 hover:to-red-600"
            >
              Try Again
              <RefreshCw className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/plans"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Return to Plan Selection
        </a>
      </div>
    </div>
  );
};

export default CancelPaymentPage;
