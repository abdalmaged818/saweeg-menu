import {
  assetUrl,
  branchMapUrl,
  siteConfig
} from "../config/site";
import { branches } from "../data/branches";
import { categories } from "../data/categories";
import { extras } from "../data/extras";
import { products } from "../data/products";
import { getMessages } from "../i18n";
import type {
  AppState,
  Branch,
  Category,
  Extra,
  Language,
  Product
} from "../types/menu";

export interface MenuPageRefs {
  root: HTMLElement;
  productSection: HTMLElement;
  productGrid: HTMLElement;
  extrasSection: HTMLElement;
  extrasList: HTMLElement;
  currentBranch: HTMLElement;
  categoryTitle: HTMLElement;
  mobileMenu: HTMLElement;
  mobileMenuButton: HTMLButtonElement;
}

const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
};

const localName = (
  item: { nameAr: string; nameEn: string },
  language: Language
): string => (language === "ar" ? item.nameAr : item.nameEn);

const secondaryName = (
  item: { nameAr: string; nameEn: string },
  language: Language
): string => (language === "ar" ? item.nameEn : item.nameAr);

const appHref = (
  language: Language,
  branch: AppState["branch"],
  category: AppState["category"]
): string => {
  const languagePath = language === "en" ? "en/" : "";
  const query = new URLSearchParams({ branch });
  if (category !== "talbinah") {
    query.set("category", category);
  }
  return `${import.meta.env.BASE_URL}${languagePath}?${query.toString()}`;
};

const createBrand = (
  language: Language,
  branch: AppState["branch"],
  category: AppState["category"],
  compact = false
): HTMLAnchorElement => {
  const brand = createElement("a", compact ? "brand brand--compact" : "brand");
  brand.href = appHref(language, branch, category);
  brand.setAttribute(
    "aria-label",
    language === "ar" ? "العودة إلى منيو سويق" : "Back to Saweeg menu"
  );
  brand.dataset.brandLink = "";

  const mark = createElement("span", "brand__mark");
  const fallback = createElement(
    "span",
    "brand__fallback",
    siteConfig.brandName[language]
  );
  const image = createElement("img", "brand__image");
  image.src = assetUrl(siteConfig.logoPath);
  image.alt = language === "ar" ? "شعار سويق" : "Saweeg logo";
  image.width = compact ? 60 : 56;
  image.height = compact ? 60 : 56;
  image.decoding = "async";
  image.dataset.fallbackKind = "logo";

  mark.append(fallback, image);
  brand.append(mark);
  return brand;
};

const createHeader = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const header = createElement("header", "site-header");
  const shell = createElement("div", "header-shell container");

  shell.append(createBrand(state.language, state.branch, state.category));

  const nav = createElement("nav", "desktop-nav");
  nav.setAttribute("aria-label", messages.navLabel);

  const menuLink = createElement("a", "nav-link", messages.menu);
  menuLink.href = "#menu-products";
  const branchesLink = createElement("a", "nav-link", messages.branches);
  branchesLink.href = "#branches";
  const storeLink = createElement("a", "nav-link", messages.store);
  storeLink.href = siteConfig.links.onlineStore;
  storeLink.target = "_blank";
  storeLink.rel = "noopener noreferrer";
  const languageLink = createElement("a", "language-link", messages.language);
  languageLink.href = appHref(
    state.language === "ar" ? "en" : "ar",
    state.branch,
    state.category
  );
  languageLink.dataset.languageLink = "";
  nav.append(menuLink, branchesLink, storeLink, languageLink);

  const mobileActions = createElement("div", "mobile-actions");
  const mobileStore = createElement(
    "a",
    "mobile-action mobile-action--store",
    state.language === "ar" ? "المتجر" : "Store"
  );
  mobileStore.href = siteConfig.links.onlineStore;
  mobileStore.target = "_blank";
  mobileStore.rel = "noopener noreferrer";
  const mobileLanguage = createElement(
    "a",
    "mobile-action",
    state.language === "ar" ? "EN" : "ع"
  );
  mobileLanguage.href = languageLink.href;
  mobileLanguage.dataset.languageLink = "";

  const menuButton = createElement(
    "button",
    "mobile-menu-button"
  ) as HTMLButtonElement;
  menuButton.type = "button";
  menuButton.setAttribute("aria-label", messages.mobileMenuOpen);
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-controls", "mobile-menu");
  menuButton.dataset.mobileMenuButton = "";
  const menuIcon = createElement("span", "mobile-menu-button__icon");
  menuIcon.setAttribute("aria-hidden", "true");
  menuIcon.append(
    createElement("span"),
    createElement("span"),
    createElement("span")
  );
  menuButton.append(menuIcon);
  mobileActions.append(mobileStore, mobileLanguage, menuButton);

  shell.append(nav, mobileActions);
  header.append(shell);
  return header;
};

const createMobileMenu = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const menu = createElement("div", "mobile-menu container");
  menu.id = "mobile-menu";
  menu.hidden = true;
  menu.dataset.mobileMenu = "";

  const card = createElement("nav", "mobile-menu__card");
  card.setAttribute("aria-label", messages.navLabel);
  const mobileBrand = createBrand(
    state.language,
    state.branch,
    state.category,
    true
  );
  mobileBrand.classList.add("mobile-menu__brand");
  const menuLink = createElement("a", "mobile-menu__link", messages.menu);
  menuLink.href = "#menu-products";
  const branchesLink = createElement(
    "a",
    "mobile-menu__link",
    messages.branches
  );
  branchesLink.href = "#branches";
  const storeLink = createElement(
    "a",
    "mobile-menu__link",
    messages.store
  );
  storeLink.href = siteConfig.links.onlineStore;
  storeLink.target = "_blank";
  storeLink.rel = "noopener noreferrer";
  const whatsappLink = createElement(
    "a",
    "mobile-menu__link",
    messages.contactWhatsapp
  );
  whatsappLink.href = siteConfig.links.whatsapp;
  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
  const linktreeLink = createElement(
    "a",
    "mobile-menu__link",
    messages.saweegLinks
  );
  linktreeLink.href = siteConfig.links.linktree;
  linktreeLink.target = "_blank";
  linktreeLink.rel = "noopener noreferrer";
  const languageLink = createElement(
    "a",
    "mobile-menu__link",
    messages.language
  );
  languageLink.href = appHref(
    state.language === "ar" ? "en" : "ar",
    state.branch,
    state.category
  );
  languageLink.dataset.languageLink = "";
  card.append(
    mobileBrand,
    menuLink,
    branchesLink,
    storeLink,
    whatsappLink,
    linktreeLink,
    languageLink
  );
  menu.append(card);
  return menu;
};

const createHero = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "hero");
  const inner = createElement("div", "hero__inner container");
  const content = createElement("div", "hero__content");
  const eyebrow = createElement("p", "eyebrow", messages.heroEyebrow);
  const title = createElement("h1", "hero__title", messages.heroTitle);
  const body = createElement("p", "hero__body", messages.heroBody);
  const button = createElement(
    "a",
    "button button--primary",
    messages.chooseBranch
  );
  button.href = "#branches";
  content.append(eyebrow, title, body, button);

  const motif = createElement("div", "hero__motif");
  const logoFrame = createElement("div", "hero__logo-frame");
  logoFrame.dataset.logoFrame = "";
  const logoFallback = createElement(
    "span",
    "hero__logo-fallback",
    siteConfig.brandName[state.language]
  );
  const logo = createElement("img", "hero__logo");
  logo.src = assetUrl(siteConfig.logoPath);
  logo.alt = state.language === "ar" ? "شعار سويق" : "Saweeg logo";
  logo.width = 240;
  logo.height = 240;
  logo.decoding = "async";
  logo.dataset.fallbackKind = "logo";
  logoFrame.append(logoFallback, logo);
  motif.append(logoFrame);
  inner.append(content, motif);
  section.append(inner);
  return section;
};

const createBranchButton = (
  branch: Branch,
  state: AppState
): HTMLButtonElement => {
  const messages = getMessages(state.language);
  const button = createElement(
    "button",
    "branch-option",
    localName(branch, state.language)
  ) as HTMLButtonElement;
  button.type = "button";
  button.dataset.branch = branch.id;
  button.setAttribute("aria-pressed", String(state.branch === branch.id));
  if (state.branch === branch.id) {
    button.classList.add("is-active");
    button.setAttribute("aria-label", `${localName(branch, state.language)}، ${messages.branchActive}`);
  }
  return button;
};

const createBranchSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "branch-section section");
  section.id = "branches";
  const inner = createElement("div", "container branch-section__inner");
  const copy = createElement("div", "section-heading");
  copy.append(
    createElement("p", "eyebrow", messages.branchSectionEyebrow),
    createElement("h2", "section-title", messages.branchSectionTitle),
    createElement("p", "section-copy", messages.branchSectionBody)
  );
  const controls = createElement("div", "branch-controls");
  const selector = createElement("div", "branch-selector");
  selector.setAttribute("role", "group");
  selector.setAttribute("aria-label", messages.branchSelectorLabel);
  branches.forEach((branch) => selector.append(createBranchButton(branch, state)));
  const locationLink = createElement(
    "a",
    "button button--secondary branch-location-link",
    messages.openBranchLocation
  );
  locationLink.href = branchMapUrl(state.branch);
  locationLink.target = "_blank";
  locationLink.rel = "noopener noreferrer";
  locationLink.dataset.activeBranchMap = "";
  const selectedBranch = branches.find((branch) => branch.id === state.branch);
  locationLink.setAttribute(
    "aria-label",
    messages.branchMapLabel(
      selectedBranch ? localName(selectedBranch, state.language) : ""
    )
  );
  controls.append(selector, locationLink);
  inner.append(copy, controls);
  section.append(inner);
  return section;
};

const createCategoryButton = (
  category: Category,
  state: AppState
): HTMLButtonElement => {
  const messages = getMessages(state.language);
  const button = createElement(
    "button",
    "category-pill",
    localName(category, state.language)
  ) as HTMLButtonElement;
  button.type = "button";
  button.dataset.category = category.id;
  button.setAttribute("aria-pressed", String(state.category === category.id));
  if (state.category === category.id) {
    button.classList.add("is-active");
    button.setAttribute(
      "aria-label",
      `${localName(category, state.language)}، ${messages.categoryActive}`
    );
  }
  return button;
};

const createCategoryBar = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const wrapper = createElement("div", "category-sticky");
  const nav = createElement("nav", "category-bar container");
  nav.setAttribute("aria-label", messages.categoriesLabel);
  categories.forEach((category) => nav.append(createCategoryButton(category, state)));
  wrapper.append(nav);
  return wrapper;
};

const createMenuSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "menu-section section");
  section.id = "menu-products";
  section.dataset.productSection = "";
  const inner = createElement("div", "container");
  const headingRow = createElement("div", "menu-heading");
  const copy = createElement("div", "section-heading");
  copy.append(
    createElement("p", "eyebrow", messages.currentBranch),
    createElement("h2", "section-title", messages.menuSectionTitle),
    createElement("p", "section-copy", messages.menuSectionBody)
  );
  const currentBranch = createElement("p", "current-branch");
  currentBranch.dataset.currentBranch = "";
  const branch = branches.find((item) => item.id === state.branch);
  currentBranch.textContent = branch ? localName(branch, state.language) : "";
  headingRow.append(copy, currentBranch);
  const categoryTitle = createElement("h3", "category-title");
  categoryTitle.dataset.categoryTitle = "";
  const selectedCategory = categories.find((item) => item.id === state.category);
  categoryTitle.textContent = selectedCategory
    ? localName(selectedCategory, state.language)
    : "";
  const grid = createElement("div", "product-grid");
  grid.dataset.productGrid = "";
  inner.append(headingRow, categoryTitle, grid);
  section.append(inner);
  return section;
};

const createExtrasSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "extras-section section");
  section.id = "extras";
  section.dataset.extrasSection = "";
  const inner = createElement("div", "container extras-section__inner");
  const copy = createElement("div", "section-heading");
  copy.append(
    createElement("p", "eyebrow", messages.currentBranch),
    createElement("h2", "section-title", messages.extrasTitle),
    createElement("p", "section-copy", messages.extrasBody)
  );
  const list = createElement("div", "extras-card");
  list.dataset.extrasList = "";
  inner.append(copy, list);
  section.append(inner);
  return section;
};

const createStoreSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "store-section section");
  const inner = createElement("div", "store-card container");
  const copy = createElement("div", "store-card__copy");
  copy.append(
    createElement("p", "eyebrow eyebrow--light", messages.storeEyebrow),
    createElement("h2", "store-card__title", messages.storeTitle),
    createElement("p", "store-card__body", messages.storeBody)
  );
  const button = createElement(
    "a",
    "button button--light",
    messages.storeButton
  );
  button.href = siteConfig.links.onlineStore;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  inner.append(copy, button);
  section.append(inner);
  return section;
};

const createBranchLocationsSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "locations-section section");
  section.setAttribute("aria-labelledby", "branch-locations-title");
  const inner = createElement("div", "container");
  const title = createElement(
    "h2",
    "section-title locations-section__title",
    messages.branchLocationsTitle
  );
  title.id = "branch-locations-title";
  const grid = createElement("div", "location-grid");

  branches.forEach((branch) => {
    const card = createElement("article", "location-card");
    const name = localName(branch, state.language);
    const heading = createElement("h3", "location-card__title", name);
    const link = createElement(
      "a",
      "button button--secondary location-card__link",
      messages.openBranchLocation
    );
    link.href = branchMapUrl(branch.id);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", messages.branchMapLabel(name));
    card.append(heading, link);
    grid.append(card);
  });

  inner.append(title, grid);
  section.append(inner);
  return section;
};

const createContactSection = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const section = createElement("section", "contact-section section");
  const card = createElement("div", "contact-card container");
  const copy = createElement("div", "contact-card__copy");
  copy.append(
    createElement("h2", "section-title", messages.contactTitle),
    createElement("p", "section-copy", messages.contactBody)
  );
  const actions = createElement("div", "contact-card__actions");

  const links = [
    {
      label: messages.contactStoreButton,
      href: siteConfig.links.onlineStore,
      className: "button button--primary"
    },
    {
      label: messages.contactWhatsappButton,
      href: siteConfig.links.whatsapp,
      className: "button button--secondary"
    },
    {
      label: messages.contactLinktreeButton,
      href: siteConfig.links.linktree,
      className: "button button--text"
    }
  ];

  links.forEach(({ label, href, className }) => {
    const link = createElement("a", className, label);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    actions.append(link);
  });

  card.append(copy, actions);
  section.append(card);
  return section;
};

const createFooter = (state: AppState): HTMLElement => {
  const messages = getMessages(state.language);
  const footer = createElement("footer", "site-footer");
  const inner = createElement("div", "container footer-grid");
  const brandColumn = createElement("div", "footer-brand");
  brandColumn.append(
    createBrand(state.language, state.branch, state.category, true),
    createElement("p", "footer-tagline", messages.footerTagline)
  );

  const nav = createElement("nav", "footer-nav");
  nav.setAttribute(
    "aria-label",
    state.language === "ar" ? "روابط التذييل" : "Footer links"
  );
  branches.forEach((branch) => {
    const link = createElement(
      "a",
      "footer-link",
      localName(branch, state.language)
    );
    link.href = appHref(state.language, branch.id, state.category);
    link.dataset.branch = branch.id;
    nav.append(link);
  });
  const store = createElement("a", "footer-link", messages.store);
  store.href = siteConfig.links.onlineStore;
  store.target = "_blank";
  store.rel = "noopener noreferrer";
  const whatsapp = createElement(
    "a",
    "footer-link",
    messages.contactWhatsapp
  );
  whatsapp.href = siteConfig.links.whatsapp;
  whatsapp.target = "_blank";
  whatsapp.rel = "noopener noreferrer";
  const linktree = createElement("a", "footer-link", messages.saweegLinks);
  linktree.href = siteConfig.links.linktree;
  linktree.target = "_blank";
  linktree.rel = "noopener noreferrer";
  const language = createElement("a", "footer-link", messages.language);
  language.href = appHref(
    state.language === "ar" ? "en" : "ar",
    state.branch,
    state.category
  );
  language.dataset.languageLink = "";
  nav.append(store, whatsapp, linktree, language);

  const copyright = createElement(
    "p",
    "copyright",
    `© ${new Date().getFullYear()} ${siteConfig.copyrightName[state.language]}. ${messages.copyright}`
  );
  inner.append(brandColumn, nav, copyright);
  footer.append(inner);
  return footer;
};

const createProductCard = (
  product: Product,
  language: Language
): HTMLElement => {
  const messages = getMessages(language);
  const article = createElement("article", "product-card");
  const media = createElement("div", "product-card__media");
  const decorative = createElement("span", "product-card__fallback");
  decorative.setAttribute("aria-hidden", "true");
  const image = createElement("img", "product-card__image");
  const name = localName(product, language);
  image.src = assetUrl(`assets/products/${product.image}`);
  image.alt = messages.productImageAlt(name);
  image.width = 560;
  image.height = 560;
  image.loading = "lazy";
  image.decoding = "async";
  image.dataset.fallbackKind = "product";
  image.style.objectFit = product.imageFit ?? "cover";
  image.style.objectPosition = product.imagePosition ?? "center";
  media.append(decorative, image);

  const content = createElement("div", "product-card__content");
  const names = createElement("div", "product-card__names");
  names.append(
    createElement("h3", "product-card__name", name),
    createElement("p", "product-card__secondary", secondaryName(product, language))
  );
  const price = createElement(
    "p",
    "product-card__price",
    messages.priceLabel(product.price)
  );
  content.append(names, price);
  article.append(media, content);
  return article;
};

const createExtraRow = (extra: Extra, language: Language): HTMLElement => {
  const messages = getMessages(language);
  const row = createElement("div", "extra-row");
  const names = createElement("div", "extra-row__names");
  names.append(
    createElement("h3", "extra-row__name", localName(extra, language)),
    createElement("p", "extra-row__secondary", secondaryName(extra, language))
  );
  const meta = createElement("div", "extra-row__meta");
  const quantity = language === "ar" ? extra.quantityAr : extra.quantityEn;
  if (quantity) {
    meta.append(
      createElement("span", "extra-row__quantity", `${messages.quantity}: ${quantity}`)
    );
  }
  meta.append(
    createElement("span", "extra-row__price", messages.priceLabel(extra.price))
  );
  row.append(names, meta);
  return row;
};

export const renderProducts = (
  container: HTMLElement,
  state: AppState
): void => {
  const fragment = document.createDocumentFragment();
  products
    .filter(
      (product) =>
        product.branches.includes(state.branch) &&
        product.category === state.category
    )
    .forEach((product) => fragment.append(createProductCard(product, state.language)));
  container.replaceChildren(fragment);
};

export const renderExtras = (
  container: HTMLElement,
  state: AppState
): void => {
  const fragment = document.createDocumentFragment();
  extras
    .filter((extra) => extra.branches.includes(state.branch))
    .forEach((extra) => fragment.append(createExtraRow(extra, state.language)));
  container.replaceChildren(fragment);
};

export const renderMenuPage = (
  root: HTMLElement,
  state: AppState
): MenuPageRefs => {
  const messages = getMessages(state.language);
  const skipLink = createElement("a", "skip-link", messages.skipToContent);
  skipLink.href = "#main-content";
  const header = createHeader(state);
  const mobileMenu = createMobileMenu(state);
  const main = createElement("main");
  main.id = "main-content";
  const menuSection = createMenuSection(state);
  const extrasSection = createExtrasSection(state);
  main.append(
    createHero(state),
    createBranchSection(state),
    createCategoryBar(state),
    menuSection,
    extrasSection,
    createBranchLocationsSection(state),
    createStoreSection(state),
    createContactSection(state)
  );
  const page = createElement("div", "site");
  page.append(skipLink, header, mobileMenu, main, createFooter(state));
  root.replaceChildren(page);

  const productGrid = root.querySelector<HTMLElement>("[data-product-grid]");
  const extrasList = root.querySelector<HTMLElement>("[data-extras-list]");
  const currentBranch = root.querySelector<HTMLElement>("[data-current-branch]");
  const categoryTitle = root.querySelector<HTMLElement>("[data-category-title]");
  const mobileMenuButton =
    root.querySelector<HTMLButtonElement>("[data-mobile-menu-button]");

  if (
    !productGrid ||
    !extrasList ||
    !currentBranch ||
    !categoryTitle ||
    !mobileMenuButton
  ) {
    throw new Error("Menu page could not be initialized.");
  }

  renderProducts(productGrid, state);
  renderExtras(extrasList, state);

  return {
    root,
    productSection: menuSection,
    productGrid,
    extrasSection,
    extrasList,
    currentBranch,
    categoryTitle,
    mobileMenu,
    mobileMenuButton
  };
};

export const updateMenuLinks = (root: HTMLElement, state: AppState): void => {
  root.querySelectorAll<HTMLAnchorElement>("[data-language-link]").forEach((link) => {
    link.href = appHref(
      state.language === "ar" ? "en" : "ar",
      state.branch,
      state.category
    );
  });
  root.querySelectorAll<HTMLAnchorElement>("[data-brand-link]").forEach((link) => {
    link.href = appHref(state.language, state.branch, state.category);
  });
  root.querySelectorAll<HTMLAnchorElement>("a[data-branch]").forEach((link) => {
    const branch = link.dataset.branch;
    if (branch === "maqsed" || branch === "bustan") {
      link.href = appHref(state.language, branch, state.category);
    }
  });
};
