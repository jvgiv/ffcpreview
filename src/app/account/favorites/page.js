"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { getDb } from "@/lib/firebase/firestore";
import chapters from "@/data/def";

function findTermById(termId) {
  const normalizedTermId = String(termId);
  const parts = normalizedTermId.split(":");
  const prefix = parts[0];
  const referencedChapterId = parts[1];
  const referencedTermId = parts[2];

  if (prefix !== "chapter" && prefix !== "supplement") {
    return null;
  }

  const targetChapterId = referencedChapterId;
  const targetTermId = referencedTermId;

  for (const chapter of chapters) {
    if (!targetChapterId || chapter.id === targetChapterId) {
      if (prefix === "supplement" && chapter.supplement?.terms) {
        const supplementMatch = chapter.supplement.terms.find(
          (entry) => String(entry[0]) === targetTermId
        );

        if (supplementMatch) {
          return {
            termId: normalizedTermId,
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            termNumber: String(supplementMatch[0]),
            termTitle: supplementMatch[1],
            definition: supplementMatch[4],
            routeHref: `/orientation/definitions/${chapter.id}/supplement/terms/${String(supplementMatch[0])}`,
            isSupplement: true,
          };
        }
      }

      const mainMatch = chapter.terms.find((entry) => String(entry[0]) === targetTermId);

      if (mainMatch) {
        return {
          termId: normalizedTermId,
          chapterId: chapter.id,
          chapterTitle: chapter.title,
          termNumber: String(mainMatch[0]),
          termTitle: mainMatch[1],
          definition: mainMatch[4],
          routeHref: `/orientation/definitions/${chapter.id}/${String(mainMatch[0])}`,
          isSupplement: false,
        };
      }
    }
  }

  return null;
}

export default function FavoritesPage() {
  const { authUser, profile } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    async function loadFavorites() {
      if (!authUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(getDb(), "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        const favoriteIds = Array.isArray(userDoc.data()?.favoriteTerms)
          ? userDoc.data().favoriteTerms.map((favoriteId) => String(favoriteId))
          : [];

        const resolvedFavorites = favoriteIds
          .map((termId) => findTermById(termId))
          .filter(Boolean);

        setFavorites(resolvedFavorites);
      } catch (err) {
        console.error("Failed to load favorites", err);
        setError("Unable to load favorites right now.");
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [authUser?.uid, profile?.favoriteTerms]);

  async function handleRemove(termId) {
    if (!authUser?.uid || !termId) {
      return;
    }

    setRemovingId(termId);
    setError("");

    try {
      const userDocRef = doc(getDb(), "users", authUser.uid);
      await updateDoc(userDocRef, {
        favoriteTerms: arrayRemove(String(termId)),
      });

      setFavorites((currentFavorites) => currentFavorites.filter((item) => item.termId !== String(termId)));
    } catch (err) {
      console.error("Failed to remove favorite", err);
      setError("Unable to remove that favorite right now.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "5rem 1.5rem 4rem" }}>
      <Link href="/logged-in" style={{ color: "inherit", textDecoration: "none" }}>
        ← Back to Account
      </Link>

      <h1 style={{ margin: "1rem 0 0.5rem", fontSize: "2.25rem" }}>Favorite Terms</h1>
      <p style={{ color: "rgba(245, 240, 232, 0.72)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
        Terms you have saved from the orientation definitions library.
      </p>

      {loading ? (
        <p>Loading favorites...</p>
      ) : error ? (
        <p style={{ color: "crimson" }}>{error}</p>
      ) : favorites.length === 0 ? (
        <p>No favorites yet. Check a term page and save one.</p>
      ) : (
        <ul style={{ display: "grid", gap: "1rem", padding: 0, listStyle: "none" }}>
          {favorites.map((favorite) => (
            <li
              key={favorite.termId}
              style={{
                border: "1px solid rgba(255,255,255,0.14)",
                padding: "1rem 1.1rem",
                borderRadius: "0.75rem",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <Link
                href={favorite.routeHref}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <strong>{favorite.termTitle}</strong>
              </Link>
              <div style={{ color: "rgba(245, 240, 232, 0.5)", marginTop: "0.35rem", fontSize: "0.9rem" }}>
                {favorite.chapterTitle}
              </div>
              <div style={{ color: "rgba(245, 240, 232, 0.7)", marginTop: "0.35rem" }}>
                {favorite.definition}
              </div>
              <button
                type="button"
                onClick={() => handleRemove(favorite.termId)}
                disabled={removingId === favorite.termId}
                style={{
                  marginTop: "0.8rem",
                  padding: "0.45rem 0.8rem",
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "transparent",
                  color: "inherit",
                  cursor: removingId === favorite.termId ? "wait" : "pointer",
                  borderRadius: "0.45rem",
                }}
              >
                {removingId === favorite.termId ? "Removing..." : "Remove"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
