import type { BranchId, Language } from "../types/menu";

const pagesBaseUrl = "https://abdalmaged818.github.io/saweeg-menu/";

export const siteConfig = {
  brandName: {
    ar: "سويق",
    en: "Saweeg"
  },
  projectName: "Saweeg Digital Menu",
  logoPath: "assets/brand/logo-saweeg.svg",
  links: {
    onlineStore: "https://saweegsa.com/ar",
    maqsedMap: "https://maps.app.goo.gl/TrhRQ4bykuBKf6bo7?g_st=ipc",
    bustanMap: "https://maps.app.goo.gl/KRxqbYZQBAshEs556?g_st=ic",
    linktree: "https://linktr.ee/saweeg",
    whatsapp: "https://wa.me/+966570052424"
  },
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

export const absoluteAssetUrl = (path: string): string =>
  new URL(path.replace(/^\/+/, ""), siteConfig.githubPagesUrl).toString();

export const branchMapUrl = (branch: BranchId): string =>
  branch === "maqsed"
    ? siteConfig.links.maqsedMap
    : siteConfig.links.bustanMap;

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
