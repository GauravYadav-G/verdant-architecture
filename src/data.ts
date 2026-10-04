export type ArchProject = {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  location: string;
  coords: string;
  year: string;
  typology: string;
  area: string;
  elevation: string;
  orientation: string;
  image: string;
  blurb: string;
  narrative: string;
  materials: string[];
  metrics: [string, string][];
  cadKind: "courtyard" | "cantilever" | "cloister" | "pavilion";
};

export const projects: ArchProject[] = [
  {
    id: "casa",
    code: "V—01",
    name: "Casa del Viento",
    subtitle: "Monolith & Olive Court",
    location: "Serra de Tramuntana, Mallorca",
    coords: "39.7492° N, 2.6466° E",
    year: "2026",
    typology: "Private Residence",
    area: "640 m²",
    elevation: "+312 m ASL",
    orientation: "SSW 204°",
    image: "/images/v-hero.jpg",
    blurb: "Three travertine volumes anchored into a terraced limestone ridge, organized around a silent water court and a century-old olive tree.",
    narrative:
      "Conceived as a geological extension of the Tramuntana slope, Casa del Viento rejects exterior ornament in favor of calibrated aperture. Deep concrete reveals act as solar clocks, admitting a blade of direct light only at the equinox while keeping the interior eight degrees cooler than the Mediterranean air outside.",
    materials: ["Honed Roman Travertine", "Board-Formed White Concrete", "Untreated Brass", "Local Marès Limestone"],
    metrics: [
      ["Thermal MassLag", "11.4 hours"],
      ["Glazing Ratio", "22% N / 14% S"],
      ["Rainwater Capture", "84,000 L cistern"],
      ["Structural Grid", "4.80 × 4.80 m"],
    ],
    cadKind: "courtyard",
  },
  {
    id: "atelier",
    code: "V—02",
    name: "Atelier Alvalade",
    subtitle: "North-Light Timber Hall",
    location: "Lisbon, Portugal",
    coords: "38.7536° N, 9.1447° W",
    year: "2025",
    typology: "Adaptive Reuse & Studio",
    area: "920 m²",
    elevation: "+78 m ASL",
    orientation: "NNE 018°",
    image: "/images/v-studio.jpg",
    blurb: "A former 1950s typography foundry stripped to its raw concrete frame and crowned with sawtooth Douglas fir light-catchers.",
    narrative:
      "Our own Lisbon studio is an instrument for diffused daylight. By replacing the original corrugated roof with a rhythmic series of north-facing timber clerestories, the drafting hall remains shadowless from 08:00 to 18:00 — allowing models, stone samples, and drawings to be read in true color.",
    materials: ["In-Situ Cast Concrete", "Douglas Fir Glulam", "Linen Acoustic Baffles", "Hot-Rolled Black Steel"],
    metrics: [
      ["Daylight Factor", "6.8% uniform"],
      ["Clear Span", "14.40 m"],
      ["Reclaimed Mass", "82% original structure"],
      ["Acoustic RT60", "0.48 sec"],
    ],
    cadKind: "cantilever",
  },
  {
    id: "thermae",
    code: "V—03",
    name: "Thermae Valsura",
    subtitle: "Subterranean Bathhouse",
    location: "Alto Adige, Italy",
    coords: "46.6681° N, 11.1525° E",
    year: "2024",
    typology: "Hospitality & Thermal Bath",
    area: "1,480 m²",
    elevation: "+1,140 m ASL",
    orientation: "ESE 112°",
    image: "https://images.pexels.com/photos/37253405/pexels-photo-37253405.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    blurb: "Chiseled into alpine porphyry rock, a sequence of five acoustic and thermal chambers where steam, stone, and mountain water converge.",
    narrative:
      "Visitors descend twelve meters below the meadow line through a compressed rammed-earth passage before emerging into a forty-meter reflecting basin. Each chamber is tuned to a distinct temperature (14°C to 42°C) and reverberation profile, turning bathing into an architectural procession.",
    materials: ["Alpine Porphyry", "Rammed Dolomite Earth", "Brushed Bronze", "Larch Heartwood"],
    metrics: [
      ["Geothermal Recovery", "94% closed loop"],
      ["Excavated Stone Reused", "100% on site"],
      ["Water Basin Length", "40.00 m"],
      ["Wall Thickness", "0.90 m monolithic"],
    ],
    cadKind: "cloister",
  },
  {
    id: "pavilion",
    code: "V—04",
    name: "Pavilion Kōmyō",
    subtitle: "Tea & Moss Sanctuary",
    location: "Ukyō Ward, Kyoto",
    coords: "35.0167° N, 135.6767° E",
    year: "2024",
    typology: "Cultural Pavilion",
    area: "210 m²",
    elevation: "+142 m ASL",
    orientation: "SE 135°",
    image: "https://images.pexels.com/photos/32984282/pexels-photo-32984282.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    blurb: "A cantilevered cedar and charred-hinoki roof hovering above a wet moss garden, joined without a single ferrous fastener.",
    narrative:
      "Built in collaboration with third-generation miyadaiku joiners, Pavilion Kōmyō frames only the middle distance: the moss floor and the reflection of maple leaves on a basaltsill. The eaves project 3.6 meters beyond the tatami edge, sheltering an intermediate engawa zone that belongs to neither room nor forest.",
    materials: ["Charred Hinoki (Shou Sugi Ban)", "Kyoto Kitayama Cedar", "Hand-Troweled Soil Plaster", "Kurobe Basalt"],
    metrics: [
      ["Eave Cantilever", "3.60 m"],
      ["Joinery Nodes", "312 traditional kanawa"],
      ["Foundation", "18 floating basalt pads"],
      ["Embodied Carbon", "−410 kg CO₂/m²"],
    ],
    cadKind: "pavilion",
  },
];

export type MaterialSpecimen = {
  id: string;
  code: string;
  name: string;
  origin: string;
  density: string;
  conductivity: string;
  patina: string;
  notes: string;
  swatch: string;
  grain: string;
};

export const specimens: MaterialSpecimen[] = [
  {
    id: "travertine",
    code: "MAT—01",
    name: "Unfilled Roman Travertine",
    origin: "Tivoli Quarry, Lazio — Vein-Cut",
    density: "2,410 kg/m³",
    conductivity: "2.15 W/m·K",
    patina: "Pores deepen in tone; edges soften to a satin bone luster over 15 years.",
    notes: "Left open-pored and unresined so rain and footfalls register across the stone's sedimentary cavities.",
    swatch: "#dfd3be",
    grain: "#b9a78c",
  },
  {
    id: "concrete",
    code: "MAT—02",
    name: "Pozzolanic Lime Concrete",
    origin: "Site-batched with crushed local aggregate",
    density: "2,280 kg/m³",
    conductivity: "1.65 W/m·K",
    patina: "Develops a warm chalky efflorescence and micro-lichen crust on north faces.",
    notes: "Cast against rough-sawn 90mm pine boards; 40% cement clinker replaced with volcanic pozzolana.",
    swatch: "#c7c2b8",
    grain: "#8f8a80",
  },
  {
    id: "earth",
    code: "MAT—03",
    name: "Compacted Rammed Earth",
    origin: "Excavated subsoil — 120mm pneumatic lifts",
    density: "2,050 kg/m³",
    conductivity: "1.10 W/m·K",
    patina: "Surface clay washes away by 1mm in the first decade, exposing river gravel strata.",
    notes: "Hygroscopically buffers interior humidity between 45% and 55% RH without mechanical intervention.",
    swatch: "#b89b7c",
    grain: "#7d6349",
  },
  {
    id: "hinoki",
    code: "MAT—04",
    name: "Yakisugi Charred Cypress",
    origin: "Yoshino Forestry District — Kiln & Flamed",
    density: "510 kg/m³",
    conductivity: "0.12 W/m·K",
    patina: "Carbon layer silvers in direct sun while remaining impervious to rot, insects, and flame.",
    notes: "Flamed in three-board triangular chimneys, quenched in spring water, and brushed with camellia oil.",
    swatch: "#262421",
    grain: "#47433d",
  },
  {
    id: "brass",
    code: "MAT—05",
    name: "Sand-Cast CuZn37 Brass",
    origin: "Foundry-poured in Porto — Unlacquered",
    density: "8,440 kg/m³",
    conductivity: "115 W/m·K",
    patina: "Darkens to umber wherever untouched; polishes to pale gold along the exact arc of the human hand.",
    notes: "Used exclusively for thresholds, levers, and rainwater scuppers — the points where body meets building.",
    swatch: "#b38746",
    grain: "#7a5825",
  },
];

export const solarPresets = [
  { label: "Dawn", hour: 6.5, azimuth: "074° ENE", altitude: "14°", temp: "5,800 K", note: "Long grazing shadows reveal the board-marked texture of east-facing shear walls." },
  { label: "Equinox Noon", hour: 12.5, azimuth: "180° S", altitude: "62°", note: "Deep overhangs block direct radiation; the courtyard pool throws caustic ripples onto the soffit.", temp: "5,200 K" },
  { label: "Golden Hour", hour: 17.5, azimuth: "258° WSW", altitude: "19°", note: "Warm lateral light penetrates 11 meters into the travertine loggia, igniting brass thresholds.", temp: "3,400 K" },
  { label: "Nocturne", hour: 21.0, azimuth: "302° NW", altitude: "−12°", note: "Stored thermal mass radiates gently into the night air; submerged 2,200K linear grazers mark the water edge.", temp: "2,200 K" },
];

export const principles = [
  {
    n: "I",
    title: "Subtraction before addition",
    body: "Before drawing a wall, we measure what already exists on the site: the prevailing wind, the granite shelf, the shadow of a single carob tree at four in the afternoon.",
  },
  {
    n: "II",
    title: "Light as a structural material",
    body: "We treat daylight with the same load-bearing discipline as concrete or timber. An aperture is never a window — it is a calibrated cut that gives the room its clock.",
  },
  {
    n: "III",
    title: "Buildings that improve with weather",
    body: "We refuse synthetic coatings that freeze a building at completion day. Every surface we specify is chosen for how it will look after thirty winters of rain and touch.",
  },
];
