<script setup lang="ts">
defineProps<{ siteName: string }>()

const links = [
  { to: '/koffie', label: 'Koffie' },
  { to: '/over-ons', label: 'Over ons' },
  { to: '/contact', label: 'Contact' },
]
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <NuxtLink to="/" class="site-header__logo">
        <svg aria-hidden="true" width="28" height="28" viewBox="0 0 32 32" fill="none">
          <ellipse cx="16" cy="16" rx="10" ry="14" transform="rotate(30 16 16)" fill="currentColor" />
          <path d="M11 6c6 6 4 14 10 20" stroke="var(--color-bg)" stroke-width="2" stroke-linecap="round" />
        </svg>
        <span>{{ siteName }}</span>
      </NuxtLink>
      <nav aria-label="Hoofdmenu">
        <ul class="site-header__nav" role="list">
          <li v-for="link in links" :key="link.to">
            <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  border-bottom: 1px solid var(--color-border);
}

.site-header__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs) var(--space-m);
  padding-block: var(--space-s);
}

.site-header__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: var(--step-1);
  font-weight: 600;
  text-decoration: none;
}

.site-header__logo svg {
  color: var(--color-accent);
}

.site-header__nav {
  display: flex;
  gap: var(--space-2xs) var(--space-m);
  margin: 0;
  padding: 0;
  list-style: none;
}

.site-header__nav a {
  display: inline-block;
  padding-block: var(--space-xs);
  color: var(--color-text);
  font-weight: 500;
  text-decoration: none;
}

.site-header__nav a:hover,
.site-header__nav a[aria-current='page'] {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-decoration-color: var(--color-accent);
}
</style>
