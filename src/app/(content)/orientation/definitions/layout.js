"use client";

import AuthGate from "@/app/components/auth/AuthGate";

export default function DefinitionsLayout({ children }) {
  return <AuthGate>{children}</AuthGate>;
}