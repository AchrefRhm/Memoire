"use client";
import ECommerce from "@/components/Dashboard/Technical Interview Simulation";
import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useAuth } from "@/context/AuthContext";
import HomePage from "./home/page";
import AnalyticsPage from "./admin/paymentStatics/page";

// export const metadata: Metadata = {
//   title:
//     "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Home for TailAdmin Dashboard Template",
// };

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      {!user ? (
        <HomePage />
      ) : !user.isAdmin ? (
        <DefaultLayout>
          <ECommerce />
        </DefaultLayout>
      ) : (
        <AnalyticsPage />
      )}
    </>
  );
}
