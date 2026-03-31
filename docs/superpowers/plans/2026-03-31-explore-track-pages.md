# Explore Track — Program Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a user clicks "Explore Track" on a BSCS, BSIT, or ACT program card, they navigate to a dedicated static page (`/programs/[slug]`) showing the full program details: overview, curriculum, career paths, and highlights.

**Architecture:** A dynamic Next.js route at `app/programs/[slug]/page.tsx` (server component) reads the slug, looks up the program in `data/programs.ts`, and renders a `ProgramDetail` client component with Framer Motion animations. `generateStaticParams` pre-renders all three pages at build time. `ProgramsUnder.tsx` is updated to import from the shared data file and wrap the "Explore Track" button in a Next.js `<Link>`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `data/programs.ts` | `Program` type + all three program data objects |
| Create | `app/programs/[slug]/page.tsx` | Server component: `generateStaticParams`, slug lookup, `notFound()`, renders `ProgramDetail` |
| Create | `app/programs/[slug]/ProgramDetail.tsx` | `"use client"` component: full page layout with Framer Motion animations |
| Modify | `components/about/ProgramsUnder.tsx` | Import from `data/programs.ts`, wrap "Explore Track" in `<Link>` |

---

## Task 1: Create the program data file

**Files:**
- Create: `data/programs.ts`

- [ ] **Step 1: Create `data/programs.ts` with the `Program` type and all three programs**

```ts
export type Program = {
  slug: string;
  short: string;
  title: string;
  tagline: string;
  duration: string;
  degree: string;
  accreditation: string;
  overview: string;
  curriculum: string[];
  careers: string[];
  highlights: { title: string; desc: string }[];
};

export const programs: Program[] = [
  {
    slug: "bscs",
    short: "BSCS",
    title: "Computer Science",
    tagline:
      "Master algorithms, software engineering, AI, and advanced computing theories for research and tech leadership.",
    duration: "4 Years",
    degree: "BS Degree",
    accreditation: "CHED",
    overview:
      "The BS Computer Science program equips students with deep theoretical foundations and practical skills in software development, algorithms, and computing systems. Students explore areas ranging from artificial intelligence and machine learning to software engineering and theory of computation. Graduates are prepared for careers in tech leadership, software development, research, or graduate studies.",
    curriculum: [
      "Data Structures & Algorithms",
      "Discrete Mathematics",
      "Object-Oriented Programming",
      "Computer Architecture & Organization",
      "Operating Systems",
      "Database Management Systems",
      "Software Engineering",
      "Artificial Intelligence",
      "Machine Learning",
      "Theory of Computation",
      "Programming Languages",
      "Human-Computer Interaction",
      "Capstone Project",
    ],
    careers: [
      "Software Engineer",
      "Data Scientist",
      "AI / ML Engineer",
      "Systems Architect",
      "Research Scientist",
      "Backend / Full-Stack Developer",
      "CTO / Tech Lead",
    ],
    highlights: [
      {
        title: "Theory + Practice",
        desc: "Strong algorithmic foundations for innovation and research.",
      },
      {
        title: "Grad School Ready",
        desc: "Direct pathway to MS/PhD programs locally and abroad.",
      },
      {
        title: "High Industry Demand",
        desc: "Top-paying roles at leading tech companies.",
      },
    ],
  },
  {
    slug: "bsit",
    short: "BSIT",
    title: "Information Technology",
    tagline:
      "Develop practical skills in web development, cybersecurity, cloud computing, and enterprise solutions.",
    duration: "4 Years",
    degree: "BS Degree",
    accreditation: "CHED",
    overview:
      "The BS Information Technology program develops industry-ready professionals skilled in deploying, managing, and securing technology systems for businesses. Students gain hands-on experience in web development, network administration, cybersecurity, cloud platforms, and enterprise IT solutions. Graduates are equipped to immediately contribute to organizations across all industries.",
    curriculum: [
      "Web Systems & Technologies",
      "Network Administration",
      "Cybersecurity Fundamentals",
      "Cloud Computing (AWS / Azure)",
      "Database Administration",
      "Systems Integration & Architecture",
      "IT Project Management",
      "Enterprise Resource Planning (ERP)",
      "Information Assurance & Security",
      "Mobile Application Development",
      "Technical Documentation",
      "Capstone Project",
    ],
    careers: [
      "Web Developer / Full-Stack Developer",
      "IT Manager",
      "Cybersecurity Analyst",
      "Cloud Solutions Architect",
      "Systems Administrator",
      "DevOps Engineer",
      "IT Consultant",
    ],
    highlights: [
      {
        title: "Industry-Ready Skills",
        desc: "Practical curriculum aligned with real-world IT environments.",
      },
      {
        title: "Broad Coverage",
        desc: "From web dev to cloud to security, all in one program.",
      },
      {
        title: "Fast Career Entry",
        desc: "High demand for IT professionals across every industry.",
      },
    ],
  },
  {
    slug: "act",
    short: "ACT",
    title: "Computer Technology",
    tagline:
      "Two-year intensive program with foundational skills in programming, networking, and hardware.",
    duration: "2 Years",
    degree: "Associate Degree",
    accreditation: "TESDA / CHED",
    overview:
      "The Associate in Computer Technology program is a two-year course providing students with essential skills in computer programming, hardware servicing, networking, and technical support. Designed for students who want to enter the IT workforce quickly or build a strong foundation before pursuing a bachelor's degree, ACT combines practical training with industry-relevant certifications.",
    curriculum: [
      "Computer Programming Fundamentals",
      "Computer Hardware Servicing & Troubleshooting",
      "Network Fundamentals (Cisco NetAcad)",
      "Web Design & Development Basics",
      "Office Productivity & Desktop Support",
      "Technical Support & Help Desk Operations",
      "Database Fundamentals",
      "Cybersecurity Awareness",
    ],
    careers: [
      "Computer Technician",
      "IT Support Specialist / Help Desk Analyst",
      "Web Designer",
      "Network Technician",
      "Desktop Support Engineer",
      "Junior Developer",
    ],
    highlights: [
      {
        title: "Shorter Duration",
        desc: "Enter the workforce in 2 years with in-demand technical skills.",
      },
      {
        title: "Certification Paths",
        desc: "Aligned with TESDA NC II and Cisco certifications.",
      },
      {
        title: "Stepping Stone",
        desc: "Solid foundation for advancing to BSIT or BSCS.",
      },
    ],
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd C:/Users/Erna/Documents/webdev/jpcs-site && npx tsc --noEmit`

Expected: No errors related to `data/programs.ts`.

- [ ] **Step 3: Commit**

```bash
git add data/programs.ts
git commit -m "feat: add programs data file with BSCS, BSIT, and ACT content"
```

---

## Task 2: Create the ProgramDetail client component

**Files:**
- Create: `app/programs/[slug]/ProgramDetail.tsx`

- [ ] **Step 1: Create the directory**

```bash
mkdir -p "app/programs/[slug]"
```

- [ ] **Step 2: Create `app/programs/[slug]/ProgramDetail.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Program } from "@/data/programs";

export default function ProgramDetail({ program }: { program: Program }) {
  return (
    <main className="min-h-screen bg-charcoal">
      {/* Back navigation */}
      <div className="bg-charcoal border-b border-white/10 px-6 md:px-16 py-4">
        <Link
          href="/#about"
          className="inline-flex items-center gap-2 text-white/50 hover:text-neon transition-colors duration-200 text-sm font-medium"
        >
          <span>←</span>
          <span>Back to Degree Programs</span>
        </Link>
      </div>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-br from-navy to-charcoal px-6 md:px-16 py-16 md:py-24 overflow-hidden border-b-2 border-neon"
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
        {/* Ghost watermark */}
        <div className="absolute -bottom-4 -right-8 text-[12rem] font-black text-white/[0.02] select-none pointer-events-none leading-none tracking-tighter">
          {program.short}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-neon/10 border border-neon/20 text-neon font-extrabold text-sm tracking-widest uppercase mb-6">
            {program.short}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
            {program.title}
          </h1>
          <p className="text-white/60 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
            {program.tagline}
          </p>
          <div className="flex flex-wrap gap-4">
            {[
              { label: "Duration", value: program.duration },
              { label: "Award", value: program.degree },
              { label: "Accreditation", value: program.accreditation },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-center"
              >
                <div className="text-neon font-extrabold text-lg">
                  {stat.value}
                </div>
                <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Sections */}
      <div className="bg-off-white px-6 md:px-16 py-12 md:py-20">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">

          {/* Program Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-charcoal rounded-3xl p-8 md:p-10 border border-white/5"
          >
            <p className="text-neon text-xs font-extrabold tracking-[0.2em] uppercase mb-4">
              Program Overview
            </p>
            <p className="text-white/70 leading-relaxed text-base md:text-lg">
              {program.overview}
            </p>
          </motion.div>

          {/* Core Curriculum */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-charcoal rounded-3xl p-8 md:p-10 border border-white/5"
          >
            <p className="text-neon text-xs font-extrabold tracking-[0.2em] uppercase mb-6">
              Core Curriculum
            </p>
            <div className="flex flex-wrap gap-3">
              {program.curriculum.map((subject) => (
                <span
                  key={subject}
                  className="bg-charcoal-light border border-white/10 text-white/80 text-sm px-4 py-2 rounded-xl"
                >
                  {subject}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Career Paths + Why Choose — 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-charcoal rounded-3xl p-8 border border-white/5"
            >
              <p className="text-neon text-xs font-extrabold tracking-[0.2em] uppercase mb-6">
                Career Paths
              </p>
              <ul className="flex flex-col gap-3">
                {program.careers.map((career) => (
                  <li
                    key={career}
                    className="flex items-center gap-3 text-white/80 text-sm"
                  >
                    <span className="text-neon font-bold flex-shrink-0">→</span>
                    {career}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-charcoal rounded-3xl p-8 border border-white/5"
            >
              <p className="text-neon text-xs font-extrabold tracking-[0.2em] uppercase mb-6">
                Why Choose {program.short}?
              </p>
              <div className="flex flex-col gap-4">
                {program.highlights.map((h) => (
                  <div
                    key={h.title}
                    className="bg-charcoal-light rounded-xl p-4 border-l-2 border-neon"
                  >
                    <p className="text-white font-bold text-sm mb-1">{h.title}</p>
                    <p className="text-white/50 text-xs leading-relaxed">{h.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add "app/programs/[slug]/ProgramDetail.tsx"
git commit -m "feat: add ProgramDetail client component with hero and section layout"
```

---

## Task 3: Create the program page server component

**Files:**
- Create: `app/programs/[slug]/page.tsx`

- [ ] **Step 1: Create `app/programs/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { programs } from "@/data/programs";
import ProgramDetail from "./ProgramDetail";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);

  if (!program) notFound();

  return <ProgramDetail program={program} />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Run dev server and manually verify all three routes**

Run: `npm run dev`

Open in browser:
- `http://localhost:3000/programs/bscs` — should show Computer Science page
- `http://localhost:3000/programs/bsit` — should show Information Technology page
- `http://localhost:3000/programs/act` — should show Computer Technology page
- `http://localhost:3000/programs/unknown` — should show Next.js 404 page

- [ ] **Step 4: Commit**

```bash
git add "app/programs/[slug]/page.tsx"
git commit -m "feat: add dynamic program page route with generateStaticParams"
```

---

## Task 4: Update ProgramsUnder.tsx to use shared data and link to program pages

**Files:**
- Modify: `components/about/ProgramsUnder.tsx`

- [ ] **Step 1: Replace `components/about/ProgramsUnder.tsx` with the updated version**

Replace the entire file content:

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { programs } from "@/data/programs";

const ProgramsUnder = () => {
  return (
    <section className="relative py-20 pb-32 px-6 md:px-16 overflow-hidden bg-[#F4F4F5]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_100%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-10 lg:mb-15"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight mb-6">
            Degree{" "}
            <span className="bg-neon px-5 py-2 rounded-full inline-block transform rotate-2">
              Programs
            </span>
          </h2>
          <p className="text-navy/60 text-lg md:text-xl font-medium max-w-2xl">
            Explore the cutting-edge academic tracks under the Junior Philippine
            Computer Society.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((prog, index) => (
            <motion.div
              key={prog.short}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative bg-charcoal rounded-[2.5rem] p-10 overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-neon/40 hover:shadow-[0_20px_50px_-10px_rgba(196,255,71,0.15)] flex flex-col"
            >
              <div className="absolute -bottom-4 -right-4 text-[8rem] font-black text-white/[0.02] select-none pointer-events-none tracking-tighter group-hover:text-white/[0.05] transition-colors duration-500">
                {prog.short}
              </div>

              <div className="mb-10 relative z-10">
                <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-neon/10 border border-neon/20 text-neon font-extrabold text-sm tracking-widest uppercase">
                  {prog.short}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-4 leading-tight relative z-10">
                {prog.title}
              </h3>

              <p className="text-white/60 font-medium leading-relaxed relative z-10 mb-10 flex-grow">
                {prog.tagline}
              </p>

              <Link
                href={`/programs/${prog.slug}`}
                className="mt-auto flex items-center gap-4 text-white font-bold text-sm relative z-10 group-hover:text-neon transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neon group-hover:border-neon group-hover:text-navy transition-all duration-300 shadow-inner">
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <span className="tracking-wide uppercase text-xs transform group-hover:translate-x-1 transition-transform duration-300">
                  Explore Track
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsUnder;
```

> **Note:** The field `desc` from the old local array is now `tagline` from `data/programs.ts` — both contain the same card description text.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Open the home page and verify all three cards link correctly**

Run: `npm run dev`

Open `http://localhost:3000` and scroll to the Degree Programs section. Click each "Explore Track" button — it should navigate to the correct program page.

- [ ] **Step 4: Commit**

```bash
git add components/about/ProgramsUnder.tsx
git commit -m "feat: wire up Explore Track buttons to program detail pages"
```

---

## Task 5: Production build verification

- [ ] **Step 1: Run production build**

Run: `npm run build`

Expected output includes:
```
Route (app)                    Size
├ ○ /programs/bscs             ...
├ ○ /programs/bsit             ...
├ ○ /programs/act              ...
```

The `○` symbol confirms these are statically pre-rendered pages.

- [ ] **Step 2: Commit if any build-time fixes were needed**

If `npm run build` required any fixes, commit them:

```bash
git add -p
git commit -m "fix: resolve build-time issues with program pages"
```

---

## Self-Review Notes

- All four spec sections (Overview, Curriculum, Career Paths, Why Choose) are implemented in `ProgramDetail.tsx`
- `generateStaticParams` covers all three slugs
- `ProgramsUnder.tsx` imports from `data/programs.ts` — no duplicate data
- Back link uses `/#about` (confirmed: programs section lives inside `<div id="about">` in `About.tsx`)
- `notFound()` handles invalid slugs
- `params` is typed as `Promise<{ slug: string }>` for Next.js 15+ compatibility
