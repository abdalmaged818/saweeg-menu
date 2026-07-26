import type { CategoryId } from "../types/menu";

const categoryIds: CategoryId[] = [
  "talbinah",
  "sweets",
  "boxes",
  "ready",
  "drinks"
];

const isCategoryId = (value: string | undefined): value is CategoryId =>
  categoryIds.includes(value as CategoryId);

export const bindCategoryFilter = (
  root: HTMLElement,
  onSelect: (category: CategoryId) => void
): void => {
  const categoryBar = root.querySelector<HTMLElement>(".category-bar");
  if (!categoryBar) {
    return;
  }

  categoryBar.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const button = target.closest<HTMLButtonElement>("[data-category]");
    if (button && isCategoryId(button.dataset.category)) {
      onSelect(button.dataset.category);
    }
  });

  categoryBar.addEventListener("keydown", (event) => {
    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    const buttons = Array.from(
      categoryBar.querySelectorAll<HTMLButtonElement>("[data-category]")
    );
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex < 0) {
      return;
    }

    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = buttons.length - 1;
    } else {
      const visualDirection =
        document.documentElement.dir === "rtl"
          ? event.key === "ArrowRight"
            ? -1
            : 1
          : event.key === "ArrowRight"
            ? 1
            : -1;
      nextIndex = (currentIndex + visualDirection + buttons.length) % buttons.length;
    }

    const nextButton = buttons[nextIndex];
    nextButton?.focus();
    if (nextButton && isCategoryId(nextButton.dataset.category)) {
      onSelect(nextButton.dataset.category);
    }
  });
};

export const validCategory = (value: string | null): CategoryId | null =>
  value && categoryIds.includes(value as CategoryId)
    ? (value as CategoryId)
    : null;
