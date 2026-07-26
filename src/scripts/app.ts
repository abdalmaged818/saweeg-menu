import { pageUrl } from "../config/site";
import { branches } from "../data/branches";
import { categories } from "../data/categories";
import { products } from "../data/products";
import { getMessages } from "../i18n";
import {
  renderExtras,
  renderMenuPage,
  renderProducts
} from "../templates/menu-page";
import type {
  AppState,
  BranchId,
  CategoryId,
  Language
} from "../types/menu";
import { bindBranchSwitcher } from "./branch-switcher";
import { bindCategoryFilter, validCategory } from "./category-filter";
import { attachImageFallbacks } from "./image-fallback";
import { refreshLanguageLinks } from "./language-switcher";
import { bindMobileMenu } from "./mobile-menu";

const storageKey = "saweeg:selected-branch";

const validBranch = (value: string | null): BranchId | null =>
  value === "maqsed" || value === "bustan" ? value : null;

const getStoredBranch = (): BranchId | null => {
  try {
    return validBranch(localStorage.getItem(storageKey));
  } catch {
    return null;
  }
};

const storeBranch = (branch: BranchId): void => {
  try {
    localStorage.setItem(storageKey, branch);
  } catch {
    // Storage is optional; URL state remains authoritative.
  }
};

const getInitialState = (): AppState => {
  const params = new URLSearchParams(window.location.search);
  const language: Language =
    document.documentElement.lang === "en" ? "en" : "ar";

  return {
    language,
    branch: validBranch(params.get("branch")) ?? getStoredBranch() ?? "maqsed",
    category: validCategory(params.get("category")) ?? "talbinah"
  };
};

const syncUrl = (state: AppState, mode: "push" | "replace"): void => {
  const params = new URLSearchParams(window.location.search);
  params.set("branch", state.branch);
  if (state.category === "talbinah") {
    params.delete("category");
  } else {
    params.set("category", state.category);
  }

  const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  window.history[mode === "push" ? "pushState" : "replaceState"](
    { branch: state.branch, category: state.category },
    "",
    nextUrl
  );
};

const updateStructuredData = (state: AppState): void => {
  const script = document.querySelector<HTMLScriptElement>(
    'script[data-structured-data="menu"]'
  );
  if (!script) {
    return;
  }

  const branch = branches.find((item) => item.id === state.branch);
  const localizedBranch =
    state.language === "ar" ? branch?.nameAr : branch?.nameEn;
  const filteredProducts = products.filter((product) =>
    product.branches.includes(state.branch)
  );
  const nameKey = state.language === "ar" ? "nameAr" : "nameEn";

  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Menu",
    name:
      state.language === "ar"
        ? `منيو سويق - ${localizedBranch ?? ""}`
        : `Saweeg Menu - ${localizedBranch ?? ""}`,
    url: pageUrl(state.language, state.branch, state.category),
    hasMenuSection: categories
      .filter((category) => category.id !== "drinks")
      .map((category) => ({
        "@type": "MenuSection",
        name: category[nameKey],
        hasMenuItem: filteredProducts
          .filter((product) => product.category === category.id)
          .map((product) => ({
            "@type": "MenuItem",
            name: product[nameKey],
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "SAR"
            }
          }))
      }))
  });
};

const updateSeoLinks = (state: AppState): void => {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) {
    canonical.href = pageUrl(state.language, state.branch, state.category);
  }
  document
    .querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')
    .forEach((link) => {
      const language = link.hreflang === "en" ? "en" : "ar";
      link.href = pageUrl(language, state.branch, state.category);
    });
};

export const initializeApp = (): void => {
  const root = document.querySelector<HTMLElement>("#app");
  if (!root) {
    throw new Error("Application root is missing.");
  }

  const state = getInitialState();
  const refs = renderMenuPage(root, state);
  bindMobileMenu(refs.mobileMenuButton, refs.mobileMenu, state.language);

  const refreshSelectionUi = (): void => {
    const messages = getMessages(state.language);
    const selectedBranch = branches.find((branch) => branch.id === state.branch);
    const selectedCategory = categories.find(
      (category) => category.id === state.category
    );

    refs.currentBranch.textContent =
      state.language === "ar"
        ? selectedBranch?.nameAr ?? ""
        : selectedBranch?.nameEn ?? "";
    refs.categoryTitle.textContent =
      state.language === "ar"
        ? selectedCategory?.nameAr ?? ""
        : selectedCategory?.nameEn ?? "";

    root.querySelectorAll<HTMLElement>("[data-branch]").forEach((control) => {
      const active = control.dataset.branch === state.branch;
      control.classList.toggle("is-active", active);
      control.setAttribute("aria-pressed", String(active));
      const label = control.textContent?.trim() ?? "";
      control.setAttribute(
        "aria-label",
        active ? `${label}، ${messages.branchActive}` : label
      );
    });

    root.querySelectorAll<HTMLButtonElement>("[data-category]").forEach((button) => {
      const active = button.dataset.category === state.category;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
      const label = button.textContent?.trim() ?? "";
      button.setAttribute(
        "aria-label",
        active ? `${label}، ${messages.categoryActive}` : label
      );
    });

    refs.productSection.hidden = state.category === "drinks";
    refreshLanguageLinks(root, state);
    updateStructuredData(state);
    updateSeoLinks(state);
  };

  const refreshContent = (): void => {
    if (state.category !== "drinks") {
      renderProducts(refs.productGrid, state);
      attachImageFallbacks(refs.productGrid);
    }
    renderExtras(refs.extrasList, state);
    refreshSelectionUi();
  };

  const changeBranch = (branch: BranchId): void => {
    if (state.branch === branch) {
      return;
    }
    state.branch = branch;
    storeBranch(branch);
    syncUrl(state, "push");
    refreshContent();
  };

  const changeCategory = (category: CategoryId): void => {
    if (state.category === category) {
      const target =
        category === "drinks" ? refs.extrasSection : refs.productSection;
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    state.category = category;
    syncUrl(state, "push");
    refreshContent();
    const target = category === "drinks" ? refs.extrasSection : refs.productSection;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  bindBranchSwitcher(root, changeBranch);
  bindCategoryFilter(root, changeCategory);

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    state.branch = validBranch(params.get("branch")) ?? "maqsed";
    state.category = validCategory(params.get("category")) ?? "talbinah";
    refreshContent();
  });

  syncUrl(state, "replace");
  refreshSelectionUi();
  attachImageFallbacks(root);
};
