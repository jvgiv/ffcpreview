"use client";

import React, { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { getDb } from "./firebase/firestore";

export default function FavoriteCheckbox({ termId }) {
  const { authUser } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFavoriteState() {
      if (!authUser?.uid || !termId) {
        if (isMounted) {
          setIsFavorite(false);
          setLoading(false);
        }
        return;
      }

      try {
        const userDocRef = doc(getDb(), "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);
        const favoriteIds = Array.isArray(userDoc.data()?.favoriteTerms)
          ? userDoc.data().favoriteTerms.map((favorite) => String(favorite))
          : [];

        if (isMounted) {
          setIsFavorite(favoriteIds.includes(String(termId)));
        }
      } catch (err) {
        console.error("Failed to read favorite state", err);
        if (isMounted) {
          setIsFavorite(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    setLoading(true);
    loadFavoriteState();

    return () => {
      isMounted = false;
    };
  }, [authUser?.uid, termId]);

  async function handleToggle(event) {
    const nextValue = event.target.checked;

    if (!authUser?.uid || !termId) {
      return;
    }

    setLoading(true);
    setError("");

    const userDocRef = doc(getDb(), "users", authUser.uid);

    try {
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, { favoriteTerms: [] }, { merge: true });
      }

      const normalizedTermId = String(termId);

      if (nextValue) {
        await updateDoc(userDocRef, {
          favoriteTerms: arrayUnion(normalizedTermId),
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(userDocRef, {
          favoriteTerms: arrayRemove(normalizedTermId),
          updatedAt: serverTimestamp(),
        });
      }

      setIsFavorite(nextValue);
    } catch (err) {
      console.error("Failed to update favorite term", err);
      setError("Could not save favorite right now.");
    } finally {
      setLoading(false);
    }
  }

  if (!termId) {
    return null;
  }

  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.7rem",
        cursor: loading || !authUser?.uid ? "not-allowed" : "pointer",
        marginTop: "1rem",
        padding: "0.7rem 0.95rem",
        border: "1px solid rgba(245, 240, 232, 0.16)",
        background: isFavorite ? "rgba(232, 119, 34, 0.12)" : "rgba(255,255,255,0.03)",
        borderRadius: "999px",
        width: "fit-content",
        color: isFavorite ? "var(--orange)" : "rgba(245, 240, 232, 0.82)",
        fontFamily: "'Space Mono', monospace",
        fontSize: "0.68rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
      }}
    >
      <span
        style={{
          width: "1rem",
          height: "1rem",
          border: "1px solid rgba(245, 240, 232, 0.28)",
          borderRadius: "0.2rem",
          background: isFavorite ? "var(--orange)" : "transparent",
          boxShadow: isFavorite ? "inset 0 0 0 2px rgba(10,10,10,0.9)" : "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#0a0a0a",
          fontSize: "0.72rem",
          fontWeight: 700,
        }}
      >
        {isFavorite ? "✓" : ""}
      </span>
      <input
        type="checkbox"
        checked={isFavorite}
        disabled={loading || !authUser?.uid}
        onChange={handleToggle}
        style={{ display: "none" }}
      />
      <span>{loading ? "Saving..." : isFavorite ? "Favorite" : "Add to favorites"}</span>
      {error ? <span style={{ color: "#ff9d8f" }}>{error}</span> : null}
    </label>
  );
}
