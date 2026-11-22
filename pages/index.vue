<script setup lang="ts">
import { HOME_QUERY } from '~/queries'

const data = await useSanityQuery('home', HOME_QUERY)
const heading: string = data.value.page?.hero.heading ?? ''
</script>

<template>
  <main>
    <h1>{{ heading }}</h1>
    <p v-for="c in data.featured" :key="c._id">{{ c.name }}</p>
  </main>
</template>
