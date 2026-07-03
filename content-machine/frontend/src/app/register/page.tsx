/**
 * Registration page
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Baby, Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";

/**
 * Password requirements
 */
const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
];

/**
 * Registration Page component
 */
export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    // Validate password
    const allRequirementsMet = passwordRequirements.every((req) =>
      req.test(formData.password)
    );
    if (!allRequirementsMet) {
      setError("Please meet all password requirements");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register(formData);
      setAuth(response.user, response.accessToken);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-toddler-pink/10 via-white to-toddler-purple/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-toddler-pink to-toddler-purple flex items-center justify-center">
            <Baby className="w-7 h-7 text-white" />
          </div>
          <span className="font-bold text-2xl">KidVid</span>
        </Link>

        {/* Registration Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="text-gray-600 mt-2">
              Start creating amazing content for toddlers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="firstName"
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                leftIcon={<User className="w-5 h-5" />}
              />
              <Input
                type="text"
                name="lastName"
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <div>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
                required
              />
              {/* Password requirements */}
              <div className="mt-3 space-y-1.5">
                {passwordRequirements.map((req, index) => {
                  const met = req.test(formData.password);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-xs ${
                        met ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <Check
                        className={`w-3.5 h-3.5 ${met ? "opacity-100" : "opacity-40"}`}
                      />
                      {req.label}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-gray-300 text-toddler-purple focus:ring-toddler-purple"
              />
              <span className="text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-toddler-purple hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-toddler-purple hover:underline">
                  Privacy Policy
                </a>
              </span>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-toddler-purple hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
