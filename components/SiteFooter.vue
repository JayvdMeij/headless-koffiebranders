<script setup lang="ts">
import type { SETTINGS_QUERY_RESULT } from '~/types/sanity.types'

const props = defineProps<{ settings: NonNullable<SETTINGS_QUERY_RESULT> }>()

const year = new Date().getFullYear()
const tel = computed(() => props.settings.phone?.replace(/[^\d+]/g, ''))
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div>
        <p class="site-footer__name">{{ settings.title }}</p>
        <p v-if="settings.tagline">{{ settings.tagline }}</p>
      </div>

      <div>
        <h2 class="site-footer__heading">Bezoek ons</h2>
        <address v-if="settings.address">
          {{ settings.address.street }}<br>
          {{ settings.address.postalCode }} {{ settings.address.city }}
        </address>
        <ul class="site-footer__list" role="list">
          <li v-if="settings.email"><a :href="`mailto:${settings.email}`">{{ settings.email }}</a></li>
          <li v-if="settings.phone && tel"><a :href="`tel:${tel}`">{{ settings.phone }}</a></li>
        </ul>
      </div>

      <div v-if="settings.openingHours?.length">
        <h2 class="site-footer__heading">Openingstijden</h2>
        <dl class="site-footer__hours">
          <template v-for="row in settings.openingHours" :key="row._key">
            <dt>{{ row.days }}</dt>
            <dd>{{ row.hours }}</dd>
          </template>
        </dl>
      </div>

      <div v-if="settings.socialLinks?.length">
        <h2 class="site-footer__heading">Volg ons</h2>
        <ul class="site-footer__list" role="list">
          <li v-for="link in settings.socialLinks" :key="link._key">
            <a :href="link.url" rel="noopener">{{ link.label }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="container site-footer__bottom">
      <p>&copy; {{ year }} {{ settings.title }}. Fictief merk, gemaakt als demo.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: auto;
  background: var(--color-espresso);
  color: var(--color-bg);
  font-size: var(--step--1);
}

.site-footer a {
  color: var(--color-sand);
}

.site-footer__grid {
  display: grid;
  gap: var(--space-l);
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  padding-block: var(--space-xl) var(--space-l);
}

.site-footer__name {
  font-family: var(--font-display);
  font-size: var(--step-1);
  font-weight: 600;
  margin-bottom: var(--space-xs);
}

.site-footer__heading {
  font-family: var(--font-body);
  font-size: var(--step-0);
  font-weight: 600;
  color: var(--color-sand);
  margin-bottom: var(--space-xs);
}

address {
  font-style: normal;
  margin-bottom: var(--space-xs);
}

.site-footer__list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-footer__list a {
  display: inline-block;
  padding-block: 0.3rem;
}

.site-footer__hours {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2xs) var(--space-s);
}

.site-footer__hours dd {
  margin: 0;
}

.site-footer__bottom {
  border-top: 1px solid rgb(247 241 232 / 0.2);
  padding-block: var(--space-s);
}

.site-footer__bottom p {
  margin: 0;
}
</style>
