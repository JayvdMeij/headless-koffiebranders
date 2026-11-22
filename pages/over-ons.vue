<script setup lang="ts">
import { ABOUT_QUERY } from '~/queries'

const page = await useSanityQuery('about', ABOUT_QUERY)
</script>

<template>
  <article class="section">
    <div class="container">
      <header class="about__header">
        <h1>{{ page.title }}</h1>
        <p v-if="page.intro" class="lead">{{ page.intro }}</p>
      </header>
      <SanityImage
        v-if="page.image"
        :image="page.image"
        :aspect-ratio="16 / 9"
        sizes="100vw xl:1152px"
        priority
        class="about__image"
      />
      <RichText v-if="page.body" :value="page.body" />
    </div>
  </article>
</template>

<style scoped>
.about__header {
  margin-bottom: var(--space-l);
}

.about__image {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: var(--radius);
  margin-bottom: var(--space-l);
  background: var(--color-surface);
}
</style>
