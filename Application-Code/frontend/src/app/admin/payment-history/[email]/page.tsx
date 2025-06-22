"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  Calendar,
  DollarSign,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Clock,
  User,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

// Mock fetch function to replace axios
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

interface PaymentHistory {
  fromPlan: string;
  toPlan: string;
  amount: number;
  changedAt: string;
}

interface PaymentInfo {
  username: string;
  email: string;
  history: PaymentHistory[];
  currentPlan?: string;
  subscriptionStart?: string;
  subscriptionEnd?: string;
}

interface PageProps {
  params: {
    email: string;
  };
}

const UserPaymentHistory = ({ params }: PageProps) => {
  const { email } = params;
  const router = useRouter();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof PaymentHistory>("changedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (!email) return;

    fetchData(
      `http://k8s-threetie-mainlb-11c5700e30-1182053200.us-east-1.elb.amazonaws.com/payment/get-userPaymentHistory/${email}`,
    )
      .then((res) => {
        setPaymentHistory(res.history || []);
        setPaymentInfo(res);

        // Calculate total spent
        if (res.history && res.history.length > 0) {
          const total = res.history.reduce(
            (sum, payment) => sum + payment.amount,
            0,
          );
          setTotalSpent(total);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch payment history");
      })
      .finally(() => setLoading(false));
  }, [email]);

  const handleSort = (field: keyof PaymentHistory) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);

    const sorted = [...paymentHistory].sort((a, b) => {
      if (a[field] < b[field]) return sortDirection === "asc" ? -1 : 1;
      if (a[field] > b[field]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    setPaymentHistory(sorted);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPlanBadgeColor = (plan: string) => {
    const planLower = plan.toLowerCase();
    if (planLower.includes("premium")) return "bg-purple-100 text-purple-700";
    if (planLower.includes("pro")) return "bg-blue-100 text-blue-700";
    if (planLower.includes("basic")) return "bg-gray-100 text-gray-700";
    return "bg-teal-100 text-teal-700";
  };

  const getChangeIcon = (fromPlan: string, toPlan: string) => {
    const planRanking = {
      free: 0,
      basic: 1,
      pro: 2,
      premium: 3,
    };

    const fromRank = Object.keys(planRanking).find((key) =>
      fromPlan.toLowerCase().includes(key.toLowerCase()),
    );
    const toRank = Object.keys(planRanking).find((key) =>
      toPlan.toLowerCase().includes(key.toLowerCase()),
    );

    if (!fromRank || !toRank) return null;

    if (planRanking[fromRank] < planRanking[toRank]) {
      return <ArrowUp className="h-4 w-4 text-green-500" />;
    } else if (planRanking[fromRank] > planRanking[toRank]) {
      return <ArrowDown className="h-4 w-4 text-red-500" />;
    } else {
      return null; // Same plan level
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-6xl p-6">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="mb-4 inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Subscribers
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Payment History
              </h1>
              {paymentInfo && (
                <p className="mt-1 text-gray-500">
                  {paymentInfo.username} • {paymentInfo.email}
                </p>
              )}
            </div>

            {paymentInfo?.currentPlan && (
              <div className="mt-4 sm:mt-0">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getPlanBadgeColor(paymentInfo.currentPlan)}`}
                >
                  Current Plan: {paymentInfo.currentPlan}
                </span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center rounded-lg bg-red-50 p-4 text-red-800">
            <AlertTriangle className="mr-2 h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            <span className="ml-2 text-gray-500">
              Loading payment history...
            </span>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Total Payments
                    </h3>
                    <p className="text-2xl font-bold">
                      {paymentHistory.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Total Spent
                    </h3>
                    <p className="text-2xl font-bold">
                      ${totalSpent.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg bg-white p-6 shadow">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Subscription
                    </h3>
                    <p className="text-sm text-gray-500">
                      {paymentInfo?.subscriptionStart && (
                        <>Since {formatDate(paymentInfo.subscriptionStart)}</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History Table */}
            {paymentHistory.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-1 text-lg font-medium text-gray-900">
                  No payment history
                </h3>
                <p className="text-gray-500">
                  This user doesn't have any recorded payments yet.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          onClick={() => handleSort("changedAt")}
                        >
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <span>Date</span>
                            {sortField === "changedAt" && (
                              <svg
                                className={`ml-1 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          <div className="flex items-center">
                            <span>Plan Change</span>
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          onClick={() => handleSort("amount")}
                        >
                          <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4" />
                            <span>Amount</span>
                            {sortField === "amount" && (
                              <svg
                                className={`ml-1 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {paymentHistory.map((payment, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {formatDateTime(payment.changedAt)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPlanBadgeColor(payment.fromPlan)}`}
                              >
                                {payment.fromPlan}
                              </span>
                              <div className="flex items-center">
                                <svg
                                  className="h-4 w-4 text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPlanBadgeColor(payment.toPlan)}`}
                              >
                                {payment.toPlan}
                              </span>
                              {getChangeIcon(payment.fromPlan, payment.toPlan)}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="font-medium text-gray-900">
                              ${payment.amount.toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default UserPaymentHistory;
