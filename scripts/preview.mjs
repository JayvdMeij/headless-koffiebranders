#!/usr/bin/env node
// Serves the generated site like Netlify would, for local audits:
// clean URLs, 404.html, Brotli/gzip compression and the headers from _headers.
// Usage: node scripts/preview.mjs [port]
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { brotliCompressSync, gzipSync } from 'node:zlib'

const root = '.output/public'
const port = Number(process.argv[2] ?? 4173)

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
}
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg'])

// Minimal _headers parser: path pattern lines followed by indented "Name: value" lines
async function loadHeaderRules() {
  const rules = []
  const text = await readFile(join(root, '_headers'), 'utf8').catch(() => '')
  let current
  for (const line of text.split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    if (!/^\s/.test(line)) {
      current = { pattern: line.trim(), headers: {} }
      rules.push(current)
    }
    else if (current) {
      const i = line.indexOf(':')
      current.headers[line.slice(0, i).trim()] = line.slice(i + 1).trim()
    }
  }
  return rules
}

const matches = (pattern, path) =>
  pattern.endsWith('*') ? path.startsWith(pattern.slice(0, -1)) : path === pattern

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, '')
  for (const candidate of [clean, join(clean, 'index.html'), `${clean}.html`]) {
    const file = join(root, candidate)
    const info = await stat(file).catch(() => null)
    if (info?.isFile()) return file
  }
  return null
}

const rules = await loadHeaderRules()

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? '/', 'http://localhost')
  const file = await resolveFile(pathname)
  const status = file ? 200 : 404
  const target = file ?? join(root, '404.html')
  const ext = extname(target)
  let body = await readFile(target)

  for (const rule of rules) {
    if (matches(rule.pattern, pathname)) for (const [k, v] of Object.entries(rule.headers)) res.setHeader(k, v)
  }
  res.setHeader('Content-Type', TYPES[ext] ?? 'application/octet-stream')

  const accept = String(req.headers['accept-encoding'] ?? '')
  if (COMPRESSIBLE.has(ext)) {
    res.setHeader('Vary', 'Accept-Encoding')
    if (accept.includes('br')) {
      body = brotliCompressSync(body)
      res.setHeader('Content-Encoding', 'br')
    }
    else if (accept.includes('gzip')) {
      body = gzipSync(body)
      res.setHeader('Content-Encoding', 'gzip')
    }
  }
  res.writeHead(status).end(body)
}).listen(port, () => console.log(`Preview on http://localhost:${port}`))
