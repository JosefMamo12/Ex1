/**
 * Dashboard Sidebar navigation component
 */

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Video,
  Calendar,
  Clock,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
  Baby,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

/**
 * Navigation item interface
 */
interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

/**
 * Main navigation items
 */
const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/create", label: "Create Content", icon: Sparkles },
  { href: "/dashboard/content", label: "My Content", icon: Video },
  { href: "/dashboard/schedule", label: "Schedule", icon: Calendar },
  { href: "/dashboard/timing", label: "Best Times", icon: Clock },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
];

/**
 * Secondary navigation items
 */
const secondaryNavItems: NavItem[] = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

/**
 * Sidebar component
 */
export function Sidebar(): React.JSX.Element {
  const pathname = usePathname();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = (): void => {
    clearAuth();
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-100 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-toddler-pink to-toddler-purple flex items-center justify-center">
            <Baby className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">KidVid</h1>
            <p className="text-xs text-gray-500">Content Machine</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-toddler-pink/20 to-toddler-purple/20 text-toddler-purple"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-toddler-purple" : "text-gray-400"
                )}
              />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-6 mt-6 border-t border-gray-100">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-toddler-pink/20 to-toddler-purple/20 text-toddler-purple"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5",
                    isActive ? "text-toddler-purple" : "text-gray-400"
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-toddler-blue to-toddler-green flex items-center justify-center text-white font-semibold">
            {user?.firstName?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName ?? "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
