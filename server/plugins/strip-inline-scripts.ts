/**
 * The site ships no client JavaScript (features.noScripts). Some modules still
 * inject small inline bootstrap scripts (e.g. window.__NUXT_SITE_CONFIG__) that
 * are useless without the Nuxt runtime. Remove them so the HTML contains no
 * executable script at all and the CSP can use script-src 'none'.
 * JSON-LD data blocks are kept.
 */
const EXECUTABLE_SCRIPT = /<script(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/g

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    for (const key of ['head', 'bodyPrepend', 'body', 'bodyAppend'] as const) {
      html[key] = html[key].map((chunk) => chunk.replace(EXECUTABLE_SCRIPT, ''))
    }
  })
})
