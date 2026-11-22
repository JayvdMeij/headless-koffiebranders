<script setup lang="ts">
import { COFFEE_INDEX_QUERY } from '~/queries'

const data = await useSanityQuery('coffee-index', COFFEE_INDEX_QUERY)
const page = computed(() => data.value.page)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pagina niet gevonden', fatal: true })
}
</script>

<template>
  <div v-if="page" class="section">
    <div class="container">
      <header class="coffee-index__header">
        <h1>{{ page.title }}</h1>
        <p v-if="page.intro" class="lead">{{ page.intro }}</p>
      </header>

      <ul v-if="data.coffees.length" class="coffee-index__grid" role="list">
        <li v-for="coffee in data.coffees" :key="coffee._id">
          <CoffeeCard :coffee="coffee" />
        </li>
      </ul>
      <p v-else>Er staat op dit moment geen koffie in het assortiment. Kom snel terug!</p>
    </div>
  </div>
</template>

<style scoped>
.coffee-index__header {
  margin-bottom: var(--space-l);
}

.coffee-index__grid {
  display: grid;
  gap: var(--space-m);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
