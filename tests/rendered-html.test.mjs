import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Kouponly Kerala app", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Kouponly — Good plans, better prices<\/title>/i);
  assert.match(html, /Good plans\./);
  assert.match(html, /Made for Kerala/);
  assert.match(html, /Open account menu/);
  assert.match(html, /Search deals, events, skills or jobs/);
  assert.match(html, /Today I want to…/);
  assert.match(html, /Browse categories/);
  assert.match(html, /Show IndiGo offer/);
  assert.doesNotMatch(html, /\bDoha\b|\bQAR\b/);
});

test("keeps the full discovery and redemption system in source", async () => {
  const [page, layout, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const heroSlides = \[/);
  assert.equal((page.match(/kicker: "/g) ?? []).length, 10);
  assert.match(page, /Everything, one search\./);
  assert.match(page, /"Highest offer"/);
  assert.match(page, /function MapView/);
  assert.match(page, /Hand this phone to the partner/);
  assert.match(page, /const placeholderPartners/);
  assert.match(page, /Pick your Kouponly path/);
  assert.doesNotMatch(page, /â‚¹2\.4k saved/);
  assert.match(page, /Your code will stay active for 10 minutes/);
  assert.match(page, /Kouponly Campus Ambassador/);
  assert.match(page, /YOU&amp;apos;RE AN APPROVED CREATOR|YOU&apos;RE AN APPROVED CREATOR/);
  assert.match(page, /function AccountPage/);
  assert.match(layout, /Kouponly/);
  assert.match(css, /--lime:\s*#c5ff3d/i);
  assert.match(css, /\.account-drawer/);
  assert.match(css, /\.search-redesign/);
});

test("keeps every major interaction family connected to a real flow", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /function dialogForMessage/);
  assert.match(page, /function UtilityDialog/);
  assert.match(page, /profileDraft/);
  assert.match(page, /giftComposer/);
  assert.match(page, /settingPicker/);
  assert.match(page, /openFaq/);
  assert.match(page, /openLegal/);
  assert.match(page, /selectedCampaignId/);
  assert.match(page, /roleApplicationOpen/);
  assert.match(page, /destination: "rewards"/);
  assert.match(page, /profileRewardsOpen/);
  assert.match(page, /navigator\.share/);
  assert.match(page, /tel:\+914844002400/);
  assert.match(page, /collection\.findIndex/);
  assert.match(page, /Math\.min\(3/);
  assert.match(page, /\$\{remaining\}\/3 remaining/);
  assert.match(css, /\.profile-hero::after \{ pointer-events: none; \}/);
  assert.match(css, /\.help-actions > a/);
  assert.match(css, /\.saved-card-main/);
});
