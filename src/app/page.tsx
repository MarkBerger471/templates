"use client";

import { useState, useMemo } from "react";
import { templates, useCaseMatrix, categories } from "@/data/templates";

const tierColors: Record<number, string> = {
  1: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  2: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  3: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  4: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  5: "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300",
};

function TemplateCard({
  template,
}: {
  template: (typeof templates)[0];
}) {
  const isFree = template.license.toLowerCase().includes("free");

  return (
    <div className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      {/* Preview thumbnail */}
      <div
        className={`relative flex h-48 items-end bg-gradient-to-br ${template.gradient} p-5`}
      >
        <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/0" />
        <div className="relative flex w-full items-end justify-between">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${tierColors[template.tier]}`}
          >
            Tier {template.tier}
          </span>
          {isFree ? (
            <span className="rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white">
              Free
            </span>
          ) : (
            <span className="rounded-full bg-zinc-900/80 px-2.5 py-0.5 text-xs font-semibold text-white">
              {template.license.match(/\$[\d,]+/)?.[0] || "Premium"}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {template.name}
          </h3>
        </div>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {template.description}
        </p>

        {/* Stack tags */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {template.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {s}
            </span>
          ))}
          {template.stack.length > 4 && (
            <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              +{template.stack.length - 4}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="mb-4 space-y-1.5 text-xs text-zinc-500 dark:text-zinc-500">
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>{template.popularity}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{template.bestFor}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <a
            href={template.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Preview
          </a>
          <a
            href={template.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-center text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Details
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"tier" | "name">("tier");
  const [filterFree, setFilterFree] = useState(false);

  const filtered = useMemo(() => {
    let result = templates;

    if (activeCategory !== "All") {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (filterFree) {
      result = result.filter((t) =>
        t.license.toLowerCase().includes("free") ||
        t.license.toLowerCase().includes("mit") ||
        t.license.toLowerCase().includes("apache")
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.stack.some((s) => s.toLowerCase().includes(q)) ||
          t.bestFor.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result = [...result].sort((a, b) => a.tier - b.tier);
    }

    return result;
  }, [search, activeCategory, sortBy, filterFree]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: templates.length };
    templates.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              T
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Template Finder
            </span>
          </a>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a
              href="#templates"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Templates
            </a>
            <a
              href="#use-cases"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              By Use Case
            </a>
            <a
              href="#trends"
              className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Trends
            </a>
          </nav>
          <a
            href="#templates"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Browse All
          </a>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Updated March 2026
            </span>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-100">
              Best Website Templates,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Starter Kits & UI Libraries
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Curated and ranked overview of {templates.length} top templates.
              Compare Tailwind CSS, Next.js, Astro, SvelteKit, and more to find
              the perfect foundation for your next project.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#templates"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl"
              >
                Browse Templates
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>
              <a
                href="#use-cases"
                className="rounded-xl border border-zinc-300 px-8 py-3.5 text-base font-semibold text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
              >
                Find by Use Case
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats bar ─── */}
      <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
          {[
            { label: "Templates", value: templates.length.toString() },
            {
              label: "Free Options",
              value: templates
                .filter((t) => t.license.toLowerCase().includes("free"))
                .length.toString(),
            },
            { label: "Categories", value: (categories.length - 1).toString() },
            { label: "Frameworks", value: "7+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Templates Section ─── */}
      <section id="templates" className="mx-auto max-w-7xl px-6 py-12">
        {/* Search & Sort bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900">
              <button
                onClick={() => setSortBy("tier")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  sortBy === "tier"
                    ? "bg-blue-600 text-white"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                By Priority
              </button>
              <button
                onClick={() => setSortBy("name")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  sortBy === "name"
                    ? "bg-blue-600 text-white"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                A — Z
              </button>
            </div>
            <button
              onClick={() => setFilterFree(!filterFree)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                filterFree
                  ? "border-green-500 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-400"
              }`}
            >
              Free Only
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            if (cat !== "All" && count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                }`}
              >
                {cat}
                <span
                  className={`ml-1.5 ${
                    activeCategory === cat
                      ? "text-blue-200"
                      : "text-zinc-400 dark:text-zinc-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-zinc-500 dark:text-zinc-500">
          Showing {filtered.length} of {templates.length} templates
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((template) => (
              <TemplateCard key={template.name} template={template} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white py-20 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
              No templates found
            </p>
            <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
                setFilterFree(false);
              }}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* ─── Use Case Matrix ─── */}
      <section
        id="use-cases"
        className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50"
      >
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Find the Right Template
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400">
              Quick reference to match your project type to the best template.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <th className="px-6 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                    Use Case
                  </th>
                  <th className="px-6 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                    Top Pick
                  </th>
                  <th className="px-6 py-3.5 font-semibold text-zinc-900 dark:text-zinc-100">
                    Runner-Up
                  </th>
                </tr>
              </thead>
              <tbody>
                {useCaseMatrix.map((row, i) => (
                  <tr
                    key={row.useCase}
                    className={`border-b border-zinc-100 last:border-0 dark:border-zinc-800/50 ${
                      i % 2 === 0 ? "" : "bg-zinc-50/50 dark:bg-zinc-800/20"
                    }`}
                  >
                    <td className="px-6 py-3.5 font-medium text-zinc-900 dark:text-zinc-100">
                      {row.useCase}
                    </td>
                    <td className="px-6 py-3.5 text-blue-600 dark:text-blue-400">
                      {row.topPick}
                    </td>
                    <td className="px-6 py-3.5 text-zinc-500 dark:text-zinc-400">
                      {row.runnerUp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Trends ─── */}
      <section id="trends" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Key Trends 2025 — 2026
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            What to know before choosing your template stack.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                </svg>
              ),
              title: "shadcn/ui Dominance",
              text: "Copy-paste component model is the default for React/Next.js. Massive ecosystem of blocks and extensions.",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              ),
              title: "Tailwind CSS v4",
              text: "All actively maintained templates have migrated to v4 with CSS-first configuration.",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              ),
              title: "Astro for Content",
              text: "Near-perfect Lighthouse scores and zero JS by default make Astro the top pick for marketing & blogs.",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              ),
              title: "App Router Standard",
              text: "All modern Next.js templates use App Router. Pages Router is legacy.",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              ),
              title: "SvelteKit Rising",
              text: "20-40% smaller bundles than Next.js. Production-ready templates are multiplying.",
            },
            {
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                </svg>
              ),
              title: "Copy-Paste > npm install",
              text: "Owning your component code rather than importing from node_modules is the new standard.",
            },
          ].map((trend) => (
            <div
              key={trend.title}
              className="rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-3 text-blue-600 dark:text-blue-400">
                {trend.icon}
              </div>
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
                {trend.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {trend.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">
                  T
                </div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  Template Finder
                </span>
              </div>
              <p className="text-sm leading-relaxed text-zinc-500">
                Curated overview of the best website templates, updated for 2026.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Categories
              </h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <a href="#templates" className="hover:text-zinc-900 dark:hover:text-zinc-300">
                    Tailwind CSS
                  </a>
                </li>
                <li>
                  <a href="#templates" className="hover:text-zinc-900 dark:hover:text-zinc-300">
                    Next.js
                  </a>
                </li>
                <li>
                  <a href="#templates" className="hover:text-zinc-900 dark:hover:text-zinc-300">
                    Astro
                  </a>
                </li>
                <li>
                  <a href="#templates" className="hover:text-zinc-900 dark:hover:text-zinc-300">
                    SvelteKit
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Resources
              </h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>
                  <a href="#use-cases" className="hover:text-zinc-900 dark:hover:text-zinc-300">
                    By Use Case
                  </a>
                </li>
                <li>
                  <a href="#trends" className="hover:text-zinc-900 dark:hover:text-zinc-300">
                    Trends
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Built With
              </h4>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>Next.js 16</li>
                <li>Tailwind CSS v4</li>
                <li>Vercel</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-zinc-200 pt-8 text-center text-sm text-zinc-400 dark:border-zinc-800">
            Template Finder — Last updated March 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
