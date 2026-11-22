#!/usr/bin/env node
// Full axe-core scan (WCAG 2.0/2.1/2.2 A + AA) of every page at mobile and
// desktop widths, using the locally installed Chrome. Start `npm run preview` first.
// Usage: node scripts/a11y.mjs [baseUrl]
import AxeBuilder from '@axe-core/playwright'
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:4173'
const pages = ['/', '/over-ons', '/koffie', '/koffie/ethiopie-yirgacheffe', '/contact', '/contact/bedankt', '/bestaat-niet']
const viewports = { mobile: { width: 375, height: 812 }, desktop: { width: 1280, height: 800 } }

const browser = await chromium.launch({ channel: 'chrome' })
let violationCount = 0

for (const [device, viewport] of Object.entries(viewports)) {
  const context = await browser.newContext({ viewport, bypassCSP: true })
  const page = await context.newPage()
  for (const path of pages) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
      .analyze()
    violationCount += violations.length
    console.log(`${violations.length ? '✖' : '✔'} ${device.padEnd(7)} ${path}`)
    for (const v of violations) {
      console.log(`    [${v.impact}] ${v.id}: ${v.help}`)
      for (const node of v.nodes.slice(0, 3)) console.log(`      ${node.target.join(' ')}`)
    }
  }
  await context.close()
}

await browser.close()
console.log(violationCount ? `\n${violationCount} violation(s)` : '\nNo axe violations')
process.exit(violationCount ? 1 : 0)
