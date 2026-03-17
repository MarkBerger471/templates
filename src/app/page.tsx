import { templates, useCaseMatrix } from "@/data/templates";

const tierColors: Record<number, string> = {
  1: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  2: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  3: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  4: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  5: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
};

const tierDescriptions: Record<number, string> = {
  1: "The most impactful, widely adopted templates and systems. Start here.",
  2: "Framework-specific starters and SaaS boilerplates for rapid development.",
  3: "Component libraries and UI kits to use as building blocks in any project.",
  4: "Specialized admin dashboard templates with charts, tables, and data views.",
  5: "Traditional HTML/CSS template collections for quick static sites.",
};

function StackBadge({ name }: { name: string }) {
  return (
    <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
      {name}
    </span>
  );
}

function TemplateCard({ template }: { template: (typeof templates)[0] }) {
  return (
    <div className="group flex flex-col rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {template.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${tierColors[template.tier]}`}
        >
          Tier {template.tier}
        </span>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {template.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {template.stack.map((s) => (
          <StackBadge key={s} name={s} />
        ))}
      </div>

      <div className="mb-4 space-y-2 text-sm">
        <div className="flex gap-2">
          <span className="shrink-0 font-medium text-zinc-500 dark:text-zinc-500">
            License:
          </span>
          <span className="text-zinc-700 dark:text-zinc-300">
            {template.license}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-medium text-zinc-500 dark:text-zinc-500">
            Popularity:
          </span>
          <span className="text-zinc-700 dark:text-zinc-300">
            {template.popularity}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="shrink-0 font-medium text-zinc-500 dark:text-zinc-500">
            Best for:
          </span>
          <span className="text-zinc-700 dark:text-zinc-300">
            {template.bestFor}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-500">
          Key Features
        </p>
        <div className="flex flex-wrap gap-1.5">
          {template.features.map((f) => (
            <span
              key={f}
              className="inline-block rounded-md border border-zinc-200 px-2 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-2">
        <a
          href={template.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Visit
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const tiers = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <nav className="flex items-center justify-between">
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Template Finder
            </span>
            <div className="flex gap-4 text-sm">
              <a
                href="#templates"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Templates
              </a>
              <a
                href="#use-cases"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                By Use Case
              </a>
              <a
                href="#trends"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Trends
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
          Best Website Templates
          <br />
          <span className="text-zinc-500 dark:text-zinc-400">2025 — 2026</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          A curated, ranked overview of the best layout templates, starter kits,
          and component libraries. Filtered by priority so you can pick the right
          foundation for your next project.
        </p>
        <div className="flex flex-wrap gap-3">
          {tiers.map((t) => (
            <a
              key={t}
              href={`#tier-${t}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-opacity hover:opacity-80 ${tierColors[t]}`}
            >
              Tier {t}: {templates.find((tpl) => tpl.tier === t)?.tierLabel}
            </a>
          ))}
        </div>
      </section>

      {/* Templates by Tier */}
      <section id="templates" className="mx-auto max-w-7xl px-6 pb-20">
        {tiers.map((tier) => {
          const tierTemplates = templates.filter((t) => t.tier === tier);
          return (
            <div key={tier} id={`tier-${tier}`} className="mb-16">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Tier {tier}:{" "}
                    {tierTemplates[0]?.tierLabel}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tierColors[tier]}`}
                  >
                    {tierTemplates.length} templates
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                  {tierDescriptions[tier]}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tierTemplates.map((template) => (
                  <TemplateCard key={template.name} template={template} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* Use Case Matrix */}
      <section
        id="use-cases"
        className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50"
      >
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Best Template by Use Case
          </h2>
          <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-500">
            Quick reference to find the right template for your specific project type.
          </p>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="px-6 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    Use Case
                  </th>
                  <th className="px-6 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    Top Pick
                  </th>
                  <th className="px-6 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                    Runner-Up
                  </th>
                </tr>
              </thead>
              <tbody>
                {useCaseMatrix.map((row) => (
                  <tr
                    key={row.useCase}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/50"
                  >
                    <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {row.useCase}
                    </td>
                    <td className="px-6 py-3 text-zinc-700 dark:text-zinc-300">
                      {row.topPick}
                    </td>
                    <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">
                      {row.runnerUp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trends */}
      <section id="trends" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Key Trends 2025-2026
        </h2>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-500">
          What to know before choosing a template stack.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "shadcn/ui Dominance",
              text: "The copy-paste component model has become the default for React/Next.js. Massive ecosystem of blocks and extensions.",
            },
            {
              title: "Tailwind CSS v4",
              text: "All actively maintained templates have migrated or are migrating to v4 with its new CSS-first configuration.",
            },
            {
              title: "Astro for Content Sites",
              text: "Astro continues to gain ground for marketing sites and blogs with near-perfect Lighthouse scores and zero JS by default.",
            },
            {
              title: "App Router is Standard",
              text: "All modern Next.js templates use the App Router architecture. Pages Router is legacy.",
            },
            {
              title: "SvelteKit Rising",
              text: "Shipping 20-40% smaller bundles than Next.js. SvelteKit templates are increasingly production-ready.",
            },
            {
              title: "Copy-Paste > npm install",
              text: "The shadcn model of owning your component code rather than importing from node_modules is the new standard.",
            },
          ].map((trend) => (
            <div
              key={trend.title}
              className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
                {trend.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {trend.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Template Finder — Last updated March 2026. Built with Next.js + Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}
