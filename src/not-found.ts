import "./styles/main.css";

const homeLink = document.querySelector<HTMLAnchorElement>("[data-home-link]");
if (homeLink) {
  homeLink.href = import.meta.env.BASE_URL;
}
