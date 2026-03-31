# Explore Track — Program Detail Pages

**Date:** 2026-03-31
**Status:** Approved

## Overview

When a user clicks "Explore Track" on any of the three program cards in the `ProgramsUnder` section, they navigate to a dedicated page with full program details. Three programs: BSCS, BSIT, ACT.

---

## Architecture

**Pattern:** Dynamic route + data file + `generateStaticParams`

- Route: `app/programs/[slug]/page.tsx`
- Data: `data/programs.ts` — typed array of program objects
- `generateStaticParams` pre-renders all three pages as static HTML at build time
- `ProgramsUnder.tsx` buttons updated to `<Link href="/programs/bscs">` etc.

**No new dependencies required.** Uses existing Next.js, Tailwind, Framer Motion stack.

---

## File Structure

```
app/
  programs/
    [slug]/
      page.tsx          ← dynamic page, reads slug, finds program data
data/
  programs.ts           ← typed program data (new file)
```

---

## Data Structure (`data/programs.ts`)

```ts
export type Program = {
  slug: string;
  short: string;           // e.g. "BSCS"
  title: string;           // e.g. "Computer Science"
  tagline: string;         // short description for hero
  duration: string;        // e.g. "4 Years"
  degree: string;          // e.g. "BS Degree"
  accreditation: string;   // e.g. "CHED"
  overview: string;        // paragraph text
  curriculum: string[];    // list of subject names
  careers: string[];       // list of career paths
  highlights: {
    title: string;
    desc: string;
  }[];                     // "Why Choose" cards (3 items)
};
```

---

## Page Layout

### Back Navigation
- Top bar (not sticky/fixed): charcoal background, "← Back to Degree Programs" link (navigates to `/#about` — confirmed: `ProgramsUnder` lives inside `<div id="about">` in `About.tsx`)

### Hero Section
- Background: gradient from `navy` → `charcoal`, with grid dot pattern overlay (matches existing `ProgramsUnder` style)
- Ghost watermark text (program short name, bottom-right, `opacity: 0.02`)
- Neon pill badge (program short name)
- Program title (large, white, extrabold)
- Tagline (white/60 muted)
- Stats row: Duration · Degree · Accreditation (dark glass cards with neon value text)
- Bottom border: 2px solid `neon`

### Sections Area
- Background: `off-white` (`#F4F4F5`) — matches `ProgramsUnder` section background
- Padding: `16px`, gap `12px` between cards

### Section 1 — Program Overview (full width)
- Dark charcoal card (`bg-charcoal`)
- Neon section label: `PROGRAM OVERVIEW`
- Body text: white/70, relaxed line-height

### Section 2 — Core Curriculum (full width)
- Dark charcoal card
- Neon section label: `CORE CURRICULUM`
- Subjects rendered as pill tags (`bg-charcoal-light`, `border-white/20`, `text-white/80`)

### Section 3 & 4 — Two-column grid (desktop), stacked (mobile)
**Career Paths:**
- Neon label: `CAREER PATHS`
- Each career as a row with `→` neon arrow

**Why Choose This Program?:**
- Neon label: `WHY CHOOSE [SHORT]?`
- 3 highlight cards, left neon border, title + description

### Animations
- Hero: `initial={{ opacity: 0, y: 30 }}` → `animate={{ opacity: 1, y: 0 }}`, `duration: 0.6`
- Each section card: staggered fade-in via `whileInView`, `delay: index * 0.1`

---

## Content

### BSCS — Computer Science

**Tagline:** Master algorithms, software engineering, AI, and advanced computing theories for research and tech leadership.

**Duration:** 4 Years | **Degree:** BS Degree | **Accreditation:** CHED

**Overview:**
The BS Computer Science program equips students with deep theoretical foundations and practical skills in software development, algorithms, and computing systems. Students explore areas ranging from artificial intelligence and machine learning to software engineering and theory of computation. Graduates are prepared for careers in tech leadership, software development, research, or graduate studies.

**Core Curriculum:**
- Data Structures & Algorithms
- Discrete Mathematics
- Object-Oriented Programming
- Computer Architecture & Organization
- Operating Systems
- Database Management Systems
- Software Engineering
- Artificial Intelligence
- Machine Learning
- Theory of Computation
- Programming Languages
- Human-Computer Interaction
- Capstone Project

**Career Paths:**
- Software Engineer
- Data Scientist
- AI / ML Engineer
- Systems Architect
- Research Scientist
- Backend / Full-Stack Developer
- CTO / Tech Lead

**Why Choose BSCS?**
1. **Theory + Practice** — Strong algorithmic foundations for innovation and research
2. **Grad School Ready** — Direct pathway to MS/PhD programs locally and abroad
3. **High Industry Demand** — Top-paying roles at leading tech companies

---

### BSIT — Information Technology

**Tagline:** Develop practical skills in web development, cybersecurity, cloud computing, and enterprise solutions.

**Duration:** 4 Years | **Degree:** BS Degree | **Accreditation:** CHED

**Overview:**
The BS Information Technology program develops industry-ready professionals skilled in deploying, managing, and securing technology systems for businesses. Students gain hands-on experience in web development, network administration, cybersecurity, cloud platforms, and enterprise IT solutions. Graduates are equipped to immediately contribute to organizations across all industries.

**Core Curriculum:**
- Web Systems & Technologies
- Network Administration
- Cybersecurity Fundamentals
- Cloud Computing (AWS / Azure)
- Database Administration
- Systems Integration & Architecture
- IT Project Management
- Enterprise Resource Planning (ERP)
- Information Assurance & Security
- Mobile Application Development
- Technical Documentation
- Capstone Project

**Career Paths:**
- Web Developer / Full-Stack Developer
- IT Manager
- Cybersecurity Analyst
- Cloud Solutions Architect
- Systems Administrator
- DevOps Engineer
- IT Consultant

**Why Choose BSIT?**
1. **Industry-Ready Skills** — Practical curriculum aligned with real-world IT environments
2. **Broad Coverage** — From web dev to cloud to security, all in one program
3. **Fast Career Entry** — High demand for IT professionals across every industry

---

### ACT — Computer Technology

**Tagline:** Two-year intensive program with foundational skills in programming, networking, and hardware.

**Duration:** 2 Years | **Degree:** Associate Degree | **Accreditation:** TESDA / CHED

**Overview:**
The Associate in Computer Technology program is a two-year course providing students with essential skills in computer programming, hardware servicing, networking, and technical support. Designed for students who want to enter the IT workforce quickly or build a strong foundation before pursuing a bachelor's degree, ACT combines practical training with industry-relevant certifications.

**Core Curriculum:**
- Computer Programming Fundamentals
- Computer Hardware Servicing & Troubleshooting
- Network Fundamentals (Cisco NetAcad)
- Web Design & Development Basics
- Office Productivity & Desktop Support
- Technical Support & Help Desk Operations
- Database Fundamentals
- Cybersecurity Awareness

**Career Paths:**
- Computer Technician
- IT Support Specialist / Help Desk Analyst
- Web Designer
- Network Technician
- Desktop Support Engineer
- Junior Developer

**Why Choose ACT?**
1. **Shorter Duration** — Enter the workforce in 2 years with in-demand technical skills
2. **Certification Paths** — Aligned with TESDA NC II and Cisco certifications
3. **Stepping Stone** — Solid foundation for advancing to BSIT or BSCS

---

## ProgramsUnder.tsx Change

The component's local `programs` array is replaced with an import from `data/programs.ts` to avoid duplication. The "Explore Track" button (currently a non-interactive `div`) is updated to a Next.js `<Link>` pointing to `/programs/${prog.slug}`. The display fields used by the card (`short`, `title`, `desc`/`tagline`) must be present on the `Program` type — `tagline` serves as `desc`.

---

## Out of Scope

- No new images or icons required (text + neon accents only)
- No authentication or CMS
- No animations beyond existing Framer Motion patterns already in the site
