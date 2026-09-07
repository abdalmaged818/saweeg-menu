(function initializeLegacyRedirect(browserWindow) {
  const unifiedMenuOrigin = "https://go.saweegsa.com";

  const legacyTargetFor = (legacyUrl) => {
    const source = new URL(legacyUrl);
    const pathSegments = source.pathname.split("/").filter(Boolean);
    const languagePath = pathSegments[0]?.toLowerCase() === "en" ? "en/" : "";
    const destination = new URL(`/menu/${languagePath}`, unifiedMenuOrigin);
    destination.search = source.search;
    destination.hash = source.hash;
    return destination.toString();
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { legacyTargetFor };
  }

  if (browserWindow) {
    browserWindow.location.replace(legacyTargetFor(browserWindow.location.href));
  }
})(typeof window === "undefined" ? null : window);
