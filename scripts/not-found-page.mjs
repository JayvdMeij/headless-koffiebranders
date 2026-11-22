#!/usr/bin/env node
// Nuxt's generated 404.html/200.html are SPA shells that need the client
// runtime. This site ships no JavaScript, so replace 404.html with the
// prerendered /niet-gevonden page and drop the unused SPA fallback.
import { copyFile, rm } from 'node:fs/promises'
import { join } from 'node:path'

const publishDir = process.argv[2] ?? '.output/public'

await copyFile(join(publishDir, 'niet-gevonden/index.html'), join(publishDir, '404.html'))
await rm(join(publishDir, '200.html'), { force: true })
console.log('Replaced 404.html with the prerendered not-found page')
