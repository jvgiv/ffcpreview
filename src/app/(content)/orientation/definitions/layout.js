"use client";

import AuthGate from "@/app/components/auth/AuthGate";
import { hasDefinitionsAccess } from "@/lib/access";

export default function DefinitionsLayout({ children }) {
  return (
    <AuthGate
      unauthorizedHref="/logged-in/checkout?agreement=financial-orientation"
      allow={({ profile, role }) =>
        hasDefinitionsAccess({
          role,
          paymentSummary: profile?.paymentSummary || {},
        })
      }
    >
      {children}
    </AuthGate>
  );
}
