"use client";

import AuthGate from "@/app/components/auth/AuthGate";

export default function LoggedInLayout({ children }) {
  return <AuthGate>{children}</AuthGate>;
}