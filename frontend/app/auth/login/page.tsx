"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Invalid credentials");
      }

      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-canvas-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="font-mono text-[16px] font-medium tracking-[0.08px] uppercase text-on-dark">
            Code-SRS
          </Link>
        </div>

        <div className="bg-canvas text-ink rounded-[4px] border border-hairline/10 p-8">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-body text-center mb-2">
            Welcome back
          </p>
          <h1 className="font-sans text-[28px] font-medium leading-[32.2px] tracking-[-0.42px] text-center mb-8">
            Sign in to your account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            {error && (
              <p className="text-[14px] text-red-400 font-sans text-center">{error}</p>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="font-sans text-[16px] text-body text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-ink underline hover:text-ink/70">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
