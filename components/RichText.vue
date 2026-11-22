<script setup lang="ts">
import { PortableText, type PortableTextComponents } from '@portabletext/vue'
import type { PortableTextBlock } from '@portabletext/types'
import { SanityImage } from '#components'
import type { SanityImageValue } from './SanityImage.vue'

defineProps<{ value: Array<PortableTextBlock | ({ _type: 'imageWithAlt'; _key: string } & SanityImageValue)> }>()

const isExternal = (href: string) => /^https?:\/\//.test(href)

const components: PortableTextComponents = {
  types: {
    imageWithAlt: ({ value }: { value: SanityImageValue }) =>
      h('figure', { class: 'rich-text__figure' }, [h(SanityImage, { image: value, sizes: '(min-width: 42rem) 640px, calc(100vw - 32px)' })]),
  },
  marks: {
    link: ({ value }: { value?: { href?: string } }, { slots }) => {
      const href = value?.href ?? '#'
      return h('a', { href, rel: isExternal(href) ? 'noopener' : undefined }, slots.default?.())
    },
  },
}
</script>

<template>
  <div class="rich-text">
    <PortableText :value="value" :components="components" />
  </div>
</template>

<style scoped>
.rich-text {
  max-width: var(--measure);
}

.rich-text :deep(h2) {
  font-size: var(--step-2);
  margin-top: var(--space-l);
}

.rich-text :deep(h3) {
  margin-top: var(--space-m);
}

.rich-text :deep(blockquote) {
  margin-inline: 0;
  padding-left: var(--space-s);
  border-left: 3px solid var(--color-accent);
  font-family: var(--font-display);
  font-size: var(--step-1);
}

.rich-text :deep(li) {
  margin-bottom: var(--space-2xs);
}

.rich-text :deep(.rich-text__figure) {
  margin: var(--space-l) 0;
}

.rich-text :deep(.rich-text__figure img) {
  border-radius: var(--radius);
}
</style>
