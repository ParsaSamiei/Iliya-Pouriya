import type { LandingCopyData } from "@/lib/validation/landing-copy";
import { landingCopySchema } from "@/lib/validation/landing-copy";

export const LANDING_COPY_KEY = "landing_copy";

export const DEFAULT_LANDING_COPY: LandingCopyData = {
  heroNameAEn: "Iliya",
  heroNameAFa: "ایلیا",
  heroNameBEn: "Pouriya",
  heroNameBFa: "پوریا",
  heroTitleEn: "Robotics and embedded systems, built side by side.",
  heroTitleFa: "رباتیک و سیستم‌های نهفته، ساخته‌شده کنار هم.",
  heroSubtitleEn:
    "Two engineers sharing one practice — firmware, control, and hardware that has to hold up in the field.",
  heroSubtitleFa:
    "دو مهندس با یک تمرین مشترک — فریمور، کنترل، و سخت‌افزاری که باید در میدان دوام بیاورد.",
  ctaViewProjectsEn: "View projects",
  ctaViewProjectsFa: "مشاهده پروژه‌ها",
  ctaMeetTeamEn: "Meet the team",
  ctaMeetTeamFa: "آشنایی با تیم",

  teamEyebrowEn: "People",
  teamEyebrowFa: "افراد",
  meetTheTeamEn: "The engineers",
  meetTheTeamFa: "مهندسان",
  meetTheTeamSubtitleEn:
    "Two distinct backgrounds, one shared practice in robotics and embedded systems.",
  meetTheTeamSubtitleFa: "دو پیشینه متمایز، یک تمرین مشترک در رباتیک و سیستم‌های نهفته.",

  projectsEyebrowEn: "Work",
  projectsEyebrowFa: "کارها",
  featuredProjectsEn: "Selected projects",
  featuredProjectsFa: "پروژه‌های منتخب",
  featuredProjectsSubtitleEn:
    "Builds from the lab — hardware, firmware, and control systems in the field.",
  featuredProjectsSubtitleFa:
    "ساخت‌هایی از آزمایشگاه — سخت‌افزار، فریمور، و سیستم‌های کنترل در میدان.",
  viewAllProjectsEn: "View all projects",
  viewAllProjectsFa: "مشاهده همه پروژه‌ها",

  statusBoardEyebrowEn: "Lab · Status",
  statusBoardEyebrowFa: "آزمایشگاه · وضعیت",
  statusBoardTitleEn: "What’s running now",
  statusBoardTitleFa: "الان چه چیزی در حال اجراست",
  statusBoardSubtitleEn: "Active builds, field trials, and systems already shipped.",
  statusBoardSubtitleFa: "ساخت‌های فعال، آزمون میدان، و سیستم‌هایی که تحویل شده‌اند.",
  statusBoardEmptyEn: "Set the board counts in admin settings.",
  statusBoardEmptyFa: "شمارنده‌ها را از پنل مدیریت تنظیم کنید.",
  statusBoardActiveCount: 1,
  statusBoardFieldCount: 0,
  statusBoardCompleteCount: 0,

  capabilitiesEyebrowEn: "Practice",
  capabilitiesEyebrowFa: "حوزه کار",
  capabilitiesTitleEn: "What we work on",
  capabilitiesTitleFa: "روی چه کار می‌کنیم",
  capabilitiesSubtitleEn:
    "From bare-metal firmware to closed-loop control — systems designed to ship and stay running.",
  capabilitiesSubtitleFa:
    "از فریمور bare-metal تا کنترل closed-loop — سیستم‌هایی که تحویل داده شوند و پایدار بمانند.",
  capabilities: [
    {
      titleEn: "Embedded systems",
      titleFa: "سیستم‌های نهفته",
      descEn:
        "Bare-metal and RTOS firmware on MCUs and SoCs — timing-critical, resource-constrained, production-ready.",
      descFa:
        "فریمور bare-metal و RTOS روی MCU و SoC — زمان‌بندی حیاتی، محدودیت منابع، آماده تولید.",
    },
    {
      titleEn: "Robotics & controls",
      titleFa: "رباتیک و کنترل",
      descEn:
        "Kinematics, sensor fusion, and real-time control loops for mobile and manipulator platforms.",
      descFa:
        "سینماتیک، تلفیق سنسور، و حلقه‌های کنترل real-time برای پلتفرم‌های متحرک و مانیپولاتور.",
    },
    {
      titleEn: "Firmware architecture",
      titleFa: "معماری فریمور",
      descEn:
        "Modular drivers, protocol stacks, and OTA-ready codebases built for long maintenance cycles.",
      descFa:
        "درایورهای ماژولار، پشته پروتکل، و کدبیس OTA-ready برای چرخه نگهداری طولانی.",
    },
    {
      titleEn: "Hardware integration",
      titleFa: "یکپارچه‌سازی سخت‌افزار",
      descEn:
        "Schematic-to-PCB bring-up, signal integrity, and tight software–hardware co-design.",
      descFa:
        "راه‌اندازی از شماتیک تا PCB، یکپارچگی سیگنال، و co-design تنگاتنگ نرم‌افزار–سخت‌افزار.",
    },
  ],

  blogEyebrowEn: "Notes",
  blogEyebrowFa: "یادداشت‌ها",
  latestPostsEn: "From the bench",
  latestPostsFa: "از میز کار",
  latestPostsSubtitleEn: "Build logs, design decisions, and lessons learned.",
  latestPostsSubtitleFa: "گزارش ساخت، تصمیم‌های طراحی، و درس‌های آموخته‌شده.",
  viewAllPostsEn: "View all posts",
  viewAllPostsFa: "مشاهده همه نوشته‌ها",

  recommendationsEyebrowEn: "Voices",
  recommendationsEyebrowFa: "صداها",
  recommendationsTitleEn: "What others say",
  recommendationsTitleFa: "دیگران چه می‌گویند",
  recommendationsSubtitleEn:
    "Notes from collaborators, mentors, and people we've built with.",
  recommendationsSubtitleFa:
    "یادداشت‌هایی از همکاران، مربیان، و کسانی که با آن‌ها ساخته‌ایم.",

  clientsEyebrowEn: "Roster",
  clientsEyebrowFa: "فهرست",
  clientsTitleEn: "Who we've worked with",
  clientsTitleFa: "با چه کسانی کار کرده‌ایم",
  clientsSubtitleEn:
    "Labs, teams, and organizations we've shipped hardware and firmware alongside.",
  clientsSubtitleFa:
    "آزمایشگاه‌ها، تیم‌ها و سازمان‌هایی که کنارشان سخت‌افزار و فریمور تحویل داده‌ایم.",

  contactEyebrowEn: "Contact",
  contactEyebrowFa: "تماس",
  contactTitleEn: "Have a project in mind?",
  contactTitleFa: "پروژه‌ای در ذهن دارید؟",
  contactSubtitleEn:
    "Prototype, production firmware, or a robotics platform — tell us what you're building.",
  contactSubtitleFa:
    "نمونه اولیه، فریمور تولیدی، یا پلتفرم رباتیک — بگویید چه می‌سازید.",
  ctaContactEn: "Get in touch",
  ctaContactFa: "تماس با ما",
};

export type LandingCopyView = {
  heroNameA: string;
  heroNameB: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaViewProjects: string;
  ctaMeetTeam: string;
  teamEyebrow: string;
  meetTheTeam: string;
  meetTheTeamSubtitle: string;
  projectsEyebrow: string;
  featuredProjects: string;
  featuredProjectsSubtitle: string;
  viewAllProjects: string;
  statusBoardEyebrow: string;
  statusBoardTitle: string;
  statusBoardSubtitle: string;
  statusBoardEmpty: string;
  statusBoardActiveCount: number;
  statusBoardFieldCount: number;
  statusBoardCompleteCount: number;
  capabilitiesEyebrow: string;
  capabilitiesTitle: string;
  capabilitiesSubtitle: string;
  capabilities: Array<{ title: string; desc: string }>;
  blogEyebrow: string;
  latestPosts: string;
  latestPostsSubtitle: string;
  viewAllPosts: string;
  recommendationsEyebrow: string;
  recommendationsTitle: string;
  recommendationsSubtitle: string;
  clientsEyebrow: string;
  clientsTitle: string;
  clientsSubtitle: string;
  contactEyebrow: string;
  contactTitle: string;
  contactSubtitle: string;
  ctaContact: string;
};

export function parseLandingCopy(value: unknown): LandingCopyData {
  if (!value || typeof value !== "object") return DEFAULT_LANDING_COPY;

  const incoming = value as Partial<LandingCopyData>;
  const merged: LandingCopyData = {
    ...DEFAULT_LANDING_COPY,
    ...incoming,
    capabilities: Array.isArray(incoming.capabilities)
      ? incoming.capabilities
      : DEFAULT_LANDING_COPY.capabilities,
    statusBoardActiveCount: coerceCount(
      incoming.statusBoardActiveCount,
      DEFAULT_LANDING_COPY.statusBoardActiveCount,
    ),
    statusBoardFieldCount: coerceCount(
      incoming.statusBoardFieldCount,
      DEFAULT_LANDING_COPY.statusBoardFieldCount,
    ),
    statusBoardCompleteCount: coerceCount(
      incoming.statusBoardCompleteCount,
      DEFAULT_LANDING_COPY.statusBoardCompleteCount,
    ),
  };

  const result = landingCopySchema.safeParse(merged);
  return result.success ? result.data : DEFAULT_LANDING_COPY;
}

function coerceCount(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.min(9999, Math.trunc(value)));
  }
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return Math.max(0, Math.min(9999, parsed));
  }
  return fallback;
}

export function resolveLandingCopy(data: LandingCopyData, locale: string): LandingCopyView {
  const isFa = locale === "fa";
  return {
    heroNameA: isFa ? data.heroNameAFa : data.heroNameAEn,
    heroNameB: isFa ? data.heroNameBFa : data.heroNameBEn,
    heroTitle: isFa ? data.heroTitleFa : data.heroTitleEn,
    heroSubtitle: isFa ? data.heroSubtitleFa : data.heroSubtitleEn,
    ctaViewProjects: isFa ? data.ctaViewProjectsFa : data.ctaViewProjectsEn,
    ctaMeetTeam: isFa ? data.ctaMeetTeamFa : data.ctaMeetTeamEn,
    teamEyebrow: isFa ? data.teamEyebrowFa : data.teamEyebrowEn,
    meetTheTeam: isFa ? data.meetTheTeamFa : data.meetTheTeamEn,
    meetTheTeamSubtitle: isFa ? data.meetTheTeamSubtitleFa : data.meetTheTeamSubtitleEn,
    projectsEyebrow: isFa ? data.projectsEyebrowFa : data.projectsEyebrowEn,
    featuredProjects: isFa ? data.featuredProjectsFa : data.featuredProjectsEn,
    featuredProjectsSubtitle: isFa
      ? data.featuredProjectsSubtitleFa
      : data.featuredProjectsSubtitleEn,
    viewAllProjects: isFa ? data.viewAllProjectsFa : data.viewAllProjectsEn,
    statusBoardEyebrow: isFa ? data.statusBoardEyebrowFa : data.statusBoardEyebrowEn,
    statusBoardTitle: isFa ? data.statusBoardTitleFa : data.statusBoardTitleEn,
    statusBoardSubtitle: isFa
      ? data.statusBoardSubtitleFa
      : data.statusBoardSubtitleEn,
    statusBoardEmpty: isFa ? data.statusBoardEmptyFa : data.statusBoardEmptyEn,
    statusBoardActiveCount: data.statusBoardActiveCount,
    statusBoardFieldCount: data.statusBoardFieldCount,
    statusBoardCompleteCount: data.statusBoardCompleteCount,
    capabilitiesEyebrow: isFa ? data.capabilitiesEyebrowFa : data.capabilitiesEyebrowEn,
    capabilitiesTitle: isFa ? data.capabilitiesTitleFa : data.capabilitiesTitleEn,
    capabilitiesSubtitle: isFa
      ? data.capabilitiesSubtitleFa
      : data.capabilitiesSubtitleEn,
    capabilities: data.capabilities.map((item) => ({
      title: isFa ? item.titleFa : item.titleEn,
      desc: isFa ? item.descFa : item.descEn,
    })),
    blogEyebrow: isFa ? data.blogEyebrowFa : data.blogEyebrowEn,
    latestPosts: isFa ? data.latestPostsFa : data.latestPostsEn,
    latestPostsSubtitle: isFa ? data.latestPostsSubtitleFa : data.latestPostsSubtitleEn,
    viewAllPosts: isFa ? data.viewAllPostsFa : data.viewAllPostsEn,
    recommendationsEyebrow: isFa
      ? data.recommendationsEyebrowFa
      : data.recommendationsEyebrowEn,
    recommendationsTitle: isFa
      ? data.recommendationsTitleFa
      : data.recommendationsTitleEn,
    recommendationsSubtitle: isFa
      ? data.recommendationsSubtitleFa
      : data.recommendationsSubtitleEn,
    clientsEyebrow: isFa ? data.clientsEyebrowFa : data.clientsEyebrowEn,
    clientsTitle: isFa ? data.clientsTitleFa : data.clientsTitleEn,
    clientsSubtitle: isFa ? data.clientsSubtitleFa : data.clientsSubtitleEn,
    contactEyebrow: isFa ? data.contactEyebrowFa : data.contactEyebrowEn,
    contactTitle: isFa ? data.contactTitleFa : data.contactTitleEn,
    contactSubtitle: isFa ? data.contactSubtitleFa : data.contactSubtitleEn,
    ctaContact: isFa ? data.ctaContactFa : data.ctaContactEn,
  };
}
