/**
 * North Eastern Region (NER) Cultural Knowledge Base & Game Assets
 * Covering all 8 states + General NER with rich icons, descriptions, and memory cards.
 * 
 * Note: Never assumes ethnicity automatically; respects user preference.
 */

export const NER_REGIONS = [
  { id: 'General NER', name: 'General North East', stateCode: 'NER', icon: 'MountainSnow', capital: 'Guwahati (Commercial Hub)' },
  { id: 'Assam', name: 'Assam (অসম)', stateCode: 'AS', icon: 'Coffee', capital: 'Dispur' },
  { id: 'Arunachal Pradesh', name: 'Arunachal Pradesh (অৰুণাচল প্ৰদেশ)', stateCode: 'AR', icon: 'Sunrise', capital: 'Itanagar' },
  { id: 'Manipur', name: 'Manipur (মণিপুৰ)', stateCode: 'MN', icon: 'Sparkles', capital: 'Imphal' },
  { id: 'Meghalaya', name: 'Meghalaya (মেঘালয়)', stateCode: 'ML', icon: 'CloudRain', capital: 'Shillong' },
  { id: 'Mizoram', name: 'Mizoram', stateCode: 'MZ', icon: 'Trees', capital: 'Aizawl' },
  { id: 'Nagaland', name: 'Nagaland', stateCode: 'NL', icon: 'Flame', capital: 'Kohima' },
  { id: 'Tripura', name: 'Tripura (ত্ৰিপুৰা)', stateCode: 'TR', icon: 'Landmark', capital: 'Agartala' },
  { id: 'Sikkim', name: 'Sikkim', stateCode: 'SK', icon: 'Flower2', capital: 'Gangtok' }
];

export const NER_CULTURAL_ITEMS = [
  // Assam
  {
    id: 'as-tea',
    region: 'Assam',
    name: 'Assam Tea Leaf & Cup',
    localName: 'অসম চাহ (Assam Chah)',
    category: 'Daily Life',
    fact: 'Assam produces world-famous bold, malty black tea from the fertile Brahmaputra valley.',
    iconName: 'Coffee',
    color: '#059669',
    bgColor: '#ecfdf5'
  },
  {
    id: 'as-gamosa',
    region: 'Assam',
    name: 'Traditional Gamosa',
    localName: 'ফুলাম গামোচা (Phulam Gamosa)',
    category: 'Textile & Respect',
    fact: 'The white and red handwoven towel representing profound respect, love, and cultural identity.',
    iconName: 'Scroll',
    color: '#dc2626',
    bgColor: '#fef2f2'
  },
  {
    id: 'as-jaapi',
    region: 'Assam',
    name: 'Assamese Jaapi',
    localName: 'জাপি (Jaapi)',
    category: 'Craft & Agriculture',
    fact: 'Traditional conical headgear woven from tight bamboo and Tokou leaves, adorned with red and black motifs.',
    iconName: 'Sun',
    color: '#d97706',
    bgColor: '#fffbeb'
  },
  {
    id: 'as-rhino',
    region: 'Assam',
    name: 'Kaziranga One-Horned Rhino',
    localName: 'এশিঙীয়া গঁড়',
    category: 'Fauna',
    fact: 'Kaziranga National Park is home to the world’s largest population of the magnificent great Indian one-horned rhinoceros.',
    iconName: 'Shield',
    color: '#475569',
    bgColor: '#f8fafc'
  },

  // Arunachal Pradesh
  {
    id: 'ar-hornbill',
    region: 'Arunachal Pradesh',
    name: 'Great Indian Hornbill',
    localName: 'ধনেশ পক্ষী',
    category: 'Fauna & Reverence',
    fact: 'Arunachal Pradesh’s state bird, deeply cherished in Nyishi and tribal folk legends and rituals.',
    iconName: 'Feather',
    color: '#eab308',
    bgColor: '#fefce8'
  },
  {
    id: 'ar-tawang',
    region: 'Arunachal Pradesh',
    name: 'Tawang Monastery',
    localName: 'Galden Namgey Lhatse',
    category: 'Heritage',
    fact: 'The second largest monastery in the world, founded in 1681 perched high in the Himalayan heights.',
    iconName: 'Landmark',
    color: '#b91c1c',
    bgColor: '#fef2f2'
  },

  // Manipur
  {
    id: 'mn-loktak',
    region: 'Manipur',
    name: 'Loktak Lake & Phumdis',
    localName: 'Loktak Pat',
    category: 'Nature & Landscape',
    fact: 'The largest freshwater lake in Northeast India, famous for circular floating biomass islands called Phumdis.',
    iconName: 'Waves',
    color: '#0284c7',
    bgColor: '#f0f9ff'
  },
  {
    id: 'mn-dance',
    region: 'Manipur',
    name: 'Manipuri Classical Dance',
    localName: 'Jagoi / Raas Leela',
    category: 'Arts & Culture',
    fact: 'Graceful, gentle movements with bell-shaped Kumil skirts portraying divine Radha and Krishna stories.',
    iconName: 'Sparkles',
    color: '#9333ea',
    bgColor: '#faf5ff'
  },

  // Meghalaya
  {
    id: 'ml-rootbridge',
    region: 'Meghalaya',
    name: 'Living Root Bridge',
    localName: 'Jingkieng Jri',
    category: 'Indigenous Engineering',
    fact: 'Grown by Khasi and Jaintia tribes over decades using aerial roots of the rubber fig tree (Ficus elastica).',
    iconName: 'GitBranch',
    color: '#15803d',
    bgColor: '#f0fdf4'
  },
  {
    id: 'ml-rain',
    region: 'Meghalaya',
    name: 'Cherrapunji & Mawsynram Rain',
    localName: 'Abode of Clouds',
    category: 'Nature',
    fact: 'The wettest place on Earth, where misty clouds wrap emerald hills in serene rainfall.',
    iconName: 'CloudRain',
    color: '#0891b2',
    bgColor: '#ecfeff'
  },

  // Mizoram
  {
    id: 'mz-cheraw',
    region: 'Mizoram',
    name: 'Cheraw Bamboo Dance',
    localName: 'Cheraw Kan',
    category: 'Folk Dance',
    fact: 'Dancers step rhythmically between horizontally clapped bamboo staves during joyous harvest festivals.',
    iconName: 'Music',
    color: '#c026d3',
    bgColor: '#fdf4ff'
  },
  {
    id: 'mz-puan',
    region: 'Mizoram',
    name: 'Mizo Puan Handloom',
    localName: 'Puanchei',
    category: 'Traditional Textile',
    fact: 'Intricate geometric woven skirts with black, red, and white patterns worn during Chapchar Kut celebrations.',
    iconName: 'Layers',
    color: '#e11d48',
    bgColor: '#fff1f2'
  },

  // Nagaland
  {
    id: 'nl-dzukou',
    region: 'Nagaland',
    name: 'Dzukou Valley',
    localName: 'The Valley of Celestial Flowers',
    category: 'Landscape',
    fact: 'A pristine high-altitude valley famous for the rare seasonal Dzukou Lily and rolling bamboo-grass hills.',
    iconName: 'Flower',
    color: '#16a34a',
    bgColor: '#f0fdf4'
  },
  {
    id: 'nl-shawl',
    region: 'Nagaland',
    name: 'Naga Warrior Shawl',
    localName: 'Tsungkotepsu / Rongsu',
    category: 'Craft & Honor',
    fact: 'Distinctive striped and animal-embroidered handwoven shawls unique to each Naga tribe.',
    iconName: 'ShieldAlert',
    color: '#b91c1c',
    bgColor: '#fef2f2'
  },

  // Tripura
  {
    id: 'tr-neermahal',
    region: 'Tripura',
    name: 'Neermahal Water Palace',
    localName: 'জলমহল (Twijilikma)',
    category: 'Royal Heritage',
    fact: 'The only floating palace in Eastern India, built inside the center of Rudrasagar Lake.',
    iconName: 'Castle',
    color: '#0369a1',
    bgColor: '#f0f9ff'
  },
  {
    id: 'tr-bamboo',
    region: 'Tripura',
    name: 'Tripura Cane & Bamboo Craft',
    localName: 'বাঁহ আৰু বেতৰ কাম',
    category: 'Artisanal Craft',
    fact: 'Masterful cane lamps, baskets, and mats reflecting generations of indigenous craftsmanship.',
    iconName: 'Package',
    color: '#b45309',
    bgColor: '#fffbeb'
  },

  // Sikkim
  {
    id: 'sk-kanchenjunga',
    region: 'Sikkim',
    name: 'Mount Kanchenjunga',
    localName: 'The Five Treasures of Snow',
    category: 'Sacred Mountain',
    fact: 'The third highest mountain in the world, revered as the sacred guardian deity of Sikkim.',
    iconName: 'MountainSnow',
    color: '#4338ca',
    bgColor: '#eef2ff'
  },
  {
    id: 'sk-temi',
    region: 'Sikkim',
    name: 'Temi Organic Tea Estate',
    localName: 'Temi Tarku',
    category: 'Agriculture',
    fact: 'Perched along rolling slopes beneath Kanchenjunga, producing world-acclaimed organic golden tips.',
    iconName: 'Leaf',
    color: '#047857',
    bgColor: '#ecfdf5'
  }
];

export const FAMILIAR_HOUSEHOLD_OBJECTS = [
  { id: 'obj-tea-cup', name: 'Brass Tea Cup (Chah Bati)', hint: 'Used every morning for warm milk tea', icon: 'Coffee', color: '#b45309' },
  { id: 'obj-bamboo-basket', name: 'Bamboo Basket (Dala / Tukuri)', hint: 'Woven cane container for fresh vegetables or betel leaves', icon: 'ShoppingBag', color: '#15803d' },
  { id: 'obj-textile', name: 'Handwoven Shawl / Gamosa', hint: 'Draped over shoulders for morning warmth or temple visit', icon: 'Scroll', color: '#dc2626' },
  { id: 'obj-rice-bowl', name: 'Brass Rice Bowl (Kahi-Bati)', hint: 'Traditional bell-metal dish for afternoon dal and rice', icon: 'UtensilsCrossed', color: '#ca8a04' },
  { id: 'obj-umbrella', name: 'Black Cane Umbrella (Shati)', hint: 'Kept near the front door for sudden monsoon showers', icon: 'Umbrella', color: '#0284c7' },
  { id: 'obj-fruits', name: 'Assam Lemon (Kaji Nemu)', hint: 'Fragrant oblong citrus squeezed over hot dal', icon: 'Sparkles', color: '#65a30d' }
];
