import type { BranchId, Language } from "../types/menu";

const pagesBaseUrl = "https://abdalmaged818.github.io/saweeg-menu/";

export const siteConfig = {
  brandName: {
    ar: "سويق",
    en: "Saweeg"
  },
  projectName: "Saweeg Digital Menu",
  storeUrl: "https://saweegsa.com/ar",
  logoPath: "assets/brand/logo-saweeg.webp",
  repositoryUrl: "https://github.com/abdalmaged818/saweeg-menu",
  githubPagesUrl: pagesBaseUrl,
  copyrightName: {
    ar: "سويق",
    en: "Saweeg"
  },
  languages: {
    default: "ar" as Language,
    supported: ["ar", "en"] as const
  },
  branches: {
    maqsed: {
      ar: "فرع المقصد",
      en: "Al-Maqsad Branch"
    },
    bustan: {
      ar: "فرع بستان المستظل",
      en: "Bustan Al-Mustazal Branch"
    }
  } satisfies Record<BranchId, Record<Language, string>>
} as const;

export const assetUrl = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export const pageUrl = (
  language: Language,
  branch?: BranchId,
  category?: string
): string => {
  const languagePath = language === "en" ? "en/" : "";
  const url = new URL(`${languagePath}`, siteConfig.githubPagesUrl);

  if (branch) {
    url.searchParams.set("branch", branch);
  }

  if (category && category !== "talbinah") {
    url.searchParams.set("category", category);
  }

  return url.toString();
};
