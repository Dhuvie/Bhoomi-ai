/**
 * Bhoomi mock data — realistic Indian agricultural context
 * Region: South Odisha / North Andhra Pradesh (mixed rice-pulses-cotton belt)
 * Coordinates around 19.07°N, 82.05°E
 */

export type Crop = "rice" | "cotton" | "groundnut" | "maize" | "pulses" | "sugarcane";

export const cropLabels: Record<Crop, Record<string, string>> = {
  rice: { en: "Rice", hi: "धान", or: "ଧାନ", te: "వరి" },
  cotton: { en: "Cotton", hi: "कपास", or: "କପାସ", te: "పత్తి" },
  groundnut: { en: "Groundnut", hi: "मूंगफली", or: "ବାଦାମ", te: "వేరుశనగ" },
  maize: { en: "Maize", hi: "मक्का", or: "ମକା", te: "మొక్కజొన్న" },
  pulses: { en: "Pulses", hi: "दलहन", or: "ଡାଲି", te: "పప్పులు" },
  sugarcane: { en: "Sugarcane", hi: "गन्ना", or: "ଆଖୁ", te: "చెరకు" },
};

export interface FieldBoundary {
  lat: number;
  lng: number;
}

export interface FieldStoryEvent {
  id: string;
  type: "planting" | "germination" | "vegetative" | "flowering" | "maturity" | "harvest" | "intervention";
  date: string; // ISO
  title: Record<string, string>;
  detail: Record<string, string>;
}

export interface Field {
  id: string;
  name: string;
  crop: Crop;
  areaAcres: number;
  boundary: FieldBoundary[];
  center: { lat: number; lng: number };
  healthScore: number; // 0-100
  healthTrend: "up" | "down" | "flat";
  ndvi: number; // -0.2 to 0.8 typical
  moisture: number; // %
  daysSincePlanting: number;
  growthStage: FieldStoryEvent["type"];
  lastUpdated: string;
  story: FieldStoryEvent[];
}

export const fields: Field[] = [
  {
    id: "f1",
    name: "Pedda Chetla",
    crop: "rice",
    areaAcres: 2.4,
    center: { lat: 19.0721, lng: 82.0489 },
    boundary: [
      { lat: 19.0728, lng: 82.0478 },
      { lat: 19.0734, lng: 82.0492 },
      { lat: 19.0718, lng: 82.0508 },
      { lat: 19.0712, lng: 82.0494 },
    ],
    healthScore: 78,
    healthTrend: "up",
    ndvi: 0.62,
    moisture: 68,
    daysSincePlanting: 47,
    growthStage: "vegetative",
    lastUpdated: "2026-07-23T08:14:00Z",
    story: [
      {
        id: "s1", type: "planting", date: "2026-06-06",
        title: { en: "Direct-seeded rice", hi: "सीधा बुवाई धान", or: "ସିଧା ବୁଣା ଧାନ", te: "నేరుగా విత్తిన వరి" },
        detail: { en: "Variety: Sahabhagi Dhan, seed rate 25 kg/acre", hi: "किस्म: सहभागी धान, 25 किग्रा/एकड़", or: "ପ୍ରକାର: ସହଭାଗୀ ଧାନ, ୨୫ କିଗ୍ରା/ଏକର", te: "రకం: సహభాగి ధాన్, 25 కిలో/ఎకరం" },
      },
      {
        id: "s2", type: "germination", date: "2026-06-12",
        title: { en: "Emergence", hi: "अंकुरण", or: "ଅଙ୍କୁରଣ", te: "మొలక" },
        detail: { en: "90% germination rate, uniform stand", hi: "90% अंकुरण, समान खड़ी फसल", or: "୯୦% ଅଙ୍କୁରଣ, ସମାନ ଫସଲ", te: "90% మొలక, సమానమైన పంట" },
      },
      {
        id: "s3", type: "intervention", date: "2026-06-25",
        title: { en: "First weeding", hi: "पहली निराई", or: "ପ୍ରଥମ ନିରାଇ", te: "మొదటి కలుపు తీత" },
        detail: { en: "Mechanical weeder, 4 hours labor", hi: "यांत्रिक निराई, 4 घंटे मजदूरी", or: "ଯାନ୍ତ୍ରିକ ନିରାଇ, ୪ ଘଣ୍ଟା", te: "యాంత్రిక కలుపు తీత, 4 గంటలు" },
      },
      {
        id: "s4", type: "vegetative", date: "2026-07-15",
        title: { en: "Tillering stage", hi: "कल्ले चरण", or: "କଲି ଅବସ୍ଥା", te: "కలుపు దశ" },
        detail: { en: "12 tillers per plant, on schedule", hi: "प्रति पौधा 12 कल्ले, समय पर", or: "ପ୍ରତି ଗଛ ୧୨ କଲି, ସମୟରେ", te: "మొక్కకు 12 కలుపులు, సమయంలో" },
      },
    ],
  },
  {
    id: "f2",
    name: "Chinna Boma",
    crop: "cotton",
    areaAcres: 1.6,
    center: { lat: 19.0654, lng: 82.0521 },
    boundary: [
      { lat: 19.0661, lng: 82.0512 },
      { lat: 19.0668, lng: 82.0530 },
      { lat: 19.0650, lng: 82.0538 },
      { lat: 19.0643, lng: 82.0520 },
    ],
    healthScore: 62,
    healthTrend: "down",
    ndvi: 0.41,
    moisture: 34,
    daysSincePlanting: 68,
    growthStage: "vegetative",
    lastUpdated: "2026-07-23T06:30:00Z",
    story: [
      {
        id: "s1", type: "planting", date: "2026-05-16",
        title: { en: "Cotton sowing", hi: "कपास बुवाई", or: "କପାସ ବୁଣା", te: "పత్తి విత్తనం" },
        detail: { en: "Bt cotton, hybrid BT-1", hi: "बीटी कपास, संकर BT-1", or: "ବିଟି କପାସ, ସଂକର BT-1", te: "బిటి పత్తి, హైబ్రిడ్ BT-1" },
      },
      {
        id: "s2", type: "intervention", date: "2026-06-10",
        title: { en: "Pink bollworm alert", hi: "गुलाबी सूंडी अलर्ट", or: "ଗୋଲାପୀ ପୋକ ଚେତାବନୀ", te: "గులాబీ పురుగు హెచ్చరిక" },
        detail: { en: "Pheromone trap count above threshold", hi: "फेरोमोन ट्रैप संख्या सीमा से ऊपर", or: "ଫେରୋମୋନ୍ ଟ୍ରାପ୍ ସଂଖ୍ୟା ସୀମା ଉପରେ", te: "ఫెరోమోన్ ట్రాప్ సంఖ్య పరిమితి పైన" },
      },
      {
        id: "s3", type: "vegetative", date: "2026-07-01",
        title: { en: "Squaring stage", hi: "कली चरण", or: "କଲି ଅବସ୍ଥା", te: "మొగ్గ దశ" },
        detail: { en: "Early squares forming, watch for aphids", hi: "शुरुआती कली, तेला देखें", or: "ପ୍ରାରମ୍ଭିକ କଲି, ପୋକ ଦେଖନ୍ତୁ", te: "మొదటి మొగ్గలు, ఆఫిడ్ కనిపెట్టు" },
      },
    ],
  },
  {
    id: "f3",
    name: "Matti Vadi",
    crop: "groundnut",
    areaAcres: 0.9,
    center: { lat: 19.0792, lng: 82.0418 },
    boundary: [
      { lat: 19.0798, lng: 82.0410 },
      { lat: 19.0804, lng: 82.0424 },
      { lat: 19.0788, lng: 82.0432 },
      { lat: 19.0782, lng: 82.0418 },
    ],
    healthScore: 85,
    healthTrend: "up",
    ndvi: 0.71,
    moisture: 52,
    daysSincePlanting: 35,
    growthStage: "vegetative",
    lastUpdated: "2026-07-23T07:45:00Z",
    story: [
      {
        id: "s1", type: "planting", date: "2026-06-18",
        title: { en: "Groundnut sowing", hi: "मूंगफली बुवाई", or: "ବାଦାମ ବୁଣା", te: "వేరుశనగ విత్తనం" },
        detail: { en: "Variety: Kadiri-6, 80 kg seed/acre", hi: "किस्म: कड़ीरी-6, 80 किग्रा/एकड़", or: "ପ୍ରକାର: କଡ଼ିରି-୬, ୮୦ କିଗ୍ରା/ଏକର", te: "రకం: కడిరి-6, 80 కిలో/ఎకరం" },
      },
      {
        id: "s2", type: "germination", date: "2026-06-25",
        title: { en: "Emergence complete", hi: "अंकुरण पूर्ण", or: "ଅଙ୍କୁରଣ ସମ୍ପୂର୍ଣ୍ଣ", te: "మొలక పూర్తయింది" },
        detail: { en: "Healthy stand, 92% emergence", hi: "स्वस्थ फसल, 92% अंकुरण", or: "ସ୍ୱସ୍ଥ ଫସଲ, ୯୨% ଅଙ୍କୁରଣ", te: "ఆరోగ్యకరమైన పంట, 92% మొలక" },
      },
    ],
  },
];

export interface WeatherCurrent {
  tempC: number;
  feelsLikeC: number;
  condition: "clear" | "cloudy" | "overcast" | "rain" | "storm" | "fog" | "haze";
  humidity: number;
  windKmh: number;
  windDir: string;
  uvIndex: number;
  rainfallMm: number;
  updatedAt: string;
}

export interface WeatherDay {
  date: string;
  highC: number;
  lowC: number;
  condition: WeatherCurrent["condition"];
  rainfallMm: number;
  windKmh: number;
}

export const weatherNow: WeatherCurrent = {
  tempC: 28,
  feelsLikeC: 32,
  condition: "haze",
  humidity: 74,
  windKmh: 12,
  windDir: "SW",
  uvIndex: 7,
  rainfallMm: 0,
  updatedAt: "2026-07-23T09:30:00Z",
};

export const forecast7: WeatherDay[] = [
  { date: "2026-07-23", highC: 31, lowC: 24, condition: "haze", rainfallMm: 0, windKmh: 12 },
  { date: "2026-07-24", highC: 30, lowC: 23, condition: "cloudy", rainfallMm: 4, windKmh: 16 },
  { date: "2026-07-25", highC: 28, lowC: 22, condition: "rain", rainfallMm: 28, windKmh: 22 },
  { date: "2026-07-26", highC: 27, lowC: 22, condition: "rain", rainfallMm: 42, windKmh: 24 },
  { date: "2026-07-27", highC: 29, lowC: 23, condition: "overcast", rainfallMm: 8, windKmh: 18 },
  { date: "2026-07-28", highC: 31, lowC: 24, condition: "cloudy", rainfallMm: 2, windKmh: 14 },
  { date: "2026-07-29", highC: 32, lowC: 25, condition: "clear", rainfallMm: 0, windKmh: 10 },
];

export interface SoilReading {
  nitrogenPpm: number; // 0-200 typical
  phosphorusPpm: number; // 0-80 typical (Olsen)
  potassiumPpm: number; // 0-400 typical
  pH: number;
  moisture: number; // %
  organicCarbon: number; // %
  cec: number; // cation exchange capacity, cmol/kg
  sampledAt: string;
  layers: {
    topsoil: { depthCm: number; n: number; p: number; k: number; moisture: number };
    subsoil: { depthCm: number; n: number; p: number; k: number; moisture: number };
    regolith: { depthCm: number; n: number; p: number; k: number; moisture: number };
  };
}

export const soilReading: SoilReading = {
  nitrogenPpm: 142,
  phosphorusPpm: 18,
  potassiumPpm: 168,
  pH: 6.3,
  moisture: 41,
  organicCarbon: 0.62,
  cec: 11.4,
  sampledAt: "2026-07-15",
  layers: {
    topsoil: { depthCm: 15, n: 142, p: 18, k: 168, moisture: 41 },
    subsoil: { depthCm: 35, n: 96, p: 9, k: 124, moisture: 33 },
    regolith: { depthCm: 70, n: 48, p: 4, k: 88, moisture: 22 },
  },
};

interface YieldForecastPoint {
  date: string;
  low: number;
  expected: number;
  high: number;
}

export interface YieldForecast {
  fieldId: string;
  crop: Crop;
  expectedQt: number; // quintal per acre
  lowQt: number;
  highQt: number;
  confidence: number; // 0-1
  factors: Array<{
    label: { en: string; hi: string; or: string; te: string };
    impact: "positive" | "negative" | "neutral";
    weight: number; // 0-1
  }>;
  history: YieldForecastPoint[];
  generatedAt: string;
}

export const yieldForecasts: YieldForecast[] = [
  {
    fieldId: "f1",
    crop: "rice",
    expectedQt: 22.4,
    lowQt: 19.8,
    highQt: 24.6,
    confidence: 0.74,
    factors: [
      { label: { en: "Healthy NDVI", hi: "अच्छा NDVI", or: "ଭଲ NDVI", te: "మంచి NDVI" }, impact: "positive", weight: 0.32 },
      { label: { en: "Soil nitrogen", hi: "मिट्टी नाइट्रोजन", or: "ମାଟି ନାଇଟ୍ରୋଜେନ୍", te: "నేల నత్రజని" }, impact: "positive", weight: 0.18 },
      { label: { en: "Monsoon onset", hi: "मानसून शुरुआत", or: "ମନ୍ୱର ଆରମ୍ଭ", te: "వర్షాకాల ప్రారంభం" }, impact: "positive", weight: 0.24 },
      { label: { en: "Blast risk", hi: "ब्लास्ट जोखिम", or: "ବ୍ଲାଷ୍ଟ୍ ସଙ୍କଟ", te: "బ్లాస్ట్ ప్రమాదం" }, impact: "negative", weight: 0.16 },
      { label: { en: "Weed pressure", hi: "खरपतवार दबाव", or: "ଅନାବନା ଦବାଣି", te: "కలుపు ఒత్తిడి" }, impact: "negative", weight: 0.10 },
    ],
    history: [
      { date: "2026-06-20", low: 18, expected: 21, high: 24 },
      { date: "2026-07-01", low: 19, expected: 21.8, high: 24.2 },
      { date: "2026-07-10", low: 19.5, expected: 22.1, high: 24.4 },
      { date: "2026-07-23", low: 19.8, expected: 22.4, high: 24.6 },
    ],
    generatedAt: "2026-07-23T08:00:00Z",
  },
  {
    fieldId: "f2",
    crop: "cotton",
    expectedQt: 8.2,
    lowQt: 6.4,
    highQt: 10.1,
    confidence: 0.58,
    factors: [
      { label: { en: "Pink bollworm pressure", hi: "गुलाबी सूंडी दबाव", or: "ଗୋଲାପୀ ପୋକ ଦବାଣି", te: "గులాబీ పురుగు ఒత్తిడి" }, impact: "negative", weight: 0.38 },
      { label: { en: "Low moisture", hi: "कम नमी", or: "କମ୍ ଆର୍ଦ୍ରତା", te: "తక్కువ తేమ" }, impact: "negative", weight: 0.28 },
      { label: { en: "Squaring on time", hi: "समय पर कली", or: "ସମୟରେ କଲି", te: "సమయంలో మొగ్గ" }, impact: "positive", weight: 0.20 },
      { label: { en: "Soil potassium", hi: "मिट्टी पोटेशियम", or: "ମାଟି ପୋଟାସିୟମ୍", te: "నేల పొటాషియం" }, impact: "positive", weight: 0.14 },
    ],
    history: [
      { date: "2026-06-20", low: 7, expected: 9, high: 11 },
      { date: "2026-07-01", low: 6.8, expected: 8.8, high: 10.8 },
      { date: "2026-07-10", low: 6.6, expected: 8.5, high: 10.4 },
      { date: "2026-07-23", low: 6.4, expected: 8.2, high: 10.1 },
    ],
    generatedAt: "2026-07-23T08:00:00Z",
  },
  {
    fieldId: "f3",
    crop: "groundnut",
    expectedQt: 9.6,
    lowQt: 8.8,
    highQt: 10.4,
    confidence: 0.81,
    factors: [
      { label: { en: "Excellent NDVI", hi: "उत्कृष्ट NDVI", or: "ଉତ୍କୃଷ୍ଟ NDVI", te: "అద్భుతమైన NDVI" }, impact: "positive", weight: 0.40 },
      { label: { en: "Adequate rainfall", hi: "पर्याप्त बारिश", or: "ପର୍ଯ୍ୟାପ୍ତ ବର୍ଷା", te: "తగిన వర్షం" }, impact: "positive", weight: 0.26 },
      { label: { en: "Soil pH balanced", hi: "मिट्टी pH संतुलित", or: "ମାଟି pH ସନ୍ତୁଳିତ", te: "నేల pH సమతుల్యం" }, impact: "positive", weight: 0.22 },
      { label: { en: "Tikka spot risk", hi: "टिक्का धब्बा जोखिम", or: "ଟିକା ଦାଗ ସଙ୍କଟ", te: "టిక్కా మచ్చ ప్రమాదం" }, impact: "negative", weight: 0.12 },
    ],
    history: [
      { date: "2026-06-25", low: 8.2, expected: 9.0, high: 9.8 },
      { date: "2026-07-05", low: 8.6, expected: 9.3, high: 10.1 },
      { date: "2026-07-15", low: 8.8, expected: 9.5, high: 10.3 },
      { date: "2026-07-23", low: 8.8, expected: 9.6, high: 10.4 },
    ],
    generatedAt: "2026-07-23T08:00:00Z",
  },
];

export interface PriceQuote {
  crop: Crop;
  market: string;
  pricePerQt: number;
  changePct: number;
  trend: "up" | "down" | "flat";
  updatedAt: string;
  unit: string;
  sparkline: number[];
}

export const priceQuotes: PriceQuote[] = [
  { crop: "rice", market: "Bobbili", pricePerQt: 2480, changePct: 1.2, trend: "up", updatedAt: "2026-07-23T08:55:00Z", unit: "₹/qt", sparkline: [2410, 2430, 2420, 2450, 2468, 2480] },
  { crop: "cotton", market: "Salur", pricePerQt: 7240, changePct: -2.1, trend: "down", updatedAt: "2026-07-23T08:55:00Z", unit: "₹/qt", sparkline: [7520, 7480, 7410, 7360, 7280, 7240] },
  { crop: "groundnut", market: "Parvathipuram", pricePerQt: 6180, changePct: 0.4, trend: "flat", updatedAt: "2026-07-23T08:55:00Z", unit: "₹/qt", sparkline: [6100, 6140, 6120, 6150, 6170, 6180] },
  { crop: "maize", market: "Vizianagaram", pricePerQt: 1965, changePct: 0.8, trend: "up", updatedAt: "2026-07-23T08:55:00Z", unit: "₹/qt", sparkline: [1930, 1942, 1940, 1955, 1960, 1965] },
  { crop: "pulses", market: "Bobbili", pricePerQt: 5420, changePct: 2.3, trend: "up", updatedAt: "2026-07-23T08:55:00Z", unit: "₹/qt", sparkline: [5280, 5310, 5340, 5380, 5400, 5420] },
  { crop: "sugarcane", market: "Salur", pricePerQt: 320, changePct: 0, trend: "flat", updatedAt: "2026-07-23T08:55:00Z", unit: "₹/qt", sparkline: [320, 320, 320, 320, 320, 320] },
];

export interface Alert {
  id: string;
  severity: "high" | "medium" | "low";
  fieldId?: string;
  type: "weather" | "pest" | "soil" | "market";
  titleKey: string;
  titleFallback: string;
  detail: { en: string; hi: string; or: string; te: string };
  timestamp: string;
  actionKey?: string;
}

export const alerts: Alert[] = [
  {
    id: "a1",
    severity: "high",
    fieldId: "f2",
    type: "pest",
    titleKey: "alert.pest.risk",
    titleFallback: "High pest risk detected",
    detail: {
      en: "Pink bollworm trap count above threshold in Chinna Boma. Inspect squares and apply need-based spray.",
      hi: "चिन्ना बोमा में गुलाबी सूंडी ट्रैप संख्या सीमा से ऊपर। कली जांचें और आवश्यक स्प्रे करें।",
      or: "ଚିନ୍ନା ବୋମାରେ ଗୋଲାପୀ ପୋକ ଟ୍ରାପ୍ ସଂଖ୍ୟା ସୀମା ଉପରେ। କଲି ଯାଞ୍ଚ କରନ୍ତୁ।",
      te: "చిన్నా బోమాలో గులాబీ పురుగు ట్రాప్ సంఖ్య పరిమితి పైన. మొగ్గలు తనిఖీ చేయండి.",
    },
    timestamp: "2026-07-23T07:14:00Z",
  },
  {
    id: "a2",
    severity: "high",
    type: "weather",
    titleKey: "alert.heavyRain",
    titleFallback: "Heavy rain in 48 hours",
    detail: {
      en: "42-70 mm rainfall expected July 25-26 across the region. Drainage channels in low-lying rice fields should be cleared now.",
      hi: "25-26 जुलाई को 42-70 मिमी बारिश। निचले धान खेतों के नाले अभी साफ करें।",
      or: "୨୫-୨୬ ଜୁଲାଇରେ ୪୨-୭୦ ମିମି ବର୍ଷା। ନିମ୍ନ ଧାନ କ୍ଷେତ୍ରର ନାଳ ସଫା କରନ୍ତୁ।",
      te: "జూలై 25-26న 42-70 మిమీ వర్షం. దిగువ వరి పొలాల కాల్వలు ఇప్పుడు శుభ్రం చేయండి.",
    },
    timestamp: "2026-07-23T05:42:00Z",
  },
  {
    id: "a3",
    severity: "medium",
    fieldId: "f1",
    type: "pest",
    titleKey: "alert.pest.risk",
    titleFallback: "Rice blast monitoring",
    detail: {
      en: "High humidity and cool nights favor rice blast in Pedda Chetla. Scout daily for leaf lesions over next 10 days.",
      hi: "उच्च नमी और ठंडी रातें पेड्डा चेतला में ब्लास्ट की संभावना। 10 दिनों तक निगरानी रखें।",
      or: "ଉଚ୍ଚ ଆର୍ଦ୍ରତା ଓ ଥଣ୍ଡା ରାତି ପେଦ୍ଦା ଚେତ୍ଲାରେ ବ୍ଲାଷ୍ଟ୍ ସମ୍ଭାବନା। ୧୦ ଦିନ ନିରୀକ୍ଷଣ।",
      te: "అధిక తేమ, చల్లని రాత్రులు పెద్ద చెట్లలో బ్లాస్ట్ అవకాశం. 10 రోజులు పర్యవేక్షణ.",
    },
    timestamp: "2026-07-23T04:00:00Z",
  },
];

interface DiagnosisTreatment {
  id: string;
  text: { en: string; hi: string; or: string; te: string };
  done?: boolean;
}

export interface DiagnosisResult {
  id: string;
  diseaseEn: string;
  diseaseLocal: { en: string; hi: string; or: string; te: string };
  confidence: number; // 0-1
  severity: "low" | "medium" | "high";
  confidenceLabel: "low" | "med" | "high" | "veryHigh";
  treatments: DiagnosisTreatment[];
  moreInfoUrl?: string;
}

// Library of mock diagnoses for different "detections"
export const diagnosisLibrary: DiagnosisResult[] = [
  {
    id: "rice-blast",
    diseaseEn: "Rice Blast",
    diseaseLocal: {
      en: "Rice Blast (Magnaporthe oryzae)",
      hi: "धान ब्लास्ट (मैग्नापोर्थे ओराइज़ा)",
      or: "ଧାନ ବ୍ଲାଷ୍ଟ୍ (ମ୍ୟାଗ୍ନାପର୍ଥେ ଓରାଇଜା)",
      te: "వరి బ్లాస్ట్ (మాగ్నాపోర్థే ఒరైజా)",
    },
    confidence: 0.87,
    severity: "high",
    confidenceLabel: "high",
    treatments: [
      { id: "t1", text: { en: "Apply Tricyclazole 0.6 g/L as foliar spray", hi: "ट्राइसाइक्लाज़ोल 0.6 ग्रा/ली स्प्रे करें", or: "ଟ୍ରାଇସାଇକ୍ଲାଜୋଲ୍ ୦.୬ ଗ୍ରା/ଲି ସ୍ପ୍ରେ", te: "ట్రైసైక్లాజోల్ 0.6 గ్రా/లీ స్ప్రే" } },
      { id: "t2", text: { en: "Drain field for 2-3 days, then reflood", hi: "2-3 दिन पानी निकालें, फिर भरें", or: "୨-୩ ଦିନ ପାଣି ନିକାଳନ୍ତୁ, ପରେ ଭରନ୍ତୁ", te: "2-3 రోజులు నీరు తీయండి, తర్వాత నింపండి" } },
      { id: "t3", text: { en: "Avoid excess nitrogen — split doses", hi: "अतिरिक्त नाइट्रोजन नहीं — खुराक बांटें", or: "ଅତିରିକ୍ତ ନାଇଟ୍ରୋଜେନ୍ ନୁହେଁ — ମାତ୍ରା ବାଣ୍ଟନ୍ତୁ", te: "అదనపు నత్రజని వద్దు — మోతాదును విభజించు" } },
      { id: "t4", text: { en: "Inspect neighboring fields in 7 days", hi: "7 दिन में पड़ोसी खेत जांचें", or: "୭ ଦିନରେ ପଡ଼ୋଶୀ କ୍ଷେତ୍ର ଯାଞ୍ଚ", te: "7 రోజుల్లో సమీప పొలాలు తనిఖీ" } },
    ],
  },
  {
    id: "leaf-spot",
    diseaseEn: "Tikka Leaf Spot",
    diseaseLocal: {
      en: "Tikka Leaf Spot (Cercospora arachidicola)",
      hi: "टिक्का पत्ती धब्बा (सेरकोस्पोरा)",
      or: "ଟିକା ପତ୍ର ଦାଗ (ସେରକୋସ୍ପୋରା)",
      te: "టిక్కా ఆకు మచ్చ (సెర్కోస్పోరా)",
    },
    confidence: 0.72,
    severity: "medium",
    confidenceLabel: "med",
    treatments: [
      { id: "t1", text: { en: "Spray Chlorothalonil 2 g/L at first sign", hi: "क्लोरोथैलोनिल 2 ग्रा/ली स्प्रे करें", or: "କ୍ଲୋରୋଥାଲୋନିଲ୍ ୨ ଗ୍ରା/ଲି ସ୍ପ୍ରେ", te: "క్లోరోథలోనిల్ 2 గ్రా/లీ స్ప్రే" } },
      { id: "t2", text: { en: "Improve field drainage to reduce humidity", hi: "नमी कम करने के लिए जल निकास सुधारें", or: "ଆର୍ଦ୍ରତା କମ୍ କରିବାକୁ ଜଳ ନିଷ୍କାସନ ଉନ୍ନୟନ", te: "తేమ తగ్గించడానికి కాల్వలు మెరుగుపరచు" } },
      { id: "t3", text: { en: "Remove heavily infected leaves by hand", hi: "संक्रमित पत्तियां हाथ से हटाएं", or: "ସଂକ୍ରମିତ ପତ୍ର ହାତରେ ହଟାନ୍ତୁ", te: "సోకిన ఆకులు చేతితో తీయండి" } },
    ],
  },
  {
    id: "cotton-bollworm",
    diseaseEn: "Pink Bollworm Damage",
    diseaseLocal: {
      en: "Pink Bollworm (Pectinophora gossypiella)",
      hi: "गुलाबी सूंडी (पेक्टिनोफोरा)",
      or: "ଗୋଲାପୀ ପୋକ (ପେକ୍ଟିନୋଫୋରା)",
      te: "గులాబీ పురుగు (పెక్టినోఫోరా)",
    },
    confidence: 0.91,
    severity: "high",
    confidenceLabel: "veryHigh",
    treatments: [
      { id: "t1", text: { en: "Install 8 pheromone traps per acre", hi: "प्रति एकड़ 8 फेरोमोन ट्रैप लगाएं", or: "ପ୍ରତି ଏକର ୮ ଫେରୋମୋନ୍ ଟ୍ରାପ୍", te: "ఎకరానికి 8 ఫెరోమోన్ ట్రాప్‌లు" } },
      { id: "t2", text: { en: "Spray neem oil 5 ml/L + Bacillus thuringiensis", hi: "नीम तेल 5 मिली/ली + बीटी स्प्रे", or: "ନିମ୍ ତେଲ ୫ ମିଲି/ଲି + ବିଟି ସ୍ପ୍ରେ", te: "వేప నూనె 5 మిలీ/లీ + బిటి" } },
      { id: "t3", text: { en: "Pick and destroy infested squares/bolls", hi: "संक्रमित कली तोड़कर नष्ट करें", or: "ସଂକ୍ରମିତ କଲି ତୋଡ଼ି ନଷ୍ଟ କରନ୍ତୁ", te: "సోకిన మొగ్గలు తీసి నాశనం చేయండి" } },
      { id: "t4", text: { en: "Avoid pyrethroid — resistance reported locally", hi: "पाइरेथ्रॉइड से बचें — स्थानीय प्रतिरोध", or: "ପାଇରେଥ୍ରଏଡ୍ ଠାରୁ ଦୂରେଇ — ସ୍ଥାନୀୟ ପ୍ରତିରୋଧ", te: "పైరెథ్రాయిడ్ వద్దు — స్థానిక నిరోధకత" } },
    ],
  },
];
