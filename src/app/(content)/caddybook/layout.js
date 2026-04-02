"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";

export default function CaddyBookLayout({ children }) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      setIsAllowed(true);
      setIsCheckingAuth(false);
    });

    return unsubscribe;
  }, [router]);

  if (isCheckingAuth) {
    return <div style={{ minHeight: "100vh" }} />;
  }

  if (!isAllowed) {
    return null;
  }

  return children;
}
