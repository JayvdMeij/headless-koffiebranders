<script setup lang="ts">
import type { NuxtError } from '#app'

// Used during development and for runtime errors. The static 404 page on
// Netlify is the prerendered /niet-gevonden page (see scripts/not-found-page.mjs).
const props = defineProps<{ error: NuxtError }>()

useHead({
  title: `${props.error.statusCode === 404 ? 'Deze pagina bestaat niet' : 'Er ging iets mis'} | Spaarne Koffiebranders`,
})
useSeoMeta({ robots: 'noindex, follow' })
</script>

<template>
  <NuxtLayout>
    <NotFound :status-code="error.statusCode" />
  </NuxtLayout>
</template>
