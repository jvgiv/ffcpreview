"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { isAllowedUserRole, USER_ROLES } from "@/lib/firebase/userRoles";

function buildLoginRedirectHref() {
  if (typeof window === "undefined") {
    return "/login";
  }

  const currentPath = `${window.location.pathname}${window.location.search}`;
  const params = new URLSearchParams({
    redirect: currentPath,
    loginRequired: "1",
  });

  return `/login?${params.toString()}`;
}

export default function AuthGate({
  children,
  allowedRoles = [USER_ROLES.CLIENT, USER_ROLES.ADMIN],
  unauthorizedHref = "/logged-in",
  allow = null,
}) {
  const router = useRouter();
  const auth = useAuth();
  const { isLoading, isAuthenticated, role } = auth;
  const hasRequiredRole = isAllowedUserRole(role, allowedRoles);
  const hasAllowedAccess = typeof allow === "function" ? Boolean(allow(auth)) : true;

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(buildLoginRedirectHref());
      return;
    }

    if (!hasRequiredRole || !hasAllowedAccess) {
      router.replace(unauthorizedHref);
    }
  }, [
    hasAllowedAccess,
    hasRequiredRole,
    isAuthenticated,
    isLoading,
    router,
    unauthorizedHref,
  ]);

  if (isLoading) {
    return <div style={{ minHeight: "100vh" }} />;
  }

  if (!isAuthenticated || !hasRequiredRole || !hasAllowedAccess) {
    return null;
  }

  return children;
}
