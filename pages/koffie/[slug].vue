<script setup lang="ts">
import { COFFEE_QUERY } from '~/queries'

const route = useRoute()
const slug = String(route.params.slug)
const coffee = await useSanityQuery(`coffee-${slug}`, COFFEE_QUERY, { slug })

const { url, siteName } = await usePageSeo({
  title: coffee.value.name,
  description: coffee.value.excerpt,
  seo: coffee.value.seo,
  imageId: coffee.value.image.asset?._id,
})
const { siteUrl } = useRuntimeConfig().public
const img = useImage()
const imageId = coffee.value.image.asset?._id

useJsonLd({
  '@graph': [
    {
      '@type': 'Product',
      name: coffee.value.name,
      description: coffee.value.excerpt,
      url,
      image: imageId ? croppedImageUrl(img, imageId, 1200, 1200) : undefined,
      brand: { '@type': 'Brand', name: siteName },
      countryOfOrigin: coffee.value.origin,
      weight: { '@type': 'QuantitativeValue', value: coffee.value.weight, unitCode: 'GRM' },
      offers: {
        '@type': 'Offer',
        price: coffee.value.price.toFixed(2),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStoreOnly',
        url,
      },
    },
    breadcrumbSchema([
      { name: 'Home', url: siteUrl },
      { name: 'Koffie', url: `${siteUrl}/koffie` },
      { name: coffee.value.name, url },
    ]),
  ],
})

const facts = computed(() =>
  [
    { label: 'Herkomst', value: coffee.value.origin },
    { label: 'Regio', value: coffee.value.region },
    { label: 'Verwerking', value: processLabel(coffee.value.process) },
    { label: 'Branding', value: roastLabel(coffee.value.roastLevel) },
    { label: 'Inhoud', value: `${coffee.value.weight} gram` },
  ].filter((fact) => fact.value),
)
</script>

<template>
  <article class="section">
    <div class="container">
      <nav aria-label="Kruimelpad" class="breadcrumb">
        <ol role="list">
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/koffie">Koffie</NuxtLink></li>
          <li><span aria-current="page">{{ coffee.name }}</span></li>
        </ol>
      </nav>

      <div class="coffee__grid">
        <SanityImage
          :image="coffee.image"
          :aspect-ratio="4 / 5"
          sizes="(min-width: 72rem) 520px, (min-width: 48rem) calc(50vw - 56px), calc(100vw - 32px)"
          priority
          class="coffee__image"
        />

        <div>
          <h1>{{ coffee.name }}</h1>
          <p class="lead">{{ coffee.excerpt }}</p>
          <p class="coffee__price">
            {{ formatPrice(coffee.price) }}
            <span class="coffee__weight">/ {{ coffee.weight }} gram</span>
          </p>

          <div v-if="coffee.tastingNotes?.length" class="coffee__notes">
            <h2 class="coffee__subheading">Smaaknoten</h2>
            <ul role="list">
              <li v-for="note in coffee.tastingNotes" :key="note">{{ note }}</li>
            </ul>
          </div>

          <h2 class="coffee__subheading">Kenmerken</h2>
          <dl class="coffee__facts">
            <div v-for="fact in facts" :key="fact.label">
              <dt>{{ fact.label }}</dt>
              <dd>{{ fact.value }}</dd>
            </div>
          </dl>

          <p class="coffee__cta">
            Verkrijgbaar in onze winkel aan het Spaarne.
            <NuxtLink to="/contact">Vraag naar beschikbaarheid</NuxtLink>
          </p>
        </div>
      </div>

      <section v-if="coffee.body?.length" class="coffee__story" aria-label="Over deze koffie">
        <RichText :value="coffee.body" />
      </section>
    </div>
  </article>
</template>

<style scoped>
.breadcrumb ol {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
  margin: 0 0 var(--space-l);
  padding: 0;
  list-style: none;
  font-size: var(--step--1);
  color: var(--color-muted);
}

.breadcrumb li:not(:last-child)::after {
  content: '/';
  margin-left: var(--space-2xs);
}

.coffee__grid {
  display: grid;
  gap: var(--space-l);
  align-items: start;
}

@media (min-width: 48rem) {
  .coffee__grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
  }
}

.coffee__image {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: var(--radius);
  background: var(--color-surface);
}

.coffee__price {
  font-size: var(--step-2);
  font-weight: 600;
}

.coffee__weight {
  font-size: var(--step-0);
  font-weight: 400;
  color: var(--color-muted);
}

.coffee__subheading {
  font-family: var(--font-body);
  font-size: var(--step-0);
  margin: var(--space-m) 0 var(--space-xs);
}

.coffee__notes ul {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.coffee__notes li {
  padding: var(--space-2xs) var(--space-s);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  font-size: var(--step--1);
}

.coffee__facts {
  display: grid;
  gap: 0;
  margin: 0;
}

.coffee__facts div {
  display: flex;
  justify-content: space-between;
  gap: var(--space-s);
  padding-block: var(--space-xs);
  border-bottom: 1px solid var(--color-border);
}

.coffee__facts dt {
  color: var(--color-muted);
}

.coffee__facts dd {
  margin: 0;
  font-weight: 500;
  text-align: right;
}

.coffee__cta {
  margin-top: var(--space-m);
}

.coffee__story {
  margin-top: var(--space-xl);
  padding-top: var(--space-l);
  border-top: 1px solid var(--color-border);
}
</style>
