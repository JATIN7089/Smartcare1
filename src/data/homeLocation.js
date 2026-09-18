/**
 * SmarTCARE Wayfinding — "Mera ghar kaha hai?"
 * ============================================================
 * The single source of truth on the client for where HOME is, so the
 * find-home page and the assistant can answer even with no network
 * (the photo, the address and the landmarks are all offline assets).
 *
 * Mirrors the `home` record served by GET /api/home. Coordinates point at
 * the demo residence in Tezpur; the map views are built from them with
 * keyless providers (OpenStreetMap embed + Google Maps directions link).
 */

export const HOME = {
  label: 'Asha Sharma — Tezpur Ancestral Home',
  address: 'Tezpur Ancestral House, Near Chai Bagan Gate, Sonitpur, Tezpur, Assam 784001',
  lat: 26.6338,
  lng: 92.8000,
  photo: '/memories/home.jpg',
  landmarks: {
    en: [
      'The green wooden gate with the tulsi plant in the courtyard',
      'Two lanes after the Chai Bagan gate, on the left',
      'Behind the Sonitpur SDH road, near the tea garden quarters'
    ],
    hi: [
      'आँगन में तुलसी के पौधे वाला हरा लकड़ी का गेट',
      'चाय बागान गेट के बाद दो गलियाँ, बाईं ओर',
      'सोनितपुर SDH रोड के पीछे, चाय बागान क्वार्टर्स के पास'
    ]
  },
  contact: { name: 'Sunita Sharma (Daughter)', phone: '+91 98640 12345' }
};

/** Keyless OpenStreetMap embed centred on home, with a marker. */
export function osmEmbedUrl({ lat, lng } = HOME, span = 0.012) {
  const bbox = [lng - span, lat - span / 2, lng + span, lat + span / 2].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

export function osmLink({ lat, lng } = HOME) {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`;
}

/** Turn-by-turn directions in whatever map app the device prefers. */
export function directionsUrl({ lat, lng } = HOME) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}

/** Landmark lines in the user's language, falling back to English. */
export function landmarksFor(lang = 'en') {
  return HOME.landmarks[lang] || HOME.landmarks.en;
}

export default HOME;
