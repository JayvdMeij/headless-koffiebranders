/**
 * Preload the self-hosted web fonts referenced in the inlined @font-face rules.
 * Without this, the fonts are discovered only after CSS is parsed and the swap
 * from the fallback font shifts the hero heading (measurable CLS on mobile).
 * The site uses two font files, so preloading all of them is cheap.
 */
const FONT_URL = /url\("?(\/_nuxt\/fonts\/[^")]+\.woff2)"?\)/g

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    const urls = new Set<string>()
    for (const chunk of html.head) {
      for (const [, url] of chunk.matchAll(FONT_URL)) urls.add(url!)
    }
    const links = [...urls].map((url) => `<link rel="preload" as="font" type="font/woff2" href="${url}" crossorigin>`)
    html.head.push(links.join(''))
  })
})
