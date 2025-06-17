"use client";
import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";

import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import { ChallengeProvider } from "@/context/ChallengeContext";
import { AuthProvider } from "@/context/AuthContext";
import { BadgeProvider } from "@/context/BadgeContext";
import { SocketProvider } from "@/context/SocketContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <AuthProvider>
            <BadgeProvider>
              <ChallengeProvider>
                <SocketProvider>
                  {/* Show loading spinner or the actual content */}
                  {loading ? <Loader /> : children}
                </SocketProvider>
              </ChallengeProvider>
            </BadgeProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
