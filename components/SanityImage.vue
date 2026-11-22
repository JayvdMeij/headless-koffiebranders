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
    /** Native `sizes` attribute, e.g. "(min-width: 48rem) 50vw, 100vw". */
    sizes: string
    /** Optional width / height ratio to crop to, e.g. 4 / 3. Uses the hotspot when set. */
    aspectRatio?: number
    /** Mark as LCP candidate: eager loading, fetchpriority high and a preload hint. */
    priority?: boolean
  }>(),
  { aspectRatio: undefined, priority: false },
)

// Candidate widths for the srcset; the browser picks one using `sizes` and the device pixel ratio
const WIDTHS: number[] = [320, 480, 640, 800, 960, 1200, 1600, 2000]

const img = useImage()

const sourceWidth = computed(() => props.image.asset?.width ?? 2000)
const sourceHeight = computed(() => props.image.asset?.height ?? 1500)

// Intrinsic dimensions so the browser reserves space before the image loads (no CLS)
const dimensions = computed(() => {
  const width = sourceWidth.value
  const height = props.aspectRatio ? Math.round(width / props.aspectRatio) : sourceHeight.value
  return { width, height }
})

function url(width: number) {
  const id = props.image.asset!._id
  const { hotspot, crop } = props.image
  const modifiers: Record<string, unknown> = { width, quality: 75 }
  if (props.aspectRatio) {
    modifiers.height = Math.round(width / props.aspectRatio)
    modifiers.fit = 'cover'
    // Crop around the editor-defined focal point
    if (hotspot) Object.assign(modifiers, { crop: 'focalpoint', 'fp-x': hotspot.x, 'fp-y': hotspot.y })
  }
  else if (crop) {
    modifiers.crop = crop
  }
  // No `format`: the provider adds auto=format, so the Sanity CDN serves AVIF/WebP when supported
  return img(id, modifiers as Parameters<typeof img>[1])
}

const widths = computed<number[]>(() => {
  const usable = WIDTHS.filter((w) => w <= sourceWidth.value)
  return usable.length ? usable : [sourceWidth.value]
})
const srcset = computed<string>(() => (props.image.asset ? widths.value.map((w: number) => `${url(w)} ${w}w`).join(', ') : ''))
const src = computed<string>(() => (props.image.asset ? url(widths.value.find((w: number) => w >= 800) ?? widths.value.at(-1)!) : ''))

if (props.priority && props.image.asset) {
  useHead({
    link: [{ rel: 'preload', as: 'image', imagesrcset: srcset.value, imagesizes: props.sizes, fetchpriority: 'high' }],
  })
}
</script>

<template>
  <img
    v-if="image.asset"
    :src="src"
    :srcset="srcset"
    :sizes="sizes"
    :alt="image.alt ?? ''"
    :width="dimensions.width"
    :height="dimensions.height"
    :loading="priority ? 'eager' : 'lazy'"
    :fetchpriority="priority ? 'high' : undefined"
    decoding="async"
  >
</template>
