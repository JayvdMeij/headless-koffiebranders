<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const notFound = computed(() => props.error.statusCode === 404)
const heading = computed(() => (notFound.value ? 'Deze pagina bestaat niet' : 'Er ging iets mis'))

useHead({ title: `${heading.value} | Spaarne Koffiebranders` })
useSeoMeta({ robots: 'noindex, follow' })
</script>

<template>
  <NuxtLayout>
    <div class="section">
      <div class="container error-page">
        <p class="error-page__code">{{ error.statusCode }}</p>
        <h1>{{ heading }}</h1>
        <p class="lead">
          <template v-if="notFound">
            De pagina die je zoekt is verhuisd of bestaat niet meer. Misschien vind je hier wat je zoekt:
          </template>
          <template v-else>Probeer het later nog eens.</template>
        </p>
        <ul class="error-page__links" role="list">
          <li><NuxtLink to="/" class="button">Naar de homepage</NuxtLink></li>
          <li><NuxtLink to="/koffie" class="button button--ghost">Bekijk onze koffie</NuxtLink></li>
        </ul>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.error-page {
  max-width: 44rem;
}

.error-page__code {
  margin: 0;
  color: var(--color-accent);
  font-family: var(--font-display);
  font-size: var(--step-3);
  font-weight: 600;
}

.error-page__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-s);
  margin: var(--space-m) 0 0;
  padding: 0;
  list-style: none;
}
</style>
