<script setup lang="ts">
import { SETTINGS_QUERY } from '~/queries'

const settings = await useSanityQuery('settings', SETTINGS_QUERY)
</script>

<template>
  <div class="site">
    <a href="#main" class="skip-link">Naar de inhoud</a>
    <SiteHeader :site-name="settings.title" />
    <main id="main" tabindex="-1">
      <slot />
    </main>
    <SiteFooter :settings="settings" />
  </div>
</template>

<style scoped>
.site {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.skip-link {
  position: absolute;
  top: var(--space-xs);
  left: var(--space-xs);
  z-index: 10;
  padding: var(--space-xs) var(--space-s);
  background: var(--color-espresso);
  color: var(--color-bg);
  border-radius: var(--radius);
  transform: translateY(-200%);
}

.skip-link:focus {
  transform: none;
}

main:focus {
  outline: none;
}
</style>
