// Builds seed/production.ndjson with demo content for the fictional brand.
// Run: node seed/build-seed.mjs && npx sanity dataset import seed/production.ndjson production --missing
// Photos: Unsplash (https://unsplash.com/license), imported once into the Sanity asset pipeline.
import { randomBytes } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const key = () => randomBytes(6).toString('hex')
const photo = (id) => `image@https://images.unsplash.com/photo-${id}?w=2400&q=85&fm=jpg`
const image = (id, alt) => ({ _type: 'imageWithAlt', alt, _sanityAsset: photo(id) })

const span = (text, marks = []) => ({ _type: 'span', _key: key(), text, marks })
const block = (text, style = 'normal') => ({ _type: 'block', _key: key(), style, markDefs: [], children: [span(text)] })
const bullets = (items) =>
  items.map((text) => ({ ...block(text), listItem: 'bullet', level: 1 }))

const settings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: 'Spaarne Koffiebranders',
  tagline: 'Kleine batches, vers gebrand aan het Spaarne in Haarlem.',
  address: { street: 'Spaarne 42', postalCode: '2011 CJ', city: 'Haarlem' },
  email: 'hallo@spaarnekoffie.example',
  phone: '023 123 45 67',
  openingHours: [
    { _key: key(), days: 'Maandag', hours: 'Gesloten' },
    { _key: key(), days: 'Di t/m vr', hours: '08:00 - 17:00' },
    { _key: key(), days: 'Zaterdag', hours: '09:00 - 17:00' },
    { _key: key(), days: 'Zondag', hours: '10:00 - 16:00' },
  ],
  socialLinks: [
    { _key: key(), label: 'Instagram', url: 'https://www.instagram.com/' },
  ],
  seo: {
    _type: 'seo',
    title: 'Spaarne Koffiebranders | Specialty koffie uit Haarlem',
    description:
      'Koffiebranderij aan het Spaarne in Haarlem. Wij branden in kleine batches en verkopen verse bonen in onze winkel en proeflokaal.',
    ogImage: { _type: 'image', _sanityAsset: photo('1495474472287-4d71bcdd2085') },
  },
}

const home = {
  _id: 'homePage',
  _type: 'homePage',
  hero: {
    heading: 'Vers gebrande koffie, aan het Spaarne',
    text: 'Wij kopen groene bonen direct in bij boeren die we kennen en branden ze elke week in kleine batches. Kom proeven in ons proeflokaal in het centrum van Haarlem.',
    image: image('1442512595331-e89e73853f31', 'Barista schenkt heet water uit een ketel over een pour-over filter aan de koffiebar'),
    ctaLabel: 'Bekijk onze koffie',
  },
  featuredHeading: 'Nu in de branderij',
  storyHeading: 'Van boon tot kop',
  story: [
    block('Elke dinsdag en donderdag draait onze Giesen-brander in de oude pakhuiskelder aan het Spaarne. We branden nooit meer dan we in twee weken verkopen, zodat de koffie die je bij ons koopt altijd vers is.'),
    block('Proeven doen we samen met jou: elke zaterdag om 11:00 houden we een open cupping in het proeflokaal.'),
  ],
  storyImage: image('1447933601403-0c6688de566e', 'Close-up van een laag vers gebrande, donkerbruine koffiebonen'),
  seo: { _type: 'seo' },
}

const about = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  title: 'Over ons',
  intro: 'Spaarne Koffiebranders begon in 2016 met één tweedehands brander en een liefde voor goede koffie. Inmiddels branden we voor onze winkel, een handvol Haarlemse horecazaken en thuisdrinkers door heel Nederland.',
  image: image('1554118811-1e0d58224f24', 'Licht koffieproeflokaal met houten tafels, witte stoelen, planten en een lange bar'),
  body: [
    block('Waar we voor staan', 'h2'),
    block('We geloven dat goede koffie begint bij een eerlijke prijs voor de boer. Daarom kopen we zoveel mogelijk direct in, en betalen we altijd ruim boven de beurskoers.'),
    ...bullets([
      'Directe handel met coöperaties in Ethiopië, Colombia en Guatemala',
      'Branden in kleine batches van maximaal 15 kilo',
      'Composteerbare verpakkingen en bezorging per fiets in Haarlem',
    ]),
    block('Het team', 'h2'),
    block('Achter de brander staat een klein team van vijf mensen. We zijn allemaal opgeleid als barista en proeven elke batch voordat hij de deur uitgaat.'),
  ],
  seo: {
    _type: 'seo',
    description: 'Het verhaal achter Spaarne Koffiebranders: directe handel, kleine batches en een proeflokaal aan het Spaarne in Haarlem.',
  },
}

const coffeeIndex = {
  _id: 'coffeeIndexPage',
  _type: 'coffeeIndexPage',
  title: 'Onze koffie',
  intro: 'Een wisselend aanbod van single origins en één vaste huisblend. Alle koffie is maximaal twee weken geleden gebrand.',
  seo: {
    _type: 'seo',
    description: 'Bekijk het actuele aanbod vers gebrande specialty koffie van Spaarne Koffiebranders: single origins en onze huisblend.',
  },
}

const contact = {
  _id: 'contactPage',
  _type: 'contactPage',
  title: 'Contact',
  intro: 'Vragen over onze koffie, een groothandelsaccount of een workshop? Stuur ons een bericht, we reageren binnen twee werkdagen.',
  successTitle: 'Bedankt voor je bericht',
  successMessage: 'We hebben je bericht goed ontvangen en reageren binnen twee werkdagen.',
  seo: {
    _type: 'seo',
    description: 'Neem contact op met Spaarne Koffiebranders in Haarlem. Adres, openingstijden en contactformulier.',
  },
}

const coffee = (c) => ({
  _type: 'coffee',
  weight: 250,
  ...c,
  slug: { _type: 'slug', current: c.slug },
  seo: { _type: 'seo' },
})

const coffees = [
  coffee({
    name: 'Ethiopië Yirgacheffe',
    slug: 'ethiopie-yirgacheffe',
    excerpt: 'Licht en bloemig, met tonen van jasmijn, bergamot en citroen. Heerlijk als filterkoffie.',
    image: image('1497935586351-b67a49e012bf', 'Houten plank met koffiebonen, gemalen koffie, een espresso en een cappuccino met latte art'),
    origin: 'Ethiopië',
    region: 'Gedeo, Yirgacheffe',
    process: 'washed',
    roastLevel: 'light',
    tastingNotes: ['Jasmijn', 'Bergamot', 'Citroen'],
    price: 12.5,
    featured: true,
    body: [
      block('Deze koffie komt van het Konga-station, waar ruim 600 kleine boeren hun kersen aanleveren. Na het wassen drogen de bonen twee weken op verhoogde bedden.'),
      block('Zetadvies', 'h2'),
      block('Gebruik 15 gram koffie op 250 ml water van 94 °C. Een V60 of Chemex laat de bloemige tonen het mooist uitkomen.'),
    ],
  }),
  coffee({
    name: 'Colombia Huila',
    slug: 'colombia-huila',
    excerpt: 'Zoet en rond, met karamel, rode appel en een zachte melkchocolade afdronk.',
    image: image('1580933073521-dc49ac0d4e6a', 'Bovenaanzicht van een grote hoeveelheid middelbruin gebrande koffiebonen'),
    origin: 'Colombia',
    region: 'Pitalito, Huila',
    process: 'washed',
    roastLevel: 'medium',
    tastingNotes: ['Karamel', 'Rode appel', 'Melkchocolade'],
    price: 11,
    featured: true,
    body: [
      block('Geteeld door de coöperatie Asorcafé op 1.700 meter hoogte. Een veelzijdige koffie die zowel als espresso als filter goed tot zijn recht komt.'),
    ],
  }),
  coffee({
    name: 'Brazilië Cerrado',
    slug: 'brazilie-cerrado',
    excerpt: 'Vol en nootachtig, met hazelnoot, cacao en een lage zuurgraad. Een echte allrounder.',
    image: image('1587734195503-904fca47e0e9', 'Witte kom gevuld met glanzende, donker gebrande koffiebonen'),
    origin: 'Brazilië',
    region: 'Cerrado Mineiro',
    process: 'natural',
    roastLevel: 'medium',
    tastingNotes: ['Hazelnoot', 'Cacao', 'Bruine suiker'],
    price: 9.5,
    body: [block('Natuurlijk verwerkte bonen van de familie Ferreira. Laag in zuur en daardoor ideaal met melk.')],
  }),
  coffee({
    name: 'Kenia Nyeri',
    slug: 'kenia-nyeri',
    excerpt: 'Sappig en helder, met zwarte bes, grapefruit en een lange, wijnachtige afdronk.',
    image: image('1521302080334-4bebac2763a6', 'Glazen kopje zwarte filterkoffie op een lichte ondergrond met een scherpe schaduw'),
    origin: 'Kenia',
    region: 'Nyeri',
    process: 'washed',
    roastLevel: 'light',
    tastingNotes: ['Zwarte bes', 'Grapefruit', 'Rode wijn'],
    price: 13.5,
    featured: true,
    body: [block('SL28- en SL34-variëteiten van de Gatomboya-fabriek. Een uitgesproken koffie voor wie van fruitig houdt.')],
  }),
  coffee({
    name: 'Guatemala Antigua',
    slug: 'guatemala-antigua',
    excerpt: 'Gebalanceerd en kruidig, met pure chocolade, sinaasappelschil en een vleugje kaneel.',
    image: image('1511920170033-f8396924c348', 'Drie portafilters op een grijze ondergrond met koffiebonen, gemalen koffie en een cappuccino'),
    origin: 'Guatemala',
    region: 'Antigua',
    process: 'honey',
    roastLevel: 'medium',
    tastingNotes: ['Pure chocolade', 'Sinaasappelschil', 'Kaneel'],
    price: 11.5,
    body: [block('Gegroeid in de vulkanische bodem rond Antigua. Door de honey-verwerking blijft een deel van het vruchtvlees aan de boon, wat zorgt voor extra zoetheid.')],
  }),
  coffee({
    name: 'Spaarne Huisblend',
    slug: 'spaarne-huisblend',
    excerpt: 'Onze vaste espressoblend: krachtig, chocoladeachtig en vergevingsgezind in elke machine.',
    image: image('1610889556528-9a770e32642f', 'Espresso met crema in een glazen kopje op een schoteltje met lepeltje'),
    origin: 'Brazilië en Colombia',
    region: 'Blend',
    process: 'natural',
    roastLevel: 'dark',
    tastingNotes: ['Pure chocolade', 'Geroosterde noten', 'Melasse'],
    price: 10,
    weight: 500,
    body: [
      block('De koffie die we zelf in het proeflokaal schenken. Zestig procent Brazilië Cerrado voor body, veertig procent Colombia Huila voor zoetheid.'),
      block('Zetadvies', 'h2'),
      block('Voor een dubbele espresso: 18 gram in, 36 gram uit in 27 tot 30 seconden.'),
    ],
  }),
]

const docs = [settings, home, about, coffeeIndex, contact, ...coffees]
const out = fileURLToPath(new URL('./production.ndjson', import.meta.url))
writeFileSync(out, docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`Wrote ${docs.length} documents to ${out}`)
