"use client";

import AuthGate from "@/app/components/auth/AuthGate";

export default function CaddyBookLayout({ children }) {
  return <AuthGate>{children}</AuthGate>;
}