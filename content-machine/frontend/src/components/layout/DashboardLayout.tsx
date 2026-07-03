/**
 * Dashboard Layout wrapper component
 */

"use client";

import React from "react";
import { Sidebar } from "./Sidebar";

/**
 * Dashboard Layout props
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * Dashboard Layout component
 * Wraps dashboard pages with sidebar navigation
 */
export function DashboardLayout({
  children,
}: DashboardLayoutProps): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
