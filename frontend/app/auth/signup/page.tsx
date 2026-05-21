"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signup",
          inviteCode,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Signup failed");
      }

      setSuccess(true);
      setTimeout(() => router.push("/app"), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-canvas-dark flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-canvas text-ink rounded-[4px] border border-hairline/10 p-8 text-center">
            <h1 className="font-sans text-[28px] font-medium leading-[32.2px] tracking-[-0.42px] mb-4">
              Account created!
            </h1>
            <p className="font-sans text-[16px] text-body mb-6">
              Redirecting you to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
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
            Early access
          </p>
          <h1 className="font-sans text-[28px] font-medium leading-[32.2px] tracking-[-0.42px] text-center mb-8">
            Request access to Code-SRS
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Invite code"
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="Enter your invite code"
              required
            />
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
              placeholder="Create a password"
              required
              minLength={8}
            />

            {error && (
              <p className="text-[14px] text-red-400 font-sans text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Creating account..." : "Request access"}
            </Button>
          </form>

          <p className="font-sans text-[16px] text-body text-center mt-6">
            Already have access?{" "}
            <Link
              href="/auth/login"
              className="text-ink underline hover:text-ink/70"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
