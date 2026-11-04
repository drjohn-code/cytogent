#!/usr/bin/env node
/**
 * IndexNow: tell Bing (and Yandex, Seznam, Naver, Yep) which URLs changed. Google does not use IndexNow.
 * The key is public by design: it only proves we own the host, via public/<key>.txt.
 *
 *   npm run indexnow                      every URL in the live sitemap
 *   npm run indexnow -- /about /platform  only these paths
 *
 * Run it after a deploy is live. Bing's own guidance: submit changed URLs, not the whole site on every deploy.
 */
const HOST = "cytogent.com";
const KEY = "e76aa3197520612fc67d16e72c086e68";
const ORIGIN = `https://${HOST}`;
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;

async function sitemapUrls() {
  const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const paths = process.argv.slice(2);
const urlList = paths.length ? paths.map((p) => new URL(p, ORIGIN).href) : await sitemapUrls();
if (!urlList.length) throw new Error("No URLs to submit.");

const live = await fetch(KEY_LOCATION);
if (!live.ok || (await live.text()).trim() !== KEY) {
  throw new Error(`Key file is not live at ${KEY_LOCATION} (status ${live.status}). Deploy first.`);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
});
// 200 = received, 202 = received and key validation pending. Anything else is a failure.
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URL(s)`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
