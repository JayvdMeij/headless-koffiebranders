import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['studio/**', '.output/**', 'dist/**', 'types/sanity.types.ts'],
})
