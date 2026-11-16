import {
  Apple,
  Carrot,
  Cookie,
  Droplets,
  Egg,
  Grape,
  LayoutGrid,
  Milk,
} from 'lucide-react'

export const categories = [
  { id: 'tots', label: 'Tots', icon: LayoutGrid },
  { id: 'horta', label: 'Horta', icon: Carrot },
  { id: 'fruita', label: 'Fruita', icon: Apple },
  { id: 'olis', label: 'Olis i conserves', icon: Droplets },
  { id: 'lactics', label: 'Làctics', icon: Milk },
  { id: 'mel', label: 'Mel i dolços', icon: Cookie },
  { id: 'granja', label: 'Granja', icon: Egg },
  { id: 'cellers', label: 'Cellers', icon: Grape },
]

export const products = [
  {
    id: 'tomatigues',
    name: 'Tomàquets de penjar',
    category: 'horta',
    categoryLabel: 'Horta',
    price: 3.9,
    unit: 'kg',
    tag: 'Temporada',
    rating: 4.9,
    reviews: 128,
    description:
      "Cultivats a l'hort de Bétera i collits aquest matí. Dolços, carnuts i plens de sabor.",
    image: '/images/products/tomatoes.svg',
  },
  {
    id: 'oli-oliva',
    name: "Oli d'oliva verge extra",
    category: 'olis',
    categoryLabel: 'Olis i conserves',
    price: 11.5,
    unit: 'l',
    tag: 'Ecològic',
    rating: 4.8,
    reviews: 96,
    description:
      "Primera premsada en fred de les oliveres del Maestrat. Afruitat, intens i amb cos.",
    image: '/images/products/olive-oil.svg',
  },
  {
    id: 'mel-romani',
    name: 'Mel de romaní',
    category: 'mel',
    categoryLabel: 'Mel i dolços',
    price: 8.9,
    unit: 'unitat',
    tag: 'Nou',
    rating: 5.0,
    reviews: 54,
    description:
      "Mel crua de les arnes de la Serra d'Espadà. Aroma floral i textura cremosa.",
    image: '/images/products/honey.svg',
  },
  {
    id: 'ous-corral',
    name: 'Ous de corral',
    category: 'granja',
    categoryLabel: 'Granja',
    price: 4.8,
    unit: 'dotzena',
    tag: 'Top vendes',
    rating: 4.9,
    reviews: 187,
    description:
      'Dotzena d’ous de gallines criades en llibertat a la masia de Benassal.',
    image: '/images/products/eggs.svg',
  },
  {
    id: 'formatge-cabra',
    name: 'Formatge de cabra',
    category: 'lactics',
    categoryLabel: 'Làctics',
    price: 12.4,
    unit: 'unitat',
    tag: 'Ecològic',
    rating: 4.7,
    reviews: 73,
    description:
      'Formatge artesà de cabra de Morella, curat 60 dies i amb un gust intens.',
    image: '/images/products/cheese.svg',
  },
  {
    id: 'taronges',
    name: 'Taronges de València',
    category: 'fruita',
    categoryLabel: 'Fruita',
    price: 2.6,
    unit: 'kg',
    tag: 'Top vendes',
    rating: 4.9,
    reviews: 215,
    description:
      'Taronges Navelina acabades de collir. Sucoses, dolces i ideals per a tota la família.',
    image: '/images/products/oranges.svg',
  },
  {
    id: 'ametlles',
    name: 'Ametlles Marcona',
    category: 'fruita',
    categoryLabel: 'Fruita seca',
    price: 9.2,
    unit: 'kg',
    tag: 'Temporada',
    rating: 4.8,
    reviews: 62,
    description:
      'Ametlles crues pelades de la Mariola. Cruixents, aromàtiques i sense sal afegida.',
    image: '/images/products/almonds.svg',
  },
  {
    id: 'vi-negre',
    name: 'Vi negre ecològic',
    category: 'cellers',
    categoryLabel: 'Cellers',
    price: 8.5,
    unit: 'ampolla',
    tag: 'Nou',
    rating: 4.6,
    reviews: 41,
    description:
      'Negre jove de garnatxa dels cellers de les Useres. Rodó, fresc i fàcil de beure.',
    image: '/images/products/wine.svg',
  },
]

export const formatPrice = (value) =>
  value.toFixed(2).replace('.', ',') + ' €'
