/**
 * Bhoomi i18n — English, Hindi, Odia, Telugu
 * Native script labels throughout. No transliteration fallbacks.
 */

export type Locale = "en" | "hi" | "or" | "te";

export const LOCALES: { code: Locale; label: string; englishName: string; dir: "ltr" }[] = [
  { code: "en", label: "English", englishName: "English", dir: "ltr" },
  { code: "hi", label: "हिंदी", englishName: "Hindi", dir: "ltr" },
  { code: "or", label: "ଓଡ଼ିଆ", englishName: "Odia", dir: "ltr" },
  { code: "te", label: "తెలుగు", englishName: "Telugu", dir: "ltr" },
];

export type TranslationKey =
  | "app.tagline"
  // Nav
  | "nav.dashboard"
  | "nav.fields"
  | "nav.diagnose"
  | "nav.insights"
  | "nav.market"
  | "nav.voice"
  | "nav.settings"
  | "nav.alerts"
  // Sync states
  | "sync.queued"
  | "sync.syncing"
  | "sync.confirmed"
  | "sync.offline"
  // Common
  | "common.estimate"
  | "common.loading"
  | "common.error"
  | "common.cancel"
  | "common.save"
  | "common.close"
  | "common.confirm"
  | "common.viewDetails"
  | "common.high"
  | "common.medium"
  | "common.low"
  | "common.confidence"
  | "common.aiEstimate"
  // Dashboard
  | "dash.greeting.morning"
  | "dash.greeting.afternoon"
  | "dash.greeting.evening"
  | "dash.weather.now"
  | "dash.weather.feelsLike"
  | "dash.weather.forecast7day"
  | "dash.fieldHealth"
  | "dash.urgentAlerts"
  | "dash.marketMovers"
  | "dash.noAlerts"
  // Fields
  | "fields.title"
  | "fields.boundaryHint"
  | "fields.clearBoundary"
  | "fields.saveBoundary"
  | "fields.story"
  | "fields.healthPulse"
  | "fields.crop"
  | "fields.area"
  | "fields.lastUpdated"
  | "fields.addField"
  // Diagnose
  | "diag.title"
  | "diag.liveScan"
  | "diag.upload"
  | "diag.pointAtLeaf"
  | "diag.capture"
  | "diag.analyzing"
  | "diag.treatment"
  | "diag.severity"
  | "diag.likelyCause"
  | "diag.lowConfidence"
  | "diag.medConfidence"
  | "diag.highConfidence"
  | "diag.veryHighConfidence"
  | "diag.noDetection"
  | "diag.startScan"
  // Insights — Yield
  | "insights.yield.title"
  | "insights.yield.subtitle"
  | "insights.yield.range"
  | "insights.yield.expected"
  | "insights.yield.factors"
  // Insights — Soil
  | "insights.soil.title"
  | "insights.soil.subtitle"
  | "insights.soil.nitrogen"
  | "insights.soil.phosphorus"
  | "insights.soil.potassium"
  | "insights.soil.ph"
  | "insights.soil.moisture"
  | "insights.soil.recommendations"
  | "insights.soil.topsoil"
  | "insights.soil.subsoil"
  | "insights.soil.regolith"
  // Market
  | "market.title"
  | "market.subtitle"
  | "market.trend.up"
  | "market.trend.down"
  | "market.trend.flat"
  | "market.lastUpdate"
  | "market.yourCrops"
  // Voice
  | "voice.processing"
  | "voice.tapHold"
  // Settings
  | "settings.title"
  | "settings.language"
  | "settings.theme"
  | "settings.theme.light"
  | "settings.theme.dark"
  | "settings.sound"
  | "settings.soundDesc"
  | "settings.haptics"
  | "settings.hapticsDesc"
  | "settings.dataSaver"
  | "settings.dataSaverDesc"
  // Alerts
  | "alert.pest.risk"
  | "alert.heavyRain"
  | "alert.dismiss"
  | "alert.viewAll"
  // Story timeline
  | "story.planting"
  | "story.germination"
  | "story.vegetative"
  | "story.flowering"
  | "story.maturity"
  | "story.harvest"
  | "story.intervention"
  | "story.today";

type Dict = Record<TranslationKey, string>;

const en: Dict = {
  "app.tagline": "Field intelligence, in your language",
  "nav.dashboard": "Dashboard",
  "nav.fields": "Fields",
  "nav.diagnose": "Diagnose",
  "nav.insights": "Insights",
  "nav.market": "Market",
  "nav.voice": "Voice",
  "nav.settings": "Settings",
  "nav.alerts": "Alerts",
  "sync.queued": "Queued",
  "sync.syncing": "Syncing",
  "sync.confirmed": "Confirmed",
  "sync.offline": "Offline",
  "common.estimate": "AI estimate",
  "common.loading": "Loading",
  "common.error": "Something went wrong",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.close": "Close",
  "common.confirm": "Confirm",
  "common.viewDetails": "View details",
  "common.high": "High",
  "common.medium": "Medium",
  "common.low": "Low",
  "common.confidence": "Confidence",
  "common.aiEstimate": "AI estimate — not a guarantee",
  "dash.greeting.morning": "Good morning",
  "dash.greeting.afternoon": "Good afternoon",
  "dash.greeting.evening": "Good evening",
  "dash.weather.now": "Now",
  "dash.weather.feelsLike": "Feels like",
  "dash.weather.forecast7day": "7-day forecast",
  "dash.fieldHealth": "Field health",
  "dash.urgentAlerts": "Urgent alerts",
  "dash.marketMovers": "Market movers",
  "dash.noAlerts": "All clear — no alerts right now",
  "fields.title": "Fields",
  "fields.boundaryHint": "Tap to add vertices, double-tap to close",
  "fields.clearBoundary": "Clear",
  "fields.saveBoundary": "Save boundary",
  "fields.story": "Season story",
  "fields.healthPulse": "Health pulse",
  "fields.crop": "Crop",
  "fields.area": "Area",
  "fields.lastUpdated": "Updated",
  "fields.addField": "Add field",
  "diag.title": "Diagnose",
  "diag.liveScan": "Live scan",
  "diag.upload": "Upload photo",
  "diag.pointAtLeaf": "Point your camera at a leaf",
  "diag.capture": "Capture",
  "diag.analyzing": "Analyzing leaf",
  "diag.treatment": "Treatment checklist",
  "diag.severity": "Severity",
  "diag.likelyCause": "Likely cause",
  "diag.lowConfidence": "Possible match — confirm visually",
  "diag.medConfidence": "Likely match — review symptoms below",
  "diag.highConfidence": "Strong match — treatment recommended",
  "diag.veryHighConfidence": "Very strong match",
  "diag.noDetection": "No disease detected in frame",
  "diag.startScan": "Start camera scan",
  "insights.yield.title": "Yield forecast",
  "insights.yield.subtitle": "Forecast from your field, weather, and soil data",
  "insights.yield.range": "Likely range",
  "insights.yield.expected": "Most likely",
  "insights.yield.factors": "What's driving this",
  "insights.soil.title": "Soil analysis",
  "insights.soil.subtitle": "From your latest soil test",
  "insights.soil.nitrogen": "Nitrogen",
  "insights.soil.phosphorus": "Phosphorus",
  "insights.soil.potassium": "Potassium",
  "insights.soil.ph": "pH",
  "insights.soil.moisture": "Moisture",
  "insights.soil.recommendations": "Crop recommendations",
  "insights.soil.topsoil": "Topsoil",
  "insights.soil.subsoil": "Subsoil",
  "insights.soil.regolith": "Regolith",
  "market.title": "Market prices",
  "market.subtitle": "Live mandi rates, your crops first",
  "market.trend.up": "Up",
  "market.trend.down": "Down",
  "market.trend.flat": "Flat",
  "market.lastUpdate": "Updated",
  "market.yourCrops": "Your crops",
  "voice.processing": "Thinking",
  "voice.tapHold": "Tap and hold to ask",
  "settings.title": "Settings",
  "settings.language": "Language",
  "settings.theme": "Appearance",
  "settings.theme.light": "Light",
  "settings.theme.dark": "Dark",
  "settings.sound": "Alert sound",
  "settings.soundDesc": "Chime only for severe weather & high pest risk",
  "settings.haptics": "Haptics",
  "settings.hapticsDesc": "Vibration on key actions",
  "settings.dataSaver": "Data saver",
  "settings.dataSaverDesc": "Reduce satellite imagery on mobile data",
  "alert.pest.risk": "High pest risk detected",
  "alert.heavyRain": "Heavy rain in 48 hours",
  "alert.dismiss": "Dismiss",
  "alert.viewAll": "View all",
  "story.planting": "Planting",
  "story.germination": "Germination",
  "story.vegetative": "Vegetative",
  "story.flowering": "Flowering",
  "story.maturity": "Maturity",
  "story.harvest": "Harvest",
  "story.intervention": "Intervention",
  "story.today": "Today",
};

const hi: Dict = {
  "app.tagline": "खेत की समझदारी, आपकी भाषा में",
  "nav.dashboard": "डैशबोर्ड",
  "nav.fields": "खेत",
  "nav.diagnose": "जांच",
  "nav.insights": "जानकारी",
  "nav.market": "बाजार",
  "nav.voice": "आवाज़",
  "nav.settings": "सेटिंग्स",
  "nav.alerts": "अलर्ट",
  "sync.queued": "कतार में",
  "sync.syncing": "सिंक हो रहा",
  "sync.confirmed": "पुष्टि",
  "sync.offline": "ऑफलाइन",
  "common.estimate": "एआई अनुमान",
  "common.loading": "लोड हो रहा",
  "common.error": "कुछ गलत हुआ",
  "common.cancel": "रद्द करें",
  "common.save": "सहेजें",
  "common.close": "बंद करें",
  "common.confirm": "पुष्टि करें",
  "common.viewDetails": "विवरण देखें",
  "common.high": "अधिक",
  "common.medium": "मध्यम",
  "common.low": "कम",
  "common.confidence": "आत्मविश्वास",
  "common.aiEstimate": "एआई अनुमान — गारंटी नहीं",
  "dash.greeting.morning": "सुप्रभात",
  "dash.greeting.afternoon": "नमस्कार",
  "dash.greeting.evening": "शुभ संध्या",
  "dash.weather.now": "अभी",
  "dash.weather.feelsLike": "महसूस होता",
  "dash.weather.forecast7day": "7-दिन पूर्वानुमान",
  "dash.fieldHealth": "खेत स्वास्थ्य",
  "dash.urgentAlerts": "तत्काल अलर्ट",
  "dash.marketMovers": "बाजार मूवर्स",
  "dash.noAlerts": "सब ठीक है — कोई अलर्ट नहीं",
  "fields.title": "खेत",
  "fields.boundaryHint": "बिंदु जोड़ने के लिए टैप करें, बंद करने के लिए डबल-टैप",
  "fields.clearBoundary": "साफ़ करें",
  "fields.saveBoundary": "सीमा सहेजें",
  "fields.story": "सीज़न कहानी",
  "fields.healthPulse": "स्वास्थ्य स्पंद",
  "fields.crop": "फसल",
  "fields.area": "क्षेत्र",
  "fields.lastUpdated": "अपडेटेड",
  "fields.addField": "नया खेत",
  "diag.title": "जांच",
  "diag.liveScan": "लाइव स्कैन",
  "diag.upload": "फोटो अपलोड",
  "diag.pointAtLeaf": "कैमरा पत्ते पर लगाएं",
  "diag.capture": "कैप्चर",
  "diag.analyzing": "पत्ता जांचा जा रहा",
  "diag.treatment": "इलाज चेकलिस्ट",
  "diag.severity": "गंभीरता",
  "diag.likelyCause": "संभावित कारण",
  "diag.lowConfidence": "संभावित मिलान — देखकर पुष्टि करें",
  "diag.medConfidence": "संभावित मिलान — लक्षण जांचें",
  "diag.highConfidence": "मजबूत मिलान — इलाज अनुशंसित",
  "diag.veryHighConfidence": "बहुत मजबूत मिलान",
  "diag.noDetection": "फ्रेम में कोई रोग नहीं",
  "diag.startScan": "कैमरा स्कैन शुरू करें",
  "insights.yield.title": "उपज पूर्वानुमान",
  "insights.yield.subtitle": "आपके खेत, मौसम और मिट्टी से",
  "insights.yield.range": "संभावित सीमा",
  "insights.yield.expected": "सबसे संभावित",
  "insights.yield.factors": "इसे प्रभावित कर रहा",
  "insights.soil.title": "मिट्टी जांच",
  "insights.soil.subtitle": "आपके नवीनतम मिट्टी परीक्षण से",
  "insights.soil.nitrogen": "नाइट्रोजन",
  "insights.soil.phosphorus": "फास्फोरस",
  "insights.soil.potassium": "पोटेशियम",
  "insights.soil.ph": "पीएच",
  "insights.soil.moisture": "नमी",
  "insights.soil.recommendations": "फसल सुझाव",
  "insights.soil.topsoil": "ऊपरी मिट्टी",
  "insights.soil.subsoil": "उप-मिट्टी",
  "insights.soil.regolith": "मलबा",
  "market.title": "बाजार भाव",
  "market.subtitle": "लाइव मंडी दरें, आपकी फसल पहले",
  "market.trend.up": "ऊपर",
  "market.trend.down": "नीचे",
  "market.trend.flat": "स्थिर",
  "market.lastUpdate": "अपडेटेड",
  "market.yourCrops": "आपकी फसलें",
  "voice.processing": "सोच रहा",
  "voice.tapHold": "पूछने के लिए दबाकर रखें",
  "settings.title": "सेटिंग्स",
  "settings.language": "भाषा",
  "settings.theme": "रूप",
  "settings.theme.light": "हल्का",
  "settings.theme.dark": "गहरा",
  "settings.sound": "अलर्ट ध्वनि",
  "settings.soundDesc": "केवल गंभीर मौसम व उच्च कीट जोखिम पर",
  "settings.haptics": "हैप्टिक्स",
  "settings.hapticsDesc": "मुख्य क्रियाओं पर कंपन",
  "settings.dataSaver": "डेटा बचत",
  "settings.dataSaverDesc": "मोबाइल डेटा पर सैटेलाइट इमेज कम",
  "alert.pest.risk": "उच्च कीट जोखिम पाया गया",
  "alert.heavyRain": "48 घंटे में भारी बारिश",
  "alert.dismiss": "खारिज करें",
  "alert.viewAll": "सभी देखें",
  "story.planting": "बुवाई",
  "story.germination": "अंकुरण",
  "story.vegetative": "वानस्पतिक",
  "story.flowering": "फूलना",
  "story.maturity": "परिपक्वता",
  "story.harvest": "कटाई",
  "story.intervention": "हस्तक्षेप",
  "story.today": "आज",
};

const or: Dict = {
  "app.tagline": "କ୍ଷେତ୍ର ବୁଦ୍ଧି, ଆପଣଙ୍କ ଭାଷାରେ",
  "nav.dashboard": "ଡ୍ୟାସବୋର୍ଡ",
  "nav.fields": "କ୍ଷେତ୍ର",
  "nav.diagnose": "ନିଦାନ",
  "nav.insights": "ଅନ୍ତର୍ଦୃଷ୍ଟି",
  "nav.market": "ବଜାର",
  "nav.voice": "ସ୍ୱର",
  "nav.settings": "ସେଟିଂସ୍",
  "nav.alerts": "ଚେତାବନୀ",
  "sync.queued": "ଧାଡିରେ",
  "sync.syncing": "ସିଙ୍କ୍ ହେଉଛି",
  "sync.confirmed": "ନିଶ୍ଚିତ",
  "sync.offline": "ଅଫଲାଇନ୍",
  "common.estimate": "ଏଆଇ ଆକଳନ",
  "common.loading": "ଲୋଡ୍ ହେଉଛି",
  "common.error": "କିଛି ଭୁଲ ହେଲା",
  "common.cancel": "ବାତିଲ୍",
  "common.save": "ସାଇତିବା",
  "common.close": "ବନ୍ଦ",
  "common.confirm": "ନିଶ୍ଚିତ କରନ୍ତୁ",
  "common.viewDetails": "ବିବରଣୀ ଦେଖନ୍ତୁ",
  "common.high": "ଅଧିକ",
  "common.medium": "ମଧ୍ୟମ",
  "common.low": "କମ୍",
  "common.confidence": "ନିଶ୍ଚୟତା",
  "common.aiEstimate": "ଏଆଇ ଆକଳନ — ଗ୍ୟାରେଣ୍ଟି ନୁହେଁ",
  "dash.greeting.morning": "ସୁପ୍ରଭାତ",
  "dash.greeting.afternoon": "ନମସ୍କାର",
  "dash.greeting.evening": "ଶୁଭ ସନ୍ଧ୍ୟା",
  "dash.weather.now": "ଏବେ",
  "dash.weather.feelsLike": "ଅନୁଭବ",
  "dash.weather.forecast7day": "୭-ଦିନ ପୂର୍ବାନୁମାନ",
  "dash.fieldHealth": "କ୍ଷେତ୍ର ସ୍ୱାସ୍ଥ୍ୟ",
  "dash.urgentAlerts": "ଜରୁରୀ ଚେତାବନୀ",
  "dash.marketMovers": "ବଜାର ମୁଭର୍ସ",
  "dash.noAlerts": "ସବୁ ଠିକ୍ — କୌଣସି ଚେତାବନୀ ନାହିଁ",
  "fields.title": "କ୍ଷେତ୍ର",
  "fields.boundaryHint": "ବିନ୍ଦୁ ଯୋଡ଼ିବାକୁ ଟ୍ୟାପ୍, ବନ୍ଦ କରିବାକୁ ଡବଲ୍-ଟ୍ୟାପ୍",
  "fields.clearBoundary": "ସଫା",
  "fields.saveBoundary": "ସୀମା ସାଇତିବା",
  "fields.story": "ସିଜନ୍ କାହାଣୀ",
  "fields.healthPulse": "ସ୍ୱାସ୍ଥ୍ୟ ସ୍ପନ୍ଦ",
  "fields.crop": "ଫସଲ",
  "fields.area": "କ୍ଷେତ୍ରଫଳ",
  "fields.lastUpdated": "ଅଦ୍ୟତନ",
  "fields.addField": "ନୂଆ କ୍ଷେତ୍ର",
  "diag.title": "ନିଦାନ",
  "diag.liveScan": "ଲାଇଭ୍ ସ୍କାନ୍",
  "diag.upload": "ଫଟୋ ଅପଲୋଡ୍",
  "diag.pointAtLeaf": "କ୍ୟାମେରା ପତ୍ର ଉପରେ ରଖନ୍ତୁ",
  "diag.capture": "କ୍ୟାପଚର",
  "diag.analyzing": "ପତ୍ର ବିଶ୍ଳେଷଣ",
  "diag.treatment": "ଚିକିତ୍ସା ଚେକ୍‌ଲିଷ୍ଟ",
  "diag.severity": "ଗମ୍ଭୀରତା",
  "diag.likelyCause": "ସମ୍ଭାବ୍ୟ କାରଣ",
  "diag.lowConfidence": "ସମ୍ଭାବ୍ୟ ମିଳିତ — ଦେଖି ନିଶ୍ଚିତ କରନ୍ତୁ",
  "diag.medConfidence": "ସମ୍ଭାବ୍ୟ ମିଳିତ — ଲକ୍ଷଣ ଯାଞ୍ଚ କରନ୍ତୁ",
  "diag.highConfidence": "ମଜଭୁତ ମିଳିତ — ଚିକିତ୍ସା ସୁପାରିଶିତ",
  "diag.veryHighConfidence": "ଅତ୍ୟନ୍ତ ମଜଭୁତ ମିଳିତ",
  "diag.noDetection": "ଫ୍ରେମ୍‌ରେ କୌଣସି ରୋଗ ନାହିଁ",
  "diag.startScan": "କ୍ୟାମେରା ସ୍କାନ୍ ଆରମ୍ଭ",
  "insights.yield.title": "ଉତ୍ପାଦନ ପୂର୍ବାନୁମାନ",
  "insights.yield.subtitle": "ଆପଣଙ୍କ କ୍ଷେତ୍ର, ପାଣିପାଗ ଓ ମାଟିରୁ",
  "insights.yield.range": "ସମ୍ଭାବ୍ୟ ସୀମା",
  "insights.yield.expected": "ସବୁଠାରୁ ସମ୍ଭାବ୍ୟ",
  "insights.yield.factors": "ଏହାକୁ ପ୍ରଭାବିତ କରୁଛି",
  "insights.soil.title": "ମାଟି ବିଶ୍ଳେଷଣ",
  "insights.soil.subtitle": "ଆପଣଙ୍କ ନୂତନ ମାଟି ପରୀକ୍ଷାରୁ",
  "insights.soil.nitrogen": "ନାଇଟ୍ରୋଜେନ୍",
  "insights.soil.phosphorus": "ଫସଫରସ୍",
  "insights.soil.potassium": "ପୋଟାସିୟମ୍",
  "insights.soil.ph": "ପିଏଚ୍",
  "insights.soil.moisture": "ଆର୍ଦ୍ରତା",
  "insights.soil.recommendations": "ଫସଲ ସୁପାରିଶ",
  "insights.soil.topsoil": "ଉପରି ମାଟି",
  "insights.soil.subsoil": "ଉପ-ମାଟି",
  "insights.soil.regolith": "ରେଗୋଲିଥ୍",
  "market.title": "ବଜାର ଦର",
  "market.subtitle": "ଲାଇଭ୍ ମଣ୍ଡି ଦର, ଆପଣଙ୍କ ଫସଲ ପ୍ରଥମେ",
  "market.trend.up": "ଉପର",
  "market.trend.down": "ତଳ",
  "market.trend.flat": "ସ୍ଥିର",
  "market.lastUpdate": "ଅଦ୍ୟତନ",
  "market.yourCrops": "ଆପଣଙ୍କ ଫସଲ",
  "voice.processing": "ଭାବୁଛି",
  "voice.tapHold": "ପଚାରିବାକୁ ଧରି ରଖନ୍ତୁ",
  "settings.title": "ସେଟିଂସ୍",
  "settings.language": "ଭାଷା",
  "settings.theme": "ରୂପ",
  "settings.theme.light": "ହାଲୁକା",
  "settings.theme.dark": "ଗାଢ଼",
  "settings.sound": "ଚେତାବନୀ ଧ୍ୱନି",
  "settings.soundDesc": "କେବଳ ଗମ୍ଭୀର ପାଣିପାଗ ଓ ଉଚ୍ଚ କୀଟ ସଙ୍କଟ",
  "settings.haptics": "ହାପ୍ଟିକ୍ସ",
  "settings.hapticsDesc": "ମୁଖ୍ୟ କାର୍ଯ୍ୟରେ କମ୍ପନ",
  "settings.dataSaver": "ଡାଟା ସେଭର୍",
  "settings.dataSaverDesc": "ମୋବାଇଲ୍ ଡାଟାରେ ସାଟେଲାଇଟ୍ ଇମେଜ୍ କମ୍",
  "alert.pest.risk": "ଉଚ୍ଚ କୀଟ ସଙ୍କଟ ମିଳିଲା",
  "alert.heavyRain": "୪୮ ଘଣ୍ଟାରେ ଭାରୀ ବର୍ଷା",
  "alert.dismiss": "ଖାରଜ୍",
  "alert.viewAll": "ସବୁ ଦେଖନ୍ତୁ",
  "story.planting": "ବୁଣିବା",
  "story.germination": "ଅଙ୍କୁରଣ",
  "story.vegetative": "ବନସ୍ପତିକ",
  "story.flowering": "ଫୁଲ ଧରିବା",
  "story.maturity": "ପରିପକ୍ୱତା",
  "story.harvest": "କଟଣି",
  "story.intervention": "ହସ୍ତକ୍ଷେପ",
  "story.today": "ଆଜି",
};

const te: Dict = {
  "app.tagline": "పొలం తెలివి, మీ భాషలో",
  "nav.dashboard": "డాష్‌బోర్డ్",
  "nav.fields": "పొలాలు",
  "nav.diagnose": "నిర్ధారణ",
  "nav.insights": "అంతర్దృష్టి",
  "nav.market": "మార్కెట్",
  "nav.voice": "స్వరం",
  "nav.settings": "సెట్టింగ్‌లు",
  "nav.alerts": "హెచ్చరికలు",
  "sync.queued": "క్యూలో",
  "sync.syncing": "సింక్ అవుతోంది",
  "sync.confirmed": "నిర్ధారించబడింది",
  "sync.offline": "ఆఫ్‌లైన్",
  "common.estimate": "ఏఐ అంచనా",
  "common.loading": "లోడ్ అవుతోంది",
  "common.error": "ఏదో తప్పు జరిగింది",
  "common.cancel": "రద్దు",
  "common.save": "సేవ్",
  "common.close": "మూసివేయి",
  "common.confirm": "నిర్ధారించు",
  "common.viewDetails": "వివరాలు",
  "common.high": "ఎక్కువ",
  "common.medium": "మధ్యమ",
  "common.low": "తక్కువ",
  "common.confidence": "విశ్వాసం",
  "common.aiEstimate": "ఏఐ అంచనా — హామీ కాదు",
  "dash.greeting.morning": "శుభోదయం",
  "dash.greeting.afternoon": "నమస్కారం",
  "dash.greeting.evening": "శుభ సాయంత్రం",
  "dash.weather.now": "ఇప్పుడు",
  "dash.weather.feelsLike": "అనుభూతి",
  "dash.weather.forecast7day": "౭-రోజుల సూచన",
  "dash.fieldHealth": "పొలం ఆరోగ్యం",
  "dash.urgentAlerts": "అత్యవసర హెచ్చరికలు",
  "dash.marketMovers": "మార్కెట్ మూవర్స్",
  "dash.noAlerts": "అంతా సరే — హెచ్చరికలు లేవు",
  "fields.title": "పొలాలు",
  "fields.boundaryHint": "బిందువుల కోసం నొక్కండి, మూసివేయడానికి డబుల్-ట్యాప్",
  "fields.clearBoundary": "క్లియర్",
  "fields.saveBoundary": "సరిహద్దు సేవ్",
  "fields.story": "సీజన్ కథ",
  "fields.healthPulse": "ఆరోగ్య స్పందన",
  "fields.crop": "పంట",
  "fields.area": "విస్తీర్ణం",
  "fields.lastUpdated": "నవీకరించబడింది",
  "fields.addField": "కొత్త పొలం",
  "diag.title": "నిర్ధారణ",
  "diag.liveScan": "లైవ్ స్కాన్",
  "diag.upload": "ఫోటో అప్‌లోడ్",
  "diag.pointAtLeaf": "కెమెరా ఆకుపై పెట్టండి",
  "diag.capture": "క్యాప్చర్",
  "diag.analyzing": "ఆకు విశ్లేషణ",
  "diag.treatment": "చికిత్స చెక్‌లిస్ట్",
  "diag.severity": "తీవ్రత",
  "diag.likelyCause": "సాధ్యమైన కారణం",
  "diag.lowConfidence": "సాధ్యమైన పోలిక — చూసి నిర్ధారించు",
  "diag.medConfidence": "సాధ్యమైన పోలిక — లక్షణాలు సమీక్షించు",
  "diag.highConfidence": "బలమైన పోలిక — చికిత్స సూచించబడింది",
  "diag.veryHighConfidence": "చాలా బలమైన పోలిక",
  "diag.noDetection": "ఫ్రేమ్‌లో వ్యాధి లేదు",
  "diag.startScan": "కెమెరా స్కాన్ ప్రారంభించు",
  "insights.yield.title": "దిగుబడి సూచన",
  "insights.yield.subtitle": "మీ పొలం, వాతావరణం, నేల నుండి",
  "insights.yield.range": "సాధ్యమైన పరిధి",
  "insights.yield.expected": "అత్యంత సాధ్యం",
  "insights.yield.factors": "దీన్ని ప్రభావితం చేస్తున్నది",
  "insights.soil.title": "నేల విశ్లేషణ",
  "insights.soil.subtitle": "మీ తాజా నేల పరీక్ష నుండి",
  "insights.soil.nitrogen": "నత్రజని",
  "insights.soil.phosphorus": "భాస్వరం",
  "insights.soil.potassium": "పొటాషియం",
  "insights.soil.ph": "పిహెచ్",
  "insights.soil.moisture": "తేమ",
  "insights.soil.recommendations": "పంట సూచనలు",
  "insights.soil.topsoil": "పై నేల",
  "insights.soil.subsoil": "ఉప నేల",
  "insights.soil.regolith": "రెగోలిత్",
  "market.title": "మార్కెట్ ధరలు",
  "market.subtitle": "లైవ్ మండి ధరలు, మీ పంటలు ముందు",
  "market.trend.up": "పైకి",
  "market.trend.down": "కిందికి",
  "market.trend.flat": "స్థిరం",
  "market.lastUpdate": "నవీకరించబడింది",
  "market.yourCrops": "మీ పంటలు",
  "voice.processing": "ఆలోచిస్తోంది",
  "voice.tapHold": "అడగడానికి నొక్కి పట్టుకోండి",
  "settings.title": "సెట్టింగ్‌లు",
  "settings.language": "భాష",
  "settings.theme": "రూపం",
  "settings.theme.light": "లేత",
  "settings.theme.dark": "ముదురు",
  "settings.sound": "హెచ్చరిక ధ్వని",
  "settings.soundDesc": "తీవ్ర వాతావరణం, అధిక పురుగు ప్రమాదం మాత్రమే",
  "settings.haptics": "హాప్టిక్స్",
  "settings.hapticsDesc": "ముఖ్య చర్యలప్పుడు వైబ్రేషన్",
  "settings.dataSaver": "డేటా సేవర్",
  "settings.dataSaverDesc": "మొబైల్ డేటాపై శాటిలైట్ చిత్రాలు తగ్గాయి",
  "alert.pest.risk": "అధిక పురుగు ప్రమాదం గుర్తించబడింది",
  "alert.heavyRain": "౪౮ గంటల్లో భారీ వర్షం",
  "alert.dismiss": "తొలగించు",
  "alert.viewAll": "అన్నీ చూడు",
  "story.planting": "విత్తనం",
  "story.germination": "మొలక",
  "story.vegetative": "వృద్ధి",
  "story.flowering": "పుష్పించు",
  "story.maturity": "పక్వత",
  "story.harvest": "కోత",
  "story.intervention": "జోక్యం",
  "story.today": "ఈ రోజు",
};

const translations: Record<Locale, Dict> = { en, hi, or, te };

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}
