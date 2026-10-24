export type Project = {
  slug: string;
  name: string;
  summary: string;
  stack: string;
  year: string;
  status: "live" | "in progress";
  repo: string;
  url?: string;
  embeddable?: boolean;
  note?: string;
};

export type Channel = {
  label: string;
  handle: string;
  href: string;
  external: boolean;
};

export const site = {
  contactEmail: "hussamraedalraggad@gmail.com",
  handle: "HussamAlraggad",
  github: "https://github.com/HussamAlraggad",
};

export const channels: Channel[] = [
  {
    label: "Email",
    handle: "hussamraedalraggad@gmail.com",
    href: "mailto:hussamraedalraggad@gmail.com",
    external: false,
  },
  {
    label: "GitHub",
    handle: "@HussamAlraggad",
    href: "https://github.com/HussamAlraggad",
    external: true,
  },
  {
    label: "LinkedIn",
    handle: "in/hussam-al-raggad",
    href: "https://www.linkedin.com/in/hussam-al-raggad/",
    external: true,
  },
  {
    label: "Dribbble",
    handle: "@HussamAlraggad",
    href: "https://dribbble.com/HussamAlraggad",
    external: true,
  },
  {
    label: "Behance",
    handle: "@HussamAlraggad",
    href: "https://www.behance.net/HussamAlraggad",
    external: true,
  },
  {
    label: "Instagram",
    handle: "@hussam.alraggad.designs",
    href: "https://www.instagram.com/hussam.alraggad.designs",
    external: true,
  },
];

export const projects: Project[] = [
  {
    slug: "maison-fourrure",
    name: "Maison Fourrure",
    summary:
      "Age-gated luxury boutique prototype: entry, product discovery, and checkout, built for stakeholder review.",
    stack: "TypeScript",
    year: "2026",
    status: "live",
    repo: "https://github.com/HussamAlraggad/fashion_store_v1",
    url: "https://maison-furrure.netlify.app/",
    embeddable: true,
  },
  {
    slug: "os-geeks-hub",
    name: "OS Geeks Hub",
    summary:
      "An operating-system comparison wiki that ends at the source of truth: the project's own docs or ISO download.",
    stack: "Astro",
    year: "2026",
    status: "live",
    repo: "https://github.com/HussamAlraggad/os_geeks_hub_02",
    url: "https://os-geeks-hub.netlify.app/",
    embeddable: false,
    note: "Opens in a new tab. The site blocks embedding, so it cannot run in place here.",
  },
  {
    slug: "school-lms",
    name: "School Learning Platform",
    summary:
      "Bilingual Arabic and English LMS template: role-based dashboards, timed quizzes, homework, and exam schedules.",
    stack: "TypeScript",
    year: "2026",
    status: "live",
    repo: "https://github.com/HussamAlraggad/school_lms_template",
    url: "https://school-lms-template.netlify.app/",
    embeddable: true,
  },
  {
    slug: "mini-wiki",
    name: "mini_wiki 2.0",
    summary:
      "A terminal-based AI research assistant that ingests datasets, ranks by relevance through an agentic loop, and answers in Pandas. Runs entirely local.",
    stack: "Go",
    year: "2026",
    status: "in progress",
    repo: "https://github.com/HussamAlraggad/mini_wiki_2.0",
    note: "No deployment: it is a terminal program, not a web app.",
  },
  {
    slug: "pms",
    name: "Project Management System",
    summary:
      "A project management system in early build. The repository is the honest record at this stage.",
    stack: "—",
    year: "2026",
    status: "in progress",
    repo: "https://github.com/HussamAlraggad/pms_project_management_system_01",
  },
  {
    slug: "men-fashion",
    name: "Men's Fashion Commerce",
    summary:
      "A men's fashion storefront, still in progress. TypeScript, no deployment yet.",
    stack: "TypeScript",
    year: "2026",
    status: "in progress",
    repo: "https://github.com/HussamAlraggad/men_fashion_e_commernce_01",
  },
];
