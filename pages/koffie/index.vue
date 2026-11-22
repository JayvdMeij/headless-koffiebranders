<script setup lang="ts">
import { COFFEE_INDEX_QUERY } from '~/queries'
import type { COFFEE_INDEX_QUERY_RESULT } from '~/types/sanity.types'

type Coffee = COFFEE_INDEX_QUERY_RESULT['coffees'][number]

const data = await useSanityQuery('coffee-index', COFFEE_INDEX_QUERY)
const page = computed(() => data.value.page)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pagina niet gevonden', fatal: true })
}

const { url } = await usePageSeo({ title: page.value.title, description: page.value.intro, seo: page.value.seo })
useJsonLd({
  '@type': 'ItemList',
  name: page.value.title,
  itemListElement: data.value.coffees.map((coffee: Coffee, index: number) => ({
    '@type': 'ListItem',
    position: index + 1,
    url: `${url}/${coffee.slug}`,
    name: coffee.name,
  })),
})
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
