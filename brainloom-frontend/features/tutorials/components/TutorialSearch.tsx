"use client";

import { useState } from "react";

export default function TutorialSearch({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  const [query, setQuery] = useState("");

  return (
    <input
      className="w-full p-3 border rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
      placeholder="Search tutorials..."
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
      }}
    />
  );
}