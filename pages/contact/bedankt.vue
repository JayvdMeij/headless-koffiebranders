<script setup lang="ts">
import { CONTACT_QUERY } from '~/queries'

const page = await useSanityQuery('contact', CONTACT_QUERY)

await usePageSeo({ title: page.value.successTitle || 'Bedankt', noindex: true })
</script>

<template>
  <div class="section">
    <div class="container thanks">
      <h1>{{ page.successTitle || 'Bedankt voor je bericht' }}</h1>
      <p class="lead">{{ page.successMessage || 'We reageren zo snel mogelijk.' }}</p>
      <NuxtLink to="/koffie" class="button">Bekijk onze koffie</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.thanks {
  max-width: 40rem;
}
</style>
