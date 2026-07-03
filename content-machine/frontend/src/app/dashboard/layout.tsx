/**
 * Dashboard layout wrapper
 * Handles authentication check and provides common layout
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

/**
 * Dashboard Layout props
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Layout component
 * Redirects to login if not authenticated
 */
export default function DashboardRootLayout({
  children,
}: DashboardLayoutProps): React.JSX.Element | null {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Check authentication on mount
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-toddler-purple border-t-transparent rounded-full" />
      </div>
    );
  }

  return <>{children}</>;
}
