<script setup lang="ts">
import { CONTACT_QUERY, SETTINGS_QUERY } from '~/queries'

const [page, settings] = await Promise.all([
  useSanityQuery('contact', CONTACT_QUERY),
  useSanityQuery('settings', SETTINGS_QUERY),
])

const mapUrl = computed(() => {
  const a = settings.value.address
  if (!a) return undefined
  const q = encodeURIComponent(`${a.street}, ${a.postalCode} ${a.city}`)
  return `https://www.openstreetmap.org/search?query=${q}`
})
</script>

<template>
  <div class="section">
    <div class="container contact">
      <header class="contact__header">
        <h1>{{ page.title }}</h1>
        <p v-if="page.intro" class="lead">{{ page.intro }}</p>
      </header>

      <!--
        Netlify Forms detects this form in the prerendered HTML at deploy time.
        It works without JavaScript: a normal POST, then a redirect to the action URL.
      -->
      <form
        name="contact"
        method="POST"
        action="/contact/bedankt"
        data-netlify="true"
        netlify-honeypot="bot-field"
        class="contact__form"
      >
        <input type="hidden" name="form-name" value="contact">
        <p class="visually-hidden" aria-hidden="true">
          <label>Niet invullen <input name="bot-field" tabindex="-1" autocomplete="off"></label>
        </p>

        <p class="contact__required-note">Velden met <span aria-hidden="true">*</span> zijn verplicht.</p>

        <div class="field">
          <label for="name">Naam <span aria-hidden="true">*</span></label>
          <input id="name" name="name" type="text" autocomplete="name" required aria-required="true">
        </div>

        <div class="field">
          <label for="email">E-mailadres <span aria-hidden="true">*</span></label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            inputmode="email"
            required
            aria-required="true"
            aria-describedby="email-hint"
          >
          <p id="email-hint" class="field__hint">We gebruiken je e-mailadres alleen om te antwoorden.</p>
        </div>

        <div class="field">
          <label for="subject">Onderwerp</label>
          <select id="subject" name="subject">
            <option>Algemene vraag</option>
            <option>Bestelling of beschikbaarheid</option>
            <option>Groothandel en horeca</option>
            <option>Workshops en cuppings</option>
          </select>
        </div>

        <div class="field">
          <label for="message">Bericht <span aria-hidden="true">*</span></label>
          <textarea id="message" name="message" rows="6" required aria-required="true" />
        </div>

        <button type="submit" class="button">Verstuur bericht</button>
      </form>

      <aside class="contact__info" aria-labelledby="visit-heading">
        <h2 id="visit-heading">Langskomen</h2>
        <address v-if="settings.address">
          {{ settings.address.street }}<br>
          {{ settings.address.postalCode }} {{ settings.address.city }}
        </address>
        <p v-if="mapUrl">
          <a :href="mapUrl" rel="noopener">Bekijk op de kaart<span class="visually-hidden"> (OpenStreetMap)</span></a>
        </p>
        <p v-if="settings.email">
          E-mail: <a :href="`mailto:${settings.email}`">{{ settings.email }}</a>
        </p>
        <p v-if="settings.phone">
          Telefoon: <a :href="`tel:${settings.phone.replace(/[^\d+]/g, '')}`">{{ settings.phone }}</a>
        </p>

        <template v-if="settings.openingHours?.length">
          <h3>Openingstijden</h3>
          <dl class="contact__hours">
            <template v-for="row in settings.openingHours" :key="row._key">
              <dt>{{ row.days }}</dt>
              <dd>{{ row.hours }}</dd>
            </template>
          </dl>
        </template>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.contact {
  display: grid;
  gap: var(--space-l);
}

@media (min-width: 56rem) {
  .contact {
    grid-template-columns: 3fr 2fr;
    column-gap: var(--space-xl);
  }

  .contact__header {
    grid-column: 1 / -1;
  }
}

.contact__form {
  display: grid;
  gap: var(--space-m);
  align-content: start;
}

.contact__required-note {
  margin: 0;
  color: var(--color-muted);
  font-size: var(--step--1);
}

.field {
  display: grid;
  gap: var(--space-2xs);
}

.field label {
  font-weight: 600;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--color-muted);
  border-radius: var(--radius);
  background: #fff;
  color: var(--color-text);
  font: inherit;
}

.field textarea {
  resize: vertical;
}

.field input:user-invalid,
.field textarea:user-invalid {
  border-color: var(--color-accent);
  border-width: 2px;
}

.field__hint {
  margin: 0;
  color: var(--color-muted);
  font-size: var(--step--1);
}

.contact__form .button {
  justify-self: start;
}

.contact__info {
  align-self: start;
  padding: var(--space-m);
  background: var(--color-surface);
  border-radius: var(--radius);
}

.contact__info h2 {
  font-size: var(--step-2);
}

.contact__info h3 {
  font-family: var(--font-body);
  font-size: var(--step-0);
  margin-top: var(--space-m);
}

.contact__info address {
  font-style: normal;
  margin-bottom: var(--space-xs);
}

.contact__hours {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-2xs) var(--space-s);
}

.contact__hours dd {
  margin: 0;
}
</style>
