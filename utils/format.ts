const priceFormatter = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })

export const formatPrice = (value: number) => priceFormatter.format(value)

const ROAST_LABELS: Record<string, string> = { light: 'Lichte branding', medium: 'Medium branding', dark: 'Donkere branding' }
const PROCESS_LABELS: Record<string, string> = { washed: 'Gewassen', natural: 'Natural', honey: 'Honey', anaerobic: 'Anaeroob' }

export const roastLabel = (value?: string | null) => (value && ROAST_LABELS[value]) || ''
export const processLabel = (value?: string | null) => (value && PROCESS_LABELS[value]) || ''
