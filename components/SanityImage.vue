<script setup lang="ts">
import type { SanityImageCrop, SanityImageHotspot } from '~/types/sanity.types'

export interface SanityImageValue {
  alt?: string | null
  crop?: SanityImageCrop | null
  hotspot?: SanityImageHotspot | null
  asset: { _id: string; width: number | null; height: number | null } | null
}

const props = withDefaults(
  defineProps<{
    image: SanityImageValue
    /** `sizes` attribute, e.g. "100vw md:50vw". Drives the generated srcset. */
    sizes: string
    /** Optional width / height ratio to crop to, e.g. 4 / 3. Uses the hotspot when set. */
    aspectRatio?: number
    /** Mark as LCP candidate: eager loading, fetchpriority high and a preload hint. */
    priority?: boolean
  }>(),
  { aspectRatio: undefined, priority: false },
)

// Intrinsic dimensions so the browser reserves space before the image loads (no CLS)
const dimensions = computed(() => {
  const width = props.image.asset?.width ?? 1600
  const naturalHeight = props.image.asset?.height ?? 1200
  const height = props.aspectRatio ? Math.round(width / props.aspectRatio) : naturalHeight
  return { width, height }
})

const modifiers = computed(() => {
  const { hotspot, crop } = props.image
  if (props.aspectRatio && hotspot) {
    // Crop around the editor-defined focal point
    return { crop: 'focalpoint', 'fp-x': hotspot.x, 'fp-y': hotspot.y }
  }
  return crop ? { crop } : {}
})
</script>

<template>
  <NuxtImg
    v-if="image.asset"
    :src="image.asset._id"
    :alt="image.alt ?? ''"
    :width="dimensions.width"
    :height="dimensions.height"
    :sizes="sizes"
    :fit="aspectRatio ? 'cover' : undefined"
    :modifiers="modifiers"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : 'auto'"
    :preload="priority ? { fetchPriority: 'high' } : false"
    decoding="async"
  />
</template>
