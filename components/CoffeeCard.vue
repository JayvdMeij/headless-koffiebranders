<script setup lang="ts">
import type { COFFEE_INDEX_QUERY_RESULT } from '~/types/sanity.types'

const props = withDefaults(
  defineProps<{
    coffee: COFFEE_INDEX_QUERY_RESULT['coffees'][number]
    headingLevel?: 'h2' | 'h3'
  }>(),
  { headingLevel: 'h2' },
)

const price = computed(() => formatPrice(props.coffee.price))
</script>

<template>
  <article class="coffee-card">
    <SanityImage
      :image="coffee.image"
      :aspect-ratio="4 / 3"
      sizes="(min-width: 72rem) 352px, (min-width: 60rem) calc(33vw - 32px), (min-width: 40rem) calc(50vw - 36px), calc(100vw - 32px)"
      class="coffee-card__image"
    />
    <div class="coffee-card__body">
      <p class="coffee-card__meta">{{ coffee.origin }} · {{ roastLabel(coffee.roastLevel) }}</p>
      <component :is="headingLevel" class="coffee-card__title">
        <!-- Whole card is clickable through the stretched link; one tab stop per card -->
        <NuxtLink :to="`/koffie/${coffee.slug}`" class="coffee-card__link">{{ coffee.name }}</NuxtLink>
      </component>
      <p class="coffee-card__excerpt">{{ coffee.excerpt }}</p>
      <p class="coffee-card__price">
        {{ price }} <span class="coffee-card__weight">/ {{ coffee.weight }} gram</span>
      </p>
    </div>
  </article>
</template>

<style scoped>
.coffee-card {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow: hidden;
}

.coffee-card:focus-within,
.coffee-card:hover {
  border-color: var(--color-accent);
}

.coffee-card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: var(--color-surface);
}

.coffee-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--space-m);
}

.coffee-card__meta {
  margin-bottom: var(--space-2xs);
  color: var(--color-muted);
  font-size: var(--step--1);
}

.coffee-card__title {
  font-size: var(--step-1);
  margin-bottom: var(--space-xs);
}

.coffee-card__link {
  color: var(--color-text);
  text-decoration: none;
}

.coffee-card__link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.coffee-card__link:focus-visible {
  outline: none;
}

.coffee-card:has(.coffee-card__link:focus-visible) {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

.coffee-card__excerpt {
  color: var(--color-muted);
}

.coffee-card__price {
  margin: auto 0 0;
  font-weight: 600;
}

.coffee-card__weight {
  color: var(--color-muted);
  font-weight: 400;
}
</style>
