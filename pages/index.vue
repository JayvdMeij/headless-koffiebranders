<script setup lang="ts">
import { HOME_QUERY } from '~/queries'

const data = await useSanityQuery('home', HOME_QUERY)
const page = computed(() => data.value.page)
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pagina niet gevonden', fatal: true })
}

const { settings, url } = await usePageSeo({
  title: page.value.seo?.title || page.value.hero.heading,
  description: page.value.hero.text,
  seo: page.value.seo,
  imageId: page.value.hero.image.asset?._id,
})
useJsonLd(localBusinessSchema(settings.value, url, useImage()))
</script>

<template>
  <div v-if="page">
    <section class="hero">
      <div class="container hero__inner">
        <div class="hero__text">
          <h1>{{ page.hero.heading }}</h1>
          <p v-if="page.hero.text" class="lead">{{ page.hero.text }}</p>
          <NuxtLink v-if="page.hero.ctaLabel" to="/koffie" class="button">{{ page.hero.ctaLabel }}</NuxtLink>
        </div>
        <SanityImage
          :image="page.hero.image"
          :aspect-ratio="4 / 5"
          sizes="(min-width: 72rem) 520px, (min-width: 48rem) calc(50vw - 56px), calc(100vw - 32px)"
          priority
          class="hero__image"
        />
      </div>
    </section>

    <section v-if="data.featured.length" class="section featured" aria-labelledby="featured-heading">
      <div class="container">
        <div class="featured__header">
          <h2 id="featured-heading">{{ page.featuredHeading || 'Uitgelichte koffie' }}</h2>
          <NuxtLink to="/koffie">Alle koffie bekijken</NuxtLink>
        </div>
        <ul class="featured__grid" role="list">
          <li v-for="coffee in data.featured" :key="coffee._id">
            <CoffeeCard :coffee="coffee" heading-level="h3" />
          </li>
        </ul>
      </div>
    </section>

    <section v-if="page.story?.length" class="section story" aria-labelledby="story-heading">
      <div class="container story__inner">
        <SanityImage
          v-if="page.storyImage"
          :image="page.storyImage"
          :aspect-ratio="1"
          sizes="(min-width: 72rem) 520px, (min-width: 48rem) calc(50vw - 56px), calc(100vw - 32px)"
          class="story__image"
        />
        <div>
          <h2 id="story-heading">{{ page.storyHeading }}</h2>
          <RichText :value="page.story" />
          <NuxtLink to="/over-ons" class="button button--ghost">Lees ons verhaal</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding-block: var(--space-xl);
}

.hero__inner {
  display: grid;
  gap: var(--space-l);
  align-items: center;
}

.hero__image,
.story__image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: var(--radius);
  background: var(--color-surface);
}

.hero__image {
  aspect-ratio: 4 / 5;
  max-height: 70vh;
}

.story__image {
  aspect-ratio: 1;
}

@media (min-width: 48rem) {
  .hero__inner,
  .story__inner {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
  }
}

.featured {
  background: var(--color-surface);
}

.featured__header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-xs) var(--space-m);
  margin-bottom: var(--space-l);
}

.featured__header h2 {
  margin: 0;
}

.featured__grid {
  display: grid;
  gap: var(--space-m);
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}

.story__inner {
  display: grid;
  gap: var(--space-l);
  align-items: center;
}
</style>
