import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const redirectModule = { exports: {} };
runInNewContext(
  readFileSync(new URL("../site/redirect.js", import.meta.url), "utf8"),
  { module: redirectModule, URL }
);
const { legacyTargetFor } = redirectModule.exports;

test("Arabic root preserves branch, other query parameters, and fragment", () => {
  assert.equal(
    legacyTargetFor("https://menu.saweegsa.com/?branch=maqsed&utm_source=qr#extras"),
    "https://go.saweegsa.com/menu/?branch=maqsed&utm_source=qr#extras"
  );
});

test("English root preserves branch, other query parameters, and fragment", () => {
  assert.equal(
    legacyTargetFor("https://menu.saweegsa.com/en/?branch=bustan&campaign=summer#branches"),
    "https://go.saweegsa.com/menu/en/?branch=bustan&campaign=summer#branches"
  );
});

test("unknown Arabic and English paths fall back to the matching menu locale", () => {
  assert.equal(
    legacyTargetFor("https://menu.saweegsa.com/old/path?branch=bustan"),
    "https://go.saweegsa.com/menu/?branch=bustan"
  );
  assert.equal(
    legacyTargetFor("https://menu.saweegsa.com/en/old/path?branch=maqsed"),
    "https://go.saweegsa.com/menu/en/?branch=maqsed"
  );
});

test("every redirect page runs the preserving script before meta refresh", () => {
  for (const relative of ["../site/index.html", "../site/en/index.html", "../site/404.html"]) {
    const html = readFileSync(new URL(relative, import.meta.url), "utf8");
    const scriptPosition = html.indexOf('<script src="/redirect.js"></script>');
    const fallbackPosition = html.indexOf('http-equiv="refresh"');
    assert.ok(scriptPosition >= 0, `${relative} is missing redirect.js`);
    assert.ok(fallbackPosition > scriptPosition, `${relative} refreshes before redirect.js runs`);
  }
});
