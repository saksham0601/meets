"use client";

import { useState, useEffect } from "react";
import { Input } from "./input";
import Link from "next/link";

export default function TeamSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce search to reduce requests
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/teams/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.teams || []);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="fixed top-1 right-15 z-15">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search teams..."
        className="bg-white-10 dark:bg-gray-900/10 border border-foreground/20 backdrop-blur-2xl rounded-2xl w-50 text-foreground"
      />

      {loading && <p className="text-sm text-gray-500">Searching...</p>}

      <ul className="bg-white-10 dark:bg-gray-900/10 border border-foreground/20 backdrop-blur-2xl mt-0.5">
        {results.map((team) => (
          <li
            key={team._id}
            className="px-3 py-2 border-b border-b-foreground/20 last:border-b-0 hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
          >
            <Link href={`/teams/${team._id.toString()}`}>{team.name}</Link>
          </li>
        ))}
        {query && results.length === 0 && !loading && (
          <li className="px-3 py-2 text-gray-500">No teams found</li>
        )}
      </ul>
    </div>
  );
}

