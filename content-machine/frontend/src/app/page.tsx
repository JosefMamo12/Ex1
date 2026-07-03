/**
 * Landing page for the Toddler Content Machine
 */

import Link from "next/link";
import {
  Sparkles,
  Clock,
  BarChart3,
  Play,
  Youtube,
  Star,
  Baby,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Feature card data
 */
const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Create engaging animated videos for toddlers with our advanced AI. Generate nursery rhymes, counting songs, alphabet videos, and more.",
    color: "from-toddler-pink to-toddler-purple",
  },
  {
    icon: Clock,
    title: "Optimal Upload Timing",
    description:
      "Know exactly when to upload for maximum views. Our algorithm analyzes platform data to find the perfect time for toddler content.",
    color: "from-toddler-blue to-toddler-green",
  },
  {
    icon: BarChart3,
    title: "Revenue Analytics",
    description:
      "Track your performance and monetization. Get insights on views, engagement, and projected earnings across all platforms.",
    color: "from-toddler-yellow to-toddler-orange",
  },
];

/**
 * Category showcase data
 */
const categories = [
  { name: "Nursery Rhymes", emoji: "🎵" },
  { name: "Counting", emoji: "🔢" },
  { name: "Alphabet", emoji: "🔤" },
  { name: "Colors", emoji: "🌈" },
  { name: "Animals", emoji: "🐾" },
  { name: "Bedtime", emoji: "🌙" },
];

/**
 * Landing Page component
 */
export default function LandingPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-toddler-pink/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-toddler-pink to-toddler-purple flex items-center justify-center">
                <Baby className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">KidVid</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#categories"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Categories
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-toddler-purple/10 rounded-full text-toddler-purple text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Kids Content Creation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Create{" "}
            <span className="gradient-text">Magical Videos</span>
            <br />
            for Toddlers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            The all-in-one platform for creating, scheduling, and monetizing
            educational content for children aged 0-6. Generate AI-powered
            animated videos, find the perfect upload times, and track your
            revenue.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="xl" leftIcon={<Play className="w-5 h-5" />}>
                Start Creating for Free
              </Button>
            </Link>
            <Link href="#demo">
              <Button size="xl" variant="secondary">
                Watch Demo
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              COPPA Compliant
            </div>
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-500" />
              YouTube Kids Ready
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              4.9/5 Rating
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From content creation to monetization, we've got you covered
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section
        id="categories"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-toddler-purple/5 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Content for Every Learning Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create videos across 12+ toddler-friendly categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <span className="text-4xl mb-3 block">{category.emoji}</span>
                <span className="font-medium text-gray-900">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-toddler-pink to-toddler-purple rounded-3xl p-12 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create Amazing Kids Content?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of creators making a difference in children's
            education
          </p>
          <Link href="/register">
            <Button
              size="xl"
              variant="secondary"
              className="bg-white text-toddler-purple hover:bg-gray-100"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-toddler-pink to-toddler-purple flex items-center justify-center">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">KidVid Content Machine</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 KidVid. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
