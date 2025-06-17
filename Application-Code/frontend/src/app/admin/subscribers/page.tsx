"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  FileText,
  ChevronDown,
  Calendar,
  DollarSign,
  User,
  Mail,
  Package,
} from "lucide-react";

interface Subscriber {
  _id: string;
  username: string;
  email: string;
  subs: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  latestPayment: { fromPlan: string; toPlan: string; amount: number } | null;
}

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Subscriber | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/payment/get-subscribers")
      .then((res) => {
        setSubscribers(res.data);
        setFilteredSubscribers(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch subscribers");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = subscribers.filter(
      (subscriber) =>
        subscriber.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscriber.subs.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredSubscribers(filtered);
  }, [searchTerm, subscribers]);
  console.log(subscribers);
  const cancelSubscription = async (email: string) => {
    try {
      await axios.post("/api/payment/cancel-subscription", { email });
      setSubscribers(
        subscribers.filter((subscriber) => subscriber.email !== email),
      );
    } catch (err) {
      console.error(err);
      setError("Failed to cancel subscription");
    }
  };

  const viewPaymentHistory = (email: string) => {
    router.push(`/admin/payment-history/${email}`);
  };

  const handleSort = (field: keyof Subscriber) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);

    const sorted = [...filteredSubscribers].sort((a, b) => {
      if (a[field] < b[field]) return isAsc ? 1 : -1;
      if (a[field] > b[field]) return isAsc ? -1 : 1;
      return 0;
    });
    setFilteredSubscribers(sorted);
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

  const getStatusColor = (endDate: string) => {
    if (!endDate) return "bg-gray-100 text-gray-600";
    const today = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.floor(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysLeft < 0) return "bg-red-100 text-red-700";
    if (daysLeft < 7) return "bg-amber-100 text-amber-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusText = (endDate: string) => {
    if (!endDate) return "No End Date";
    const today = new Date();
    const end = new Date(endDate);
    const daysLeft = Math.floor(
      (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysLeft < 0) return "Expired";
    if (daysLeft === 0) return "Expires Today";
    if (daysLeft === 1) return "1 day left";
    if (daysLeft < 7) return `${daysLeft} days left`;
    return "Active";
  };

  const getPlanBadgeColor = (plan: string) => {
    const planLower = plan.toLowerCase();
    if (planLower.includes("premium")) return "bg-purple-100 text-purple-700";
    if (planLower.includes("pro")) return "bg-blue-100 text-blue-700";
    if (planLower.includes("basic")) return "bg-gray-100 text-gray-700";
    return "bg-teal-100 text-teal-700";
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Subscribers Management
            </h1>
            <p className="mt-1 text-gray-500">
              {filteredSubscribers.length} subscribers found
            </p>
          </div>

          <div className="relative mt-4 md:mt-0">
            <div className="flex w-full max-w-md items-center rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="ml-2 w-full border-none p-0 focus:outline-none focus:ring-0"
              />
            </div>
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
            <span className="ml-2 text-gray-500">Loading subscribers...</span>
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
                      onClick={() => handleSort("username")}
                    >
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Username</span>
                        {sortField === "username" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      onClick={() => handleSort("email")}
                    >
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Email</span>
                        {sortField === "email" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      onClick={() => handleSort("subs")}
                    >
                      <div className="flex items-center">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Plan</span>
                        {sortField === "subs" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      onClick={() => handleSort("subscriptionStart")}
                    >
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Start Date</span>
                        {sortField === "subscriptionStart" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      onClick={() => handleSort("subscriptionEnd")}
                    >
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Status</span>
                        {sortField === "subscriptionEnd" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>Latest Payment</span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredSubscribers.length > 0 ? (
                    filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber._id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex w-12 items-center justify-center  rounded-full bg-blue-100 text-blue-600">
                              <img
                                src={
                                  subscriber.img.startsWith("https")
                                    ? subscriber.img
                                    : `http://localhost:5000${subscriber.img}`
                                }
                                alt=" Avatar"
                                className="h-full w-full rounded-full"
                              />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {subscriber.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {subscriber.email}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getPlanBadgeColor(subscriber.subs)}`}
                          >
                            {subscriber.subs}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(subscriber.subscriptionStart)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex flex-col">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(subscriber.subscriptionEnd)}`}
                            >
                              {getStatusText(subscriber.subscriptionEnd)}
                            </span>
                            <span className="mt-1 text-xs text-gray-500">
                              {formatDate(subscriber.subscriptionEnd)}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {subscriber.latestPayment ? (
                            <div className="text-sm">
                              <div className="font-medium">
                                ${subscriber.latestPayment.amount}
                              </div>
                              <div className="text-xs text-gray-500">
                                {subscriber.latestPayment.fromPlan} →{" "}
                                {subscriber.latestPayment.toPlan}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              No payment history
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() =>
                                viewPaymentHistory(subscriber.email)
                              }
                              className="rounded-md bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
                              title="View Payment History"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                cancelSubscription(subscriber.email)
                              }
                              className="rounded-md bg-red-100 p-2 text-red-600 transition-colors hover:bg-red-200"
                              title="Cancel Subscription"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
                            />
                          </svg>
                          <p className="mt-2 text-lg font-medium">
                            No subscribers found
                          </p>
                          <p className="text-sm text-gray-400">
                            Try adjusting your search terms
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default SubscribersPage;
