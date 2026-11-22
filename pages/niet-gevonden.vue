<script setup lang="ts">
// Prerendered and copied to 404.html after `nuxt generate`, so the static
// 404 page works without JavaScript.
await usePageSeo({ title: 'Deze pagina bestaat niet', noindex: true })
</script>

<template>
  <NotFound />
</template>
