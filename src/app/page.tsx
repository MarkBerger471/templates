"use client";

import { useState, useMemo } from "react";
import { templates, useCaseMatrix, categories } from "@/data/templates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function TemplateCard({ template }: { template: (typeof templates)[0] }) {
  const isFree =
    template.license.toLowerCase().includes("free") ||
    template.license.toLowerCase().includes("mit") ||
    template.license.toLowerCase().includes("apache");

  return (
    <Card className="group/tpl transition-shadow hover:shadow-lg">
      {/* Gradient preview */}
      <div
        className={`relative flex h-44 items-end bg-gradient-to-br ${template.gradient} p-4`}
      >
        <div className="absolute inset-0 bg-black/5 transition-opacity group-hover/tpl:bg-black/0" />
        <div className="relative flex w-full items-end justify-between">
          <Badge variant="secondary" className="text-xs">
            Tier {template.tier} — {template.tierLabel}
          </Badge>
          {isFree ? (
            <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Free</Badge>
          ) : (
            <Badge variant="outline" className="border-white/30 bg-black/40 text-white">
              {template.license.match(/\$[\d,]+/)?.[0] || "Premium"}
            </Badge>
          )}
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-base font-semibold">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stack */}
        <div className="flex flex-wrap gap-1.5">
          {template.stack.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs font-normal">
              {s}
            </Badge>
          ))}
        </div>

        {/* Meta */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <StarIcon className="size-3.5" />
            <span>{template.popularity}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BoltIcon className="size-3.5" />
            <span>{template.bestFor}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1">
          {template.features.slice(0, 4).map((f) => (
            <Badge key={f} variant="outline" className="text-[11px] font-normal">
              {f}
            </Badge>
          ))}
          {template.features.length > 4 && (
            <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground">
              +{template.features.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <a href={template.url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button size="sm" className="w-full">
            Preview
            <ExternalLinkIcon className="size-3" />
          </Button>
        </a>
        <a href={template.url} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            Details
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"tier" | "name">("tier");
  const [filterFree, setFilterFree] = useState(false);

  const filtered = useMemo(() => {
    let result = [...templates];

    if (activeCategory !== "All") {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (filterFree) {
      result = result.filter(
        (t) =>
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

    result.sort(
      sortBy === "name"
        ? (a, b) => a.name.localeCompare(b.name)
        : (a, b) => a.tier - b.tier
    );

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
    <div className="min-h-screen bg-background">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              T
            </div>
            <span className="text-lg font-bold">Template Finder</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            <a href="#templates">
              <Button variant="ghost" size="sm">Templates</Button>
            </a>
            <a href="#use-cases">
              <Button variant="ghost" size="sm">By Use Case</Button>
            </a>
            <a href="#trends">
              <Button variant="ghost" size="sm">Trends</Button>
            </a>
          </nav>
          <a href="#templates">
            <Button size="sm">Browse All</Button>
          </a>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6">
              Updated March 2026
            </Badge>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Best Website Templates,
              <br />
              <span className="text-muted-foreground">
                Starter Kits & UI Libraries
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Curated and ranked overview of {templates.length} top templates.
              Compare Tailwind CSS, Next.js, Astro, SvelteKit, and more to find
              the perfect foundation for your next project.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#templates">
                <Button size="lg">
                  Browse Templates
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </a>
              <a href="#use-cases">
                <Button variant="outline" size="lg">Find by Use Case</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
          {[
            { label: "Templates", value: templates.length.toString() },
            {
              label: "Free Options",
              value: templates.filter((t) => t.license.toLowerCase().includes("free")).length.toString(),
            },
            { label: "Categories", value: (categories.length - 1).toString() },
            { label: "Frameworks", value: "7+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Templates ─── */}
      <section id="templates" className="mx-auto max-w-7xl px-6 py-12">
        {/* Search & Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Tabs
              value={sortBy}
              onValueChange={(v) => setSortBy(v as "tier" | "name")}
            >
              <TabsList>
                <TabsTrigger value="tier">By Priority</TabsTrigger>
                <TabsTrigger value="name">A — Z</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant={filterFree ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterFree(!filterFree)}
            >
              Free Only
            </Button>
          </div>
        </div>

        {/* Category filter chips */}
        <div className="mb-8 flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const count = categoryCounts[cat] || 0;
            if (cat !== "All" && count === 0) return null;
            return (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "secondary"}
                size="xs"
                onClick={() => setActiveCategory(cat)}
                className="rounded-full"
              >
                {cat}
                <span className={activeCategory === cat ? "text-primary-foreground/60" : "text-muted-foreground"}>
                  {count}
                </span>
              </Button>
            );
          })}
        </div>

        {/* Result count */}
        <p className="mb-6 text-sm text-muted-foreground">
          Showing {filtered.length} of {templates.length} templates
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => (
              <TemplateCard key={t.name} template={t} />
            ))}
          </div>
        ) : (
          <Card className="py-16 text-center">
            <CardContent>
              <p className="text-lg font-medium">No templates found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
              <Button
                className="mt-4"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                  setFilterFree(false);
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* ─── Use Case Matrix ─── */}
      <section id="use-cases" className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold">
              Find the Right Template
            </h2>
            <p className="text-muted-foreground">
              Quick reference to match your project type to the best template.
            </p>
          </div>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Use Case</TableHead>
                  <TableHead>Top Pick</TableHead>
                  <TableHead>Runner-Up</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {useCaseMatrix.map((row) => (
                  <TableRow key={row.useCase}>
                    <TableCell className="font-medium">
                      {row.useCase}
                    </TableCell>
                    <TableCell>{row.topPick}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.runnerUp}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </section>

      {/* ─── Trends ─── */}
      <section id="trends" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold">Key Trends 2025 — 2026</h2>
          <p className="text-muted-foreground">
            What to know before choosing your template stack.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "shadcn/ui Dominance",
              text: "Copy-paste component model is the default for React/Next.js. Massive ecosystem of blocks and extensions.",
            },
            {
              title: "Tailwind CSS v4",
              text: "All actively maintained templates have migrated to v4 with CSS-first configuration.",
            },
            {
              title: "Astro for Content",
              text: "Near-perfect Lighthouse scores and zero JS by default make Astro the top pick for marketing & blogs.",
            },
            {
              title: "App Router Standard",
              text: "All modern Next.js templates use App Router. Pages Router is legacy.",
            },
            {
              title: "SvelteKit Rising",
              text: "20-40% smaller bundles than Next.js. Production-ready templates are multiplying.",
            },
            {
              title: "Copy-Paste > npm install",
              text: "Owning your component code rather than importing from node_modules is the new standard.",
            },
          ].map((trend) => (
            <Card key={trend.title} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>{trend.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {trend.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                  T
                </div>
                <span className="font-bold">Template Finder</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Curated overview of the best website templates, updated for 2026.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Tailwind CSS", "Next.js", "Astro", "SvelteKit"].map((c) => (
                  <li key={c}>
                    <a href="#templates" className="transition-colors hover:text-foreground">
                      {c}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#use-cases" className="transition-colors hover:text-foreground">
                    By Use Case
                  </a>
                </li>
                <li>
                  <a href="#trends" className="transition-colors hover:text-foreground">
                    Trends
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold">Built With</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Next.js 16</li>
                <li>Tailwind CSS v4</li>
                <li>shadcn/ui</li>
                <li>Vercel</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <p className="text-center text-sm text-muted-foreground">
            Template Finder — Last updated March 2026
          </p>
        </div>
      </footer>
    </div>
  );
}
