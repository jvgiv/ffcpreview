"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/auth";
import {
  buildResolvedFirebaseUserProfile,
  ensureFirebaseUserProfile,
} from "@/lib/firebase/userProfiles";
import { DEFAULT_USER_ROLE, formatUserRole } from "@/lib/firebase/userRoles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({
    isLoading: true,
    authUser: null,
    profile: null,
  });

  useEffect(() => {
    const auth = getFirebaseAuth();
    let isActive = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isActive) {
        return;
      }

      if (!user) {
        setState({
          isLoading: false,
          authUser: null,
          profile: null,
        });
        return;
      }

      setState((currentState) => ({
        ...currentState,
        isLoading: true,
        authUser: user,
      }));

      try {
        const profile = await ensureFirebaseUserProfile(user);

        if (!isActive) {
          return;
        }

        setState({
          isLoading: false,
          authUser: user,
          profile,
        });
      } catch (error) {
        console.error("Firebase user profile sync failed", error);

        if (!isActive) {
          return;
        }

        setState({
          isLoading: false,
          authUser: user,
          profile: buildResolvedFirebaseUserProfile(user, {
            role: DEFAULT_USER_ROLE,
          }),
        });
      }
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, []);

  async function refreshProfile() {
    const currentAuthUser = getFirebaseAuth().currentUser || state.authUser;

    if (!currentAuthUser) {
      setState({
        isLoading: false,
        authUser: null,
        profile: null,
      });

      return null;
    }

    try {
      const profile = await ensureFirebaseUserProfile(currentAuthUser);

      setState({
        isLoading: false,
        authUser: currentAuthUser,
        profile,
      });

      return profile;
    } catch (error) {
      console.error("Firebase user profile refresh failed", error);

      const fallbackProfile = buildResolvedFirebaseUserProfile(currentAuthUser, {
        role: DEFAULT_USER_ROLE,
      });

      setState({
        isLoading: false,
        authUser: currentAuthUser,
        profile: fallbackProfile,
      });

      return fallbackProfile;
    }
  }

  const role = state.profile?.role || DEFAULT_USER_ROLE;
  const value = {
    ...state,
    isAuthenticated: Boolean(state.authUser),
    role,
    roleLabel: formatUserRole(role),
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}