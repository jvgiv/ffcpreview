"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import chapters from "@/data/def";

const allTerms = chapters.flatMap((chapter) => {
  const results = [];

  const mainTerms = chapter.terms.map((term) => ({
    id: term[8],
    name: term[1],
    definition: term[4],
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    termIndex: term[0],
    isSupplement: false,
    supplementTitle: null
  }));

  results.push(...mainTerms);

  if (chapter.supplement?.terms?.length > 0) {
    const suppTerms = chapter.supplement.terms.map((term) => ({
      id: term[7],
      name: term[1],
      definition: term[4],
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      termIndex: term[0],
      isSupplement: true,
      supplementTitle: chapter.supplement.title,
    }));
    results.push(...suppTerms);
  }

  return results;
});

export default function TermSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allTerms
      .filter((t) => t.name.toLowerCase().includes(q))
      .slice(0, 10);
  }, [query]);

  return (
    <div
      style={{
        position: "relative",
        maxWidth: "520px",
        margin: "0 auto 1.5rem",
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search 360 terms..."
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid var(--border-hi)",
          color: "var(--white)",
          fontFamily: "'Space Mono', monospace",
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          padding: "0.75rem 1rem",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      {results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#111",
            border: "1px solid var(--border-hi)",
            borderTop: "none",
            listStyle: "none",
            margin: 0,
            padding: 0,
            zIndex: 50,
            maxHeight: "340px",
            overflowY: "auto",
          }}
        >
          {results.map((t) => (
            <li key={t.id}>
              <Link
                href={
                  t.isSupplement
                    ? `/orientation/definitions/${t.chapterId}/supplement/terms/${t.termIndex}`
                    : `/orientation/definitions/${t.chapterId}/${t.termIndex}`
                }
                onClick={() => setQuery("")}
                style={{
                  display: "block",
                  padding: "0.65rem 1rem",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: "1rem",
                    color: "var(--red)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {t.name}
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: "0.6rem",
                    color: "var(--mgray)",
                    marginLeft: "0.6rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {t.chapterTitle}
                </span>
                {t.isSupplement && (
                  <span
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: "0.6rem",
                      color: "var(--red)",
                      marginLeft: "0.4rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    SUPPLEMENTAL DEFINTION *
                  </span>
                )}
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.78rem",
                    color: "var(--lgray)",
                    margin: "0.25rem 0 0",
                    lineHeight: "1.5",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t.definition}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
