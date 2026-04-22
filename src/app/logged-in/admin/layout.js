"use client";

import AuthGate from "@/app/components/auth/AuthGate";
import { USER_ROLES } from "@/lib/firebase/userRoles";

export default function LoggedInAdminLayout({ children }) {
  return <AuthGate allowedRoles={[USER_ROLES.ADMIN]}>{children}</AuthGate>;
}