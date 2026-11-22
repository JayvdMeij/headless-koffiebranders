#!/usr/bin/env node
// Runs Lighthouse (mobile and desktop) against the local preview server and
// prints a score table. Start `npm run preview` first.
// Usage: node scripts/lighthouse.mjs [baseUrl]
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const base = process.argv[2] ?? 'http://localhost:4173'
const pages = ['/', '/over-ons', '/koffie', '/koffie/ethiopie-yirgacheffe', '/contact']
const categories = ['performance', 'accessibility', 'best-practices', 'seo']
const cli = createRequire(import.meta.url).resolve('lighthouse/cli/index.js')

mkdirSync('lighthouse-reports', { recursive: true })
const rows = []

for (const formFactor of ['mobile', 'desktop']) {
  for (const path of pages) {
    const name = `${formFactor}${path === '/' ? '-home' : path.replaceAll('/', '-')}`
    const out = `lighthouse-reports/${name}`
    execFileSync(process.execPath, [
      cli,
      `${base}${path}`,
      `--only-categories=${categories.join(',')}`,
      '--output=json',
      '--output=html',
      `--output-path=${out}`,
      '--chrome-flags=--headless=new',
      '--quiet',
      ...(formFactor === 'desktop' ? ['--preset=desktop'] : []),
    ], { stdio: 'inherit' })
    const report = JSON.parse(readFileSync(`${out}.report.json`, 'utf8'))
    const scores = Object.fromEntries(categories.map((c) => [c, Math.round(report.categories[c].score * 100)]))
    const lcp = report.audits['largest-contentful-paint'].displayValue
    const cls = report.audits['cumulative-layout-shift'].displayValue
    const tbt = report.audits['total-blocking-time'].displayValue
    rows.push({ formFactor, path, ...scores, lcp, cls, tbt })
    console.log(formFactor, path, scores)
  }
}

const table = [
  '| Device | Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map((r) => `| ${r.formFactor} | \`${r.path}\` | ${r.performance} | ${r.accessibility} | ${r['best-practices']} | ${r.seo} | ${r.lcp} | ${r.cls} | ${r.tbt} |`),
].join('\n')

writeFileSync('lighthouse-reports/summary.md', `${table}\n`)
console.log(`\n${table}`)
