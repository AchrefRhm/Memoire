"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Loader,
  DollarSign,
  Users,
  Calendar,
  PieChartIcon,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

interface Subscriber {
  _id: string;
  count: number;
}

interface RevenueByPlan {
  _id: string;
  total: number;
}

interface RevenuePerMonth {
  _id: { year: number; month: number };
  total: number;
}

interface WeeklyNewSubs {
  _id: { year: number; week: number };
  count: number;
}

interface GrowthPoint {
  _id: { plan: string; date: string };
  count: number;
}

interface AnalyticsData {
  totalSubscribers: Subscriber[];
  revenues: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  revenuePerMonth: RevenuePerMonth[];
  weeklyNewSubs: WeeklyNewSubs[];
  growthCurve: GrowthPoint[];
  monthComparison: {
    current: number;
    previous: number;
  };
  revenueByPlan: RevenueByPlan[];
}

// Card component for reusability with improved design
const StatCard = ({ title, value, icon, change = null, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    purple: "bg-violet-100 text-violet-700 border-violet-200",
    orange: "bg-amber-100 text-amber-700 border-amber-200",
  };

  return (
    <div className="flex h-full flex-col rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-1 text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`rounded-lg p-3 ${colors[color]}`}>{icon}</div>
      </div>
      {change !== null && (
        <div className="mt-auto flex items-center pt-2 text-sm">
          {change >= 0 ? (
            <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
          ) : (
            <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span className={change >= 0 ? "text-emerald-500" : "text-red-500"}>
            {Math.abs(change)}% {change >= 0 ? "increase" : "decrease"}
          </span>
        </div>
      )}
    </div>
  );
};

// Chart container component for consistency
const ChartContainer = ({ title, children, height = "h-72" }) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">{title}</h2>
      <div className={height}>{children}</div>
    </div>
  );
};

// Full page component
function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = () => {
    setRefreshing(true);
    axios
      .get("http://localhost:5000/api/payment/get-analytics")
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  console.log(data);
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="mx-auto mb-4 h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg border border-red-100 bg-white p-6 text-center shadow-md">
          <p className="font-medium text-red-500">
            Failed to load analytics data
          </p>
          <button
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Format revenue per month data for chart
  const revenueChartData = data.revenuePerMonth
    .map((item) => ({
      name: `${item._id.month}/${item._id.year}`,
      revenue: item.total,
    }))
    .sort((a, b) => {
      const aDate = new Date(a.name);
      const bDate = new Date(b.name);
      return aDate.getTime() - bDate.getTime();
    });

  // Format weekly new subscriptions for chart
  const weeklySubsData = data.weeklyNewSubs
    .map((item) => ({
      name: `W${item._id.week} ${item._id.year}`,
      subscriptions: item.count,
    }))
    .sort((a, b) => {
      const aWeek = parseInt(a.name.split(" ")[0].substring(1));
      const aYear = parseInt(a.name.split(" ")[1]);
      const bWeek = parseInt(b.name.split(" ")[0].substring(1));
      const bYear = parseInt(b.name.split(" ")[1]);

      if (aYear !== bYear) return aYear - bYear;
      return aWeek - bWeek;
    });

  // Format revenue by plan for pie chart
  const revenueByPlanData = data.revenueByPlan.map((item) => ({
    name: item._id,
    value: item.total,
  }));

  // Format subscriber data for bar chart instead of pie chart
  const subscriberData = data.totalSubscribers.map((item) => ({
    name: item._id,
    subscribers: item.count,
  }));

  // Format growth curve data
  const growthData = data.growthCurve
    .map((item) => ({
      date: item._id.date,
      plan: item._id.plan,
      count: item.count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Group by date for line chart
  const groupedGrowthData = {};
  growthData.forEach((item) => {
    if (!groupedGrowthData[item.date]) {
      groupedGrowthData[item.date] = { date: item.date };
    }
    groupedGrowthData[item.date][item.plan] = item.count;
  });

  const formattedGrowthData = Object.values(groupedGrowthData);

  // Calculate monthly comparison percentage change
  const monthlyChangePercent =
    data.monthComparison.previous > 0
      ? (
          ((data.monthComparison.current - data.monthComparison.previous) /
            data.monthComparison.previous) *
          100
        ).toFixed(1)
      : 100;

  // Format monthly comparison data for bar chart
  const monthlyComparisonData = [
    { name: "Current Month", value: data.monthComparison.current },
    { name: "Previous Month", value: data.monthComparison.previous },
  ];

  // Colors for charts - improved color palette
  const COLORS = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#06b6d4", // cyan
  ];

  return (
    <DefaultLayout>
      <Head>
        <title>Analytics Dashboard</title>
        <meta
          name="description"
          content="Business analytics and metrics dashboard"
        />
      </Head>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                Analytics Dashboard
              </h1>
              <p className="mt-1 text-gray-500">
                Financial and subscription overview
              </p>
            </div>
            <button
              onClick={fetchData}
              disabled={refreshing}
              className="mt-4 flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:bg-blue-300 md:mt-0"
            >
              {refreshing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh Data
            </button>
          </div>

          {/* Revenue Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Daily Revenue"
              value={`$${data.revenues.daily.toFixed(2)}`}
              icon={<DollarSign className="h-6 w-6" />}
              color="green"
            />
            <StatCard
              title="Weekly Revenue"
              value={`$${data.revenues.weekly.toFixed(2)}`}
              icon={<Calendar className="h-6 w-6" />}
              color="blue"
            />
            <StatCard
              title="Monthly Revenue"
              value={`$${data.revenues.monthly.toFixed(2)}`}
              icon={<TrendingUp className="h-6 w-6" />}
              color="purple"
              change={parseFloat(monthlyChangePercent)}
            />
            <StatCard
              title="Total Users"
              value={data.totalSubscribers.reduce(
                (sum, item) => sum + item.count,
                0,
              )}
              icon={<Users className="h-6 w-6" />}
              color="orange"
            />
          </div>

          {/* Charts - First Row */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Monthly Revenue Chart - Changed to Line Chart */}
            <ChartContainer title="Monthly Revenue Trend">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px" }}
                    formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Weekly New Subscriptions Chart - Changed to Line Chart */}
            <ChartContainer title="Weekly New Users">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklySubsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="subscriptions"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Subscriptions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Charts - Second Row */}
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-1">
            {/* Subscribers by Plan - Kept as Bar Chart */}
            <ChartContainer title="Users by Plan">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subscriberData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Legend />
                  <Bar
                    dataKey="subscribers"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    name="Users"
                  >
                    {subscriberData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Revenue by Plan - Kept as Pie Chart */}
            <ChartContainer title="Revenue by Plan">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueByPlanData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {revenueByPlanData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Monthly Comparison - Changed to Bar Chart */}
          <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Monthly Revenue Comparison
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyComparisonData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value.toFixed(2)}`, "Revenue"]}
                    contentStyle={{ borderRadius: "8px" }}
                  />
                  <Legend />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Revenue">
                    <Cell fill="#3b82f6" /> {/* Current Month */}
                    <Cell fill="#8b5cf6" /> {/* Previous Month */}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center">
              <p
                className={`flex items-center text-sm ${parseFloat(monthlyChangePercent) >= 0 ? "text-emerald-500" : "text-red-500"}`}
              >
                {parseFloat(monthlyChangePercent) >= 0 ? (
                  <ArrowUp className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4" />
                )}
                {Math.abs(parseFloat(monthlyChangePercent))}%{" "}
                {parseFloat(monthlyChangePercent) >= 0
                  ? "increase"
                  : "decrease"}{" "}
                from previous month
              </p>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
export default AnalyticsPage;
