// src/pages/ManualsPage.js
import React, { useEffect, useMemo, useState } from "react";
import ManualViewer from "../components/ManualViewer";

// Prefer primary manifest; fallback to alternate if needed
const MANIFEST_PRIMARY = "/manuals/manifest.json";
const MANIFEST_FALLBACK = "/manuals/manuals-manifest.json";

// Authoritative planned equipment types (placeholders shown if empty)
const PLANNED_TYPES = [
  "Pumps",
  "Filters",
  "Heaters",
  "Automation",
  "Lighting",
  "WaterCare",
];

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
  return res.json();
}

// Encode each path segment to handle spaces/special chars while preserving slashes
function encodePath(path) {
  if (!path || typeof path !== "string") return path;
  return path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/")
    .replace(/%2F/g, "/");
}

// Find a category list in a brand object by case-insensitive key match
function getCategoryList(categoriesObj, desiredKey) {
  if (!categoriesObj || typeof categoriesObj !== "object") return [];
  if (Array.isArray(categoriesObj[desiredKey])) return categoriesObj[desiredKey];

  const matchKey = Object.keys(categoriesObj).find(
    (k) => k.toLowerCase() === desiredKey.toLowerCase()
  );

  return Array.isArray(categoriesObj[matchKey])
    ? categoriesObj[matchKey]
    : [];
}

const ManualsPage = () => {
  const [manuals, setManuals] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setError("");
        const data = await fetchJson(MANIFEST_PRIMARY);
        if (!alive) return;
        setManuals(data || {});
      } catch (e1) {
        try {
          const data2 = await fetchJson(MANIFEST_FALLBACK);
          if (!alive) return;
          setManuals(data2 || {});
        } catch (e2) {
          if (!alive) return;
          setManuals({});
          setError(
            e2?.message || e1?.message || "Failed to load manuals manifest."
          );
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const brandKeys = useMemo(() => {
    return Object.keys(manuals || {}).sort((a, b) => a.localeCompare(b));
  }, [manuals]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 sm:py-4">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
        📚 Equipment Manuals
      </h1>

      {error ? (
        <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      ) : null}

      {/* LIST VIEW */}
      {!selectedFile && (
        <div className="space-y-3">
          {brandKeys.length === 0 && !error ? (
            <div className="text-center text-gray-600 text-sm">
              No manuals found.
            </div>
          ) : null}

          {brandKeys.map((brand) => {
            const categoriesObj = manuals?.[brand] || {};

            return (
              <details
                key={brand}
                className="rounded-lg border border-gray-200 bg-white shadow-sm"
              >
                <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-base sm:text-lg">
                  {brand}
                </summary>

                <div className="px-4 pb-4 pt-1 space-y-2">
                  {PLANNED_TYPES.map((category) => {
                    const list = getCategoryList(categoriesObj, category);
                    const hasManuals = list.length > 0;

                    return (
                      <details
                        key={`${brand}-${category}`}
                        className="rounded-md border border-gray-200 bg-gray-50"
                      >
                        <summary className="cursor-pointer select-none px-3 py-2 font-medium text-gray-900">
                          {category}
                          {!hasManuals && (
                            <span className="ml-2 text-xs text-gray-500">
                              (No manuals yet)
                            </span>
                          )}
                        </summary>

                        <div className="px-5 py-2">
                          {hasManuals ? (
                            <ul className="space-y-1 list-disc">
                              {list
                                .slice()
                                .sort((a, b) =>
                                  (a?.name || "").localeCompare(b?.name || "")
                                )
                                .map((manual) => (
                                  <li
                                    key={`${brand}-${category}-${manual.path}`}
                                  >
                                    <button
                                      onClick={() =>
                                        setSelectedFile(manual.path)
                                      }
                                      className="text-base sm:text-lg text-blue-600 hover:underline active:opacity-80 transition text-left"
                                    >
                                      {manual.name || "Manual"}
                                    </button>
                                  </li>
                                ))}
                            </ul>
                          ) : (
                            <div className="text-sm text-gray-500 italic">
                              No manuals added for this category yet.
                            </div>
                          )}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </details>
            );
          })}
        </div>
      )}

      {/* VIEWER */}
      {selectedFile && (
        <div className="w-full">
          <button
            onClick={() => setSelectedFile(null)}
            className="mb-3 sm:mb-4 text-sm sm:text-base text-gray-600 underline"
          >
            ← Back to manual list
          </button>

          {/* Encode path to avoid issues with spaces/special chars */}
          <ManualViewer fileUrl={encodePath(selectedFile)} />
        </div>
      )}
    </div>
  );
};

export default ManualsPage;