<script setup lang="ts">
withDefaults(defineProps<{ statusCode?: number }>(), { statusCode: 404 })
</script>

<template>
  <div class="section">
    <div class="container not-found">
      <p class="not-found__code">{{ statusCode }}</p>
      <h1>{{ statusCode === 404 ? 'Deze pagina bestaat niet' : 'Er ging iets mis' }}</h1>
      <p class="lead">
        <template v-if="statusCode === 404">
          De pagina die je zoekt is verhuisd of bestaat niet meer. Misschien vind je hier wat je zoekt:
        </template>
        <template v-else>Probeer het later nog eens.</template>
      </p>
      <ul class="not-found__links" role="list">
        <li><NuxtLink to="/" class="button">Naar de homepage</NuxtLink></li>
        <li><NuxtLink to="/koffie" class="button button--ghost">Bekijk onze koffie</NuxtLink></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  max-width: 44rem;
}

.not-found__code {
  margin: 0;
  color: var(--color-accent);
  font-family: var(--font-display);
  font-size: var(--step-3);
  font-weight: 600;
}

.not-found__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-s);
  margin: var(--space-m) 0 0;
  padding: 0;
  list-style: none;
}
</style>
