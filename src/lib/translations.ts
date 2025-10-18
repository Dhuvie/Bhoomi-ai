
// src/lib/translations.ts

export type Translation = {
  sidebar: {
    dashboard: string;
    analysis: string;
    pestDisease: string;
    marketPrices: string;
    settings: string;
    fieldManagement: string;
    weather: string;
    soilAnalysis: string;
  };
  dashboard: {
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    avgTemp: string;
    rainfall: string;
    rainfallUnit: string;
    sunlight: string;
    sunlightUnit: string;
    wind: string;
    quickActions: string;
    quickActionsDesc: string;
    newAnalysis: string;
    viewMap: string;
    welcomeTitle: string;
    welcomeDesc: string;
    welcomeContent: string;
  };
  settings: {
    title: string;
    description: string;
    profile: {
      title: string;
      description: string;
      firstName: string;
      lastName: string;
      email: string;
      updateButton: string;
    };
    preferences: {
      title: string;
      description: string;
      darkMode: string;
      darkModeDesc: string;
      language: string;
      languageDesc: string;
      selectLanguage: string;
      emailNotifications: string;
      emailNotificationsDesc: string;
    };
    apiKeys: {
      title: string;
      description: string;
      gmapsKey: string;
      gmapsKeyDesc: string;
      revokeButton: string;
      generateButton: string;
    };
    myFields: {
      title: string;
      description: string;
      newFieldButton: string;
      fieldName: string;
      fieldLocation: string;
      fieldCrop: string;
      fieldSize: string;
      fieldSizeUnit: string;
      noFields: string;
      editField: string;
      deleteField: string;
      deleteConfirmTitle: string;
      deleteConfirmText: string;
      cancel: string;
      delete: string;
      addNewField: string;
      saveChanges: string;
    }
  };
  predictionTabs: {
    title: string;
    description: string;
    quickPredictionTab: string;
    detailedAnalysisTab: string;
    fieldDescriptionLabel: string;
    fieldDescriptionPlaceholder: string;
    fieldDescriptionHelper: string;
    getQuickPredictionButton: string;
    getDetailedAnalysisButton: string;
    analyzing: string;
    selectLocationWarning: string;
    showMoreParams: string;
    form: {
        cropType: string;
        sowingDate: string;
        soilN: string;
        seasonalRainfall: string;
        expectedRainfall: string;
        ndviDeclineRate: string;
        consecutiveDryDays: string;
        gdd: string;
        soilPh: string;
        soilSoc: string;
        soilClayPct: string;
        ndviMean: string;
        ndviMax: string;
        ndviAuc: string;
        ndviPeakDate: string;
        historicalYield: string;
    },
    quickPredictionSuccessTitle: string;
    quickPredictionSuccessDescription: string;
    predictionFailedTitle: string;
    locationNotSetTitle: string;
    locationNotSetDescription: string;
    recommendationFailedTitle: string;
    explanationFailedTitle: string;
    analysisCompleteTitle: string;
    analysisCompleteDescription: string;
  };
  results: {
    awaitingAnalysis: string;
    resultsWillAppear: string;
    analysisResults: string;
    resultsDescription: string;
    predictedYield: string;
    confidence: string;
    recommendations: string;
    aiExplanation: string;
    localizedRecommendations: string;
    audioReadout: string;
    audioNotSupported: string;
    predictionFactors: string;
    ndviTrend: string;
  };
  pestDisease: {
    title: string;
    description: string;
    uploadCardTitle: string;
    uploadCardDescription: string;
    uploadButton: string;
    useWebcamButton: string;
    or: string;
    diagnoseButton: string;
    analyzing: string;
    diagnosisResult: string;
    plantName: string;
    latinName: string;
    isHealthy: string;
    healthy: string;
    unhealthy: string;
    diagnosis: string;
    notAPlant: string;
    notAPlantDescription: string;
    awaitingDiagnosis: string;
    awaitingDiagnosisDescription: string;
    diagnosisError: string;
    webcamTitle: string;
    webcamDescription: string;
    captureButton: string;
    retakeButton: string;
    usePhotoButton: string;
    cameraPermissionRequired: string;
    cameraPermissionDescription: string;
    symptoms: string;
    precautions: string;
    cure: string;
    plantHistory: string;
    idealConditions: string;
  };
  market: {
    title: string;
    description: string;
    location: string;
    crop: string;
    fetchPricesButton: string;
    fetching: string;
    marketPrices: string;
    lastUpdated: string;
    grade: string;
    pricePerUnit: (unit: string) => string;
    trend: string;
    unit: string;
    quintal: string;
    tonne: string;
    kg: string;
    grades: {
      [key: string]: string;
    };
  };
  fieldManagement: {
    title: string;
    description: string;
    yourFields: string;
    noFields: string;
    drawField: string;
    cancelDrawing: string;
    saveField: string;
    fieldName: string;
    location: string;
    crop: string;
    area: string;
    coordinates: string;
    totalArea: string;
    editField: string;
    deleteField: string;
    sendToAnalysis: string;
    interactiveMap: string;
    useTools: string;
    viewManage: string;
  };
  weather: {
    title: string;
    description: string;
    currentWeather: string;
    forecast: string;
    historical: string;
    selectLocation: string;
    currentLocation: string;
    yourFields: string;
    temperature: string;
    humidity: string;
    windSpeed: string;
    pressure: string;
    visibility: string;
    condition: string;
    export: string;
    sendToAnalysis: string;
    feelsLike: string;
    forecastAvailable: string;
    daysData: string;
  };
  soilAnalysis: {
    title: string;
    description: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    temperature: string;
    humidity: string;
    ph: string;
    rainfall: string;
    analyzeSoil: string;
    analyzing: string;
    irrigationAnalysis: string;
    fertilityReport: string;
    recommendedCrops: string;
    improvements: string;
    exportReport: string;
    sendToAnalysis: string;
    soilParameters: string;
    enterResults: string;
    overallFertility: string;
    irrigationScore: string;
  };
};

export const translations = {
  en: {
    sidebar: {
      dashboard: "Dashboard",
      analysis: "Analysis",
      pestDisease: "Pest & Disease",
      marketPrices: "Market Prices",
      settings: "Settings",
      fieldManagement: "Field Management",
      weather: "Weather",
      soilAnalysis: "Soil Analysis",
    },
    dashboard: {
      goodMorning: "Good Morning",
      goodAfternoon: "Good Afternoon",
      goodEvening: "Good Evening",
      avgTemp: "Avg. Temperature",
      rainfall: "Rainfall",
      rainfallUnit: "mm this month",
      sunlight: "Sunlight Hours",
      sunlightUnit: "avg. daily",
      wind: "Wind Speed",
      quickActions: "Quick Actions",
      quickActionsDesc: "Get started with a new analysis or view your fields.",
      newAnalysis: "New Analysis",
      viewMap: "View Map",
      welcomeTitle: "About AgriVision AI",
      welcomeDesc: "Your AI-powered assistant for crop yield prediction and optimization.",
      welcomeContent: "Use the navigation on the left to explore different features. Start by running a new analysis or exploring the interactive map.",
    },
    settings: {
        title: "Settings",
        description: "Manage your application settings and preferences.",
        profile: {
            title: "Profile",
            description: "Update your personal information.",
            firstName: "First Name",
            lastName: "Last Name",
            email: "Email",
            updateButton: "Update Profile",
        },
        preferences: {
            title: "Preferences",
            description: "Customize your experience.",
            darkMode: "Dark Mode",
            darkModeDesc: "Enable or disable the dark color scheme.",
            language: "Language",
            languageDesc: "Choose your preferred language for the interface.",
            selectLanguage: "Select language",
            emailNotifications: "Email Notifications",
            emailNotificationsDesc: "Receive email notifications for important updates.",
        },
        apiKeys: {
            title: "API Keys",
            description: "Manage your API keys for third-party integrations.",
            gmapsKey: "Google Maps API Key",
            gmapsKeyDesc: "This key is used for map functionalities.",
            revokeButton: "Revoke",
            generateButton: "Generate New Key",
        },
        myFields: {
          title: "My Fields",
          description: "Manage your saved fields for quick access.",
          newFieldButton: "Add New Field",
          fieldName: "Field Name / Nickname",
          fieldLocation: "Field Location",
          fieldCrop: "Primary Crop",
          fieldSize: "Size",
          fieldSizeUnit: "Hectares",
          noFields: "You haven't added any fields yet.",
          editField: "Edit Field",
          deleteField: "Delete Field",
          deleteConfirmTitle: "Are you sure?",
          deleteConfirmText: "This action cannot be undone. This will permanently delete your field.",
          cancel: "Cancel",
          delete: "Delete",
          addNewField: "Add New Field",
          saveChanges: "Save Changes",
        }
    },
    predictionTabs: {
        title: "Analysis & Prediction",
        description: "Choose an analysis type and provide the required information.",
        quickPredictionTab: "Quick Prediction",
        detailedAnalysisTab: "Detailed Analysis",
        fieldDescriptionLabel: "Field Description",
        fieldDescriptionPlaceholder: "Describe your field, including crop type, soil condition, and recent weather...",
        fieldDescriptionHelper: "Provide as much detail as possible for a better prediction.",
        getQuickPredictionButton: "Get Quick Prediction",
        getDetailedAnalysisButton: "Run Detailed Analysis",
        analyzing: "Analyzing...",
        selectLocationWarning: "Please enter a location first.",
        showMoreParams: "Show More Parameters",
        form: {
            cropType: "Crop Type",
            sowingDate: "Sowing Date",
            soilN: "Soil Nitrogen",
            seasonalRainfall: "Seasonal Rainfall (mm)",
            expectedRainfall: "Expected Rainfall (mm)",
            ndviDeclineRate: "NDVI Decline Rate",
            consecutiveDryDays: "Consecutive Dry Days",
            gdd: "Growing Degree Days",
            soilPh: "Soil pH",
            soilSoc: "Soil Organic Carbon",
            soilClayPct: "Soil Clay Percentage",
            ndviMean: "NDVI Mean",
            ndviMax: "NDVI Max",
            ndviAuc: "NDVI AUC",
            ndviPeakDate: "NDVI Peak Date",
            historicalYield: "Historical Yield (t/ha)",
        },
        quickPredictionSuccessTitle: "Prediction Successful",
        quickPredictionSuccessDescription: "Yield prediction has been generated.",
        predictionFailedTitle: "Prediction Failed",
        locationNotSetTitle: "Location not set",
        locationNotSetDescription: "Please enter a latitude and longitude.",
        recommendationFailedTitle: "Recommendation Failed",
        explanationFailedTitle: "Explanation Failed",
        analysisCompleteTitle: "Analysis Complete",
        analysisCompleteDescription: "Detailed analysis results are ready.",
    },
    results: {
        awaitingAnalysis: "Awaiting Analysis",
        resultsWillAppear: "Your prediction results will appear here once you run an analysis.",
        analysisResults: "Analysis Results",
        resultsDescription: "Yield predictions and actionable recommendations based on your inputs.",
        predictedYield: "Predicted Yield (Tonnes/Hectare)",
        confidence: "Confidence",
        recommendations: "Recommendations",
        aiExplanation: "AI Explanation",
        localizedRecommendations: "Localized Recommendations",
        audioReadout: "Audio Readout",
        audioNotSupported: "Your browser does not support the audio element.",
        predictionFactors: "Prediction Factors Explanation",
        ndviTrend: "Simulated NDVI Trend",
    },
    pestDisease: {
      title: "Pest & Disease Identification",
      description: "Upload a photo of a plant to identify potential diseases or pests.",
      uploadCardTitle: "Upload Image",
      uploadCardDescription: "Choose a file or use your webcam to capture a photo.",
      uploadButton: "Choose File",
      useWebcamButton: "Use Webcam",
      or: "OR",
      diagnoseButton: "Diagnose Plant",
      analyzing: "Diagnosing...",
      diagnosisResult: "Diagnosis Result",
      plantName: "Plant Name",
      latinName: "Latin Name",
      isHealthy: "Is Healthy?",
      healthy: "Healthy",
      unhealthy: "Unhealthy",
      diagnosis: "Diagnosis",
      notAPlant: "Not a Plant",
      notAPlantDescription: "The AI has determined the image is likely not a plant. Please try another image.",
      awaitingDiagnosis: "Awaiting Diagnosis",
      awaitingDiagnosisDescription: "Upload a plant image and click 'Diagnose' to see the results.",
      diagnosisError: "An error occurred during diagnosis. Please try again.",
      webcamTitle: "Webcam Capture",
      webcamDescription: "Position the plant in the frame and click capture.",
      captureButton: "Capture",
      retakeButton: "Retake",
      usePhotoButton: "Use this Photo",
      cameraPermissionRequired: "Camera Access Required",
      cameraPermissionDescription: "Please allow camera access to use this feature.",
      symptoms: "Symptoms",
      precautions: "Precautions",
      cure: "Cure / Treatment",
      plantHistory: "Plant History & Characteristics",
      idealConditions: "Ideal Growing Conditions",
    },
    market: {
        title: "Market Prices",
        description: "Get the latest simulated market prices for crops in your area.",
        location: "Location",
        crop: "Crop",
        fetchPricesButton: "Fetch Prices",
        fetching: "Fetching...",
        marketPrices: "Market Prices",
        lastUpdated: "Last updated",
        grade: "Grade",
        pricePerUnit: (unit: string) => `Price / ${unit}`,
        trend: "Trend",
        unit: "Unit",
        quintal: "Quintal",
        tonne: "Tonne",
        kg: "Kg",
        grades: {
          "Premium Quality": "Premium Quality",
          "Standard Quality": "Standard Quality",
          "Fair Quality": "Fair Quality",
        },
    },
    fieldManagement: {
      title: "Field Management",
      description: "Draw and manage your agricultural fields with automatic area calculation",
      yourFields: "Your Fields",
      noFields: "No fields yet",
      drawField: "Draw Field",
      cancelDrawing: "Cancel Drawing",
      saveField: "Save Field",
      fieldName: "Field Name",
      location: "Location",
      crop: "Crop",
      area: "Area",
      coordinates: "Coordinates",
      totalArea: "Total Area",
      editField: "Edit",
      deleteField: "Delete",
      sendToAnalysis: "Send to Analysis",
      interactiveMap: "Interactive Field Map",
      useTools: "Use tools to draw your field",
      viewManage: "View and manage your fields",
    },
    weather: {
      title: "Weather Information",
      description: "Real-time weather, forecasts, and historical data for your fields",
      currentWeather: "Current Weather",
      forecast: "7-Day Forecast",
      historical: "Historical Data",
      selectLocation: "Select Location",
      currentLocation: "Current Location",
      yourFields: "Your Fields",
      temperature: "Temperature",
      humidity: "Humidity",
      windSpeed: "Wind Speed",
      pressure: "Pressure",
      visibility: "Visibility",
      condition: "Condition",
      export: "Export",
      sendToAnalysis: "Send to Analysis",
      feelsLike: "Feels like",
      forecastAvailable: "Forecast Available",
      daysData: "days of forecast data included",
    },
    soilAnalysis: {
      title: "Soil Analysis",
      description: "Analyze your soil composition and get AI-powered recommendations",
      nitrogen: "Nitrogen (N)",
      phosphorus: "Phosphorus (P)",
      potassium: "Potassium (K)",
      temperature: "Temperature",
      humidity: "Humidity",
      ph: "pH Level",
      rainfall: "Rainfall",
      analyzeSoil: "Analyze Soil",
      analyzing: "Analyzing...",
      irrigationAnalysis: "Irrigation Analysis",
      fertilityReport: "Soil Fertility Report",
      recommendedCrops: "Recommended Crops",
      improvements: "Improvement Suggestions",
      exportReport: "Export Report",
      sendToAnalysis: "Send to Analysis",
      soilParameters: "Soil Parameters",
      enterResults: "Enter your soil test results and environmental conditions",
      overallFertility: "Overall Fertility",
      irrigationScore: "Irrigation Score",
    },
  },
  hi: {
    sidebar: {
      dashboard: "डैशबोर्ड",
      analysis: "विश्लेषण",
      pestDisease: "कीट और रोग",
      marketPrices: "बाजार मूल्य",
      settings: "सेटिंग्स",
      fieldManagement: "खेत प्रबंधन",
      weather: "मौसम",
      soilAnalysis: "मिट्टी विश्लेषण",
    },
    dashboard: {
      goodMorning: "सुप्रभात",
      goodAfternoon: "नमस्ते",
      goodEvening: "शुभ संध्या",
      avgTemp: "औसत तापमान",
      rainfall: "वर्षा",
      rainfallUnit: "मिमी इस महीने",
      sunlight: "धूप के घंटे",
      sunlightUnit: "औसत दैनिक",
      wind: "हवा की गति",
      quickActions: "त्वरित कार्रवाई",
      quickActionsDesc: "एक नया विश्लेषण शुरू करें या अपने खेतों को देखें।",
      newAnalysis: "नया विश्लेषण",
      viewMap: "मानचित्र देखें",
      welcomeTitle: "एग्रीविजन एआई के बारे में",
      welcomeDesc: "फसल उपज की भविष्यवाणी और अनुकूलन के लिए आपका एआई-संचालित सहायक।",
      welcomeContent: "विभिन्न सुविधाओं का पता लगाने के लिए बाईं ओर नेविगेशन का उपयोग करें। एक नया विश्लेषण चलाकर या इंटरेक्टिव मानचित्र की खोज करके प्रारंभ करें।",
    },
    settings: {
        title: "सेटिंग्स",
        description: "अपनी एप्लिकेशन सेटिंग्स और वरीयताओं को प्रबंधित करें।",
        profile: {
            title: "प्रोफ़ाइल",
            description: "अपनी व्यक्तिगत जानकारी अपडेट करें।",
            firstName: "पहला नाम",
            lastName: "अंतिम नाम",
            email: "ईमेल",
            updateButton: "प्रोफ़ाइल अपडेट करें",
        },
        preferences: {
            title: "वरीयताएँ",
            description: "अपने अनुभव को अनुकूलित करें।",
            darkMode: "डार्क मोड",
            darkModeDesc: "डार्क कलर स्कीम को सक्षम या अक्षम करें।",
            language: "भाषा",
            languageDesc: "इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें।",
            selectLanguage: "भाषा चुनें",
            emailNotifications: "ईमेल सूचनाएं",
            emailNotificationsDesc: "महत्वपूर्ण अपडेट के लिए ईमेल सूचनाएं प्राप्त करें।",
        },
        apiKeys: {
            title: "एपीआई कुंजी",
            description: "तृतीय-पक्ष एकीकरण के लिए अपनी एपीआई कुंजी प्रबंधित करें।",
            gmapsKey: "गूगल मैप्स एपीआई कुंजी",
            gmapsKeyDesc: "यह कुंजी मानचित्र कार्यात्मकताओं के लिए उपयोग की जाती है।",
            revokeButton: "रद्द करें",
            generateButton: "नई कुंजी उत्पन्न करें",
        },
        myFields: {
          title: "मेरे खेत",
          description: "त्वरित पहुंच के लिए अपने सहेजे गए खेतों का प्रबंधन करें।",
          newFieldButton: "नया खेत जोड़ें",
          fieldName: "खेत का नाम / उपनाम",
          fieldLocation: "खेत का स्थान",
          fieldCrop: "मुख्य फसल",
          fieldSize: "आकार",
          fieldSizeUnit: "हेक्टेयर",
          noFields: "आपने अभी तक कोई खेत नहीं जोड़ा है।",
          editField: "खेत संपादित करें",
          deleteField: "खेत हटाएं",
          deleteConfirmTitle: "क्या आप निश्चित हैं?",
          deleteConfirmText: "यह क्रिया पूर्ववत नहीं की जा सकती। यह आपके खेत को स्थायी रूप से हटा देगा।",
          cancel: "रद्द करें",
          delete: "हटाएं",
          addNewField: "नया खेत जोड़ें",
          saveChanges: "बदलाव सहेजें",
        }
    },
    predictionTabs: {
        title: "विश्लेषण और भविष्यवाणी",
        description: "एक विश्लेषण प्रकार चुनें और आवश्यक जानकारी प्रदान करें।",
        quickPredictionTab: "त्वरित भविष्यवाणी",
        detailedAnalysisTab: "विस्तृत विश्लेषण",
        fieldDescriptionLabel: "खेत का विवरण",
        fieldDescriptionPlaceholder: "अपने खेत का वर्णन करें, जिसमें फसल का प्रकार, मिट्टी की स्थिति और हाल का मौसम शामिल है...",
        fieldDescriptionHelper: "बेहतर भविष्यवाणी के लिए यथासंभव अधिक विवरण प्रदान करें।",
        getQuickPredictionButton: "त्वरित भविष्यवाणी प्राप्त करें",
        getDetailedAnalysisButton: "विस्तृत विश्लेषण चलाएँ",
        analyzing: "विश्लेषण हो रहा है...",
        selectLocationWarning: "कृपया पहले एक स्थान दर्ज करें।",
        showMoreParams: "अधिक पैरामीटर दिखाएं",
        form: {
            cropType: "फ़सल का प्रकार",
            sowingDate: "बुवाई की तारीख",
            soilN: "मिट्टी में नाइट्रोजन",
            seasonalRainfall: "मौसमी वर्षा (मिमी)",
            expectedRainfall: "अपेक्षित वर्षा (मिमी)",
            ndviDeclineRate: "एनडीवीआई गिरावट दर",
            consecutiveDryDays: "लगातार शुष्क दिन",
            gdd: "बढ़ते डिग्री दिन",
            soilPh: "मिट्टी का पीएच",
            soilSoc: "मृदा कार्बनिक कार्बन",
            soilClayPct: "मिट्टी में चिकनी मिट्टी %",
            ndviMean: "माध्य एनडीवीआई",
            ndviMax: "अधिकतम एनडीवीआई",
            ndviAuc: "एनडीवीआई एयूसी",
            ndviPeakDate: "एनडीवीआई शिखर दिनांक",
            historicalYield: "ऐतिहासिक उपज (टन/हेक्टेयर)",
        },
        quickPredictionSuccessTitle: "भविष्यवाणी सफल",
        quickPredictionSuccessDescription: "उपज की भविष्यवाणी उत्पन्न हो गई है।",
        predictionFailedTitle: "भविष्यवाणी विफल",
        locationNotSetTitle: "स्थान निर्धारित नहीं है",
        locationNotSetDescription: "कृपया एक अक्षांश और देशांतर दर्ज करें।",
        recommendationFailedTitle: "सिफारिश विफल",
        explanationFailedTitle: "स्पष्टीकरण विफल",
        analysisCompleteTitle: "विश्लेषण पूर्ण",
        analysisCompleteDescription: "विस्तृत विश्लेषण परिणाम तैयार हैं।",
    },
    results: {
        awaitingAnalysis: "विश्लेषण की प्रतीक्षा है",
        resultsWillAppear: "आपके भविष्यवाणी परिणाम यहां दिखाई देंगे जब आप एक विश्लेषण चलाएंगे।",
        analysisResults: "विश्लेषण परिणाम",
        resultsDescription: "आपके इनपुट के आधार पर उपज की भविष्यवाणी और कार्रवाई योग्य सिफारिशें।",
        predictedYield: "अनुमानित उपज (टन/हेक्टेयर)",
        confidence: "आत्मविश्वास",
        recommendations: "सिफारिशें",
        aiExplanation: "एआई स्पष्टीकरण",
        localizedRecommendations: "स्थानीयकृत सिफारिशें",
        audioReadout: "ऑडियो रीडआउट",
        audioNotSupported: "आपका ब्राउज़र ऑडियो तत्व का समर्थन नहीं करता है।",
        predictionFactors: "भविष्यवाणी कारकों का स्पष्टीकरण",
        ndviTrend: "नकली एनडीवीआई ट्रेंड",
    },
     pestDisease: {
      title: "कीट और रोग पहचान",
      description: "संभावित रोगों या कीटों की पहचान करने के लिए पौधे की एक तस्वीर अपलोड करें।",
      uploadCardTitle: "छवि अपलोड करें",
      uploadCardDescription: "एक फ़ाइल चुनें या एक तस्वीर लेने के लिए अपने वेबकैम का उपयोग करें।",
      uploadButton: "फ़ाइल चुनें",
      useWebcamButton: "वेबकैम का उपयोग करें",
      or: "या",
      diagnoseButton: "पौधे का निदान करें",
      analyzing: "निदान हो रहा है...",
      diagnosisResult: "निदान परिणाम",
      plantName: "पौथे का नाम",
      latinName: "लैटिन नाम",
      isHealthy: "क्या स्वस्थ है?",
      healthy: "स्वस्थ",
      unhealthy: "अस्वस्थ",
      diagnosis: "निदान",
      notAPlant: "पौधा नहीं है",
      notAPlantDescription: "एआई ने निर्धारित किया है कि यह छवि संभवतः एक पौधा नहीं है। कृपया दूसरी छवि का प्रयास करें।",
      awaitingDiagnosis: "निदान की प्रतीक्षा है",
      awaitingDiagnosisDescription: "एक पौधे की छवि अपलोड करें और परिणाम देखने के लिए 'निदान' पर क्लिक करें।",
      diagnosisError: "निदान के दौरान एक त्रुटि हुई। कृपया पुन: प्रयास करें।",
      webcamTitle: "वेबकैम कैप्चर",
      webcamDescription: "पौधे को फ्रेम में रखें और कैप्चर पर क्लिक करें।",
      captureButton: "कैप्चर",
      retakeButton: "फिर से लेना",
      usePhotoButton: "इस तस्वीर का प्रयोग करें",
      cameraPermissionRequired: "कैमरा एक्सेस आवश्यक है",
      cameraPermissionDescription: "इस सुविधा का उपयोग करने के लिए कृपया कैमरा एक्सेस की अनुमति दें।",
      symptoms: "लक्षण",
      precautions: "सावधानियां",
      cure: "इलाज / उपचार",
      plantHistory: "पौधे का इतिहास और विशेषताएँ",
      idealConditions: "आदर्श बढ़ती परिस्थितियाँ",
    },
    market: {
        title: "बाजार मूल्य",
        description: "अपने क्षेत्र में फसलों के नवीनतम नकली बाजार मूल्य प्राप्त करें।",
        location: "स्थान",
        crop: "फसल",
        fetchPricesButton: "मूल्य प्राप्त करें",
        fetching: "प्राप्त हो रहा है...",
        marketPrices: "बाजार मूल्य",
        lastUpdated: "अंतिम अपडेट",
        grade: "ग्रेड",
        pricePerUnit: (unit: string) => `मूल्य / ${unit}`,
        trend: "प्रवृत्ति",
        unit: "इकाई",
        quintal: "क्विंटल",
        tonne: "टन",
        kg: "किलो",
        grades: {
          "Premium Quality": "प्रीमियम गुणवत्ता",
          "Standard Quality": "मानक गुणवत्ता",
          "Fair Quality": "उचित गुणवत्ता",
        },
    },
    fieldManagement: {
      title: "खेत प्रबंधन",
      description: "स्वचालित क्षेत्र गणना के साथ अपने कृषि खेतों को बनाएं और प्रबंधित करें",
      yourFields: "आपके खेत",
      noFields: "अभी तक कोई खेत नहीं",
      drawField: "खेत बनाएं",
      cancelDrawing: "रद्द करें",
      saveField: "खेत सहेजें",
      fieldName: "खेत का नाम",
      location: "स्थान",
      crop: "फसल",
      area: "क्षेत्रफल",
      coordinates: "निर्देशांक",
      totalArea: "कुल क्षेत्रफल",
      editField: "संपादित करें",
      deleteField: "हटाएं",
      sendToAnalysis: "विश्लेषण के लिए भेजें",
      interactiveMap: "इंटरैक्टिव फील्ड मैप",
      useTools: "अपना खेत बनाने के लिए उपकरणों का उपयोग करें",
      viewManage: "अपने खेतों को देखें और प्रबंधित करें",
    },
    weather: {
      title: "मौसम की जानकारी",
      description: "आपके खेतों के लिए वास्तविक समय मौसम, पूर्वानुमान और ऐतिहासिक डेटा",
      currentWeather: "वर्तमान मौसम",
      forecast: "7-दिन का पूर्वानुमान",
      historical: "ऐतिहासिक डेटा",
      selectLocation: "स्थान चुनें",
      currentLocation: "वर्तमान स्थान",
      yourFields: "आपके खेत",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      windSpeed: "हवा की गति",
      pressure: "दबाव",
      visibility: "दृश्यता",
      condition: "स्थिति",
      export: "निर्यात करें",
      sendToAnalysis: "विश्लेषण के लिए भेजें",
      feelsLike: "जैसा महसूस होता है",
      forecastAvailable: "पूर्वानुमान उपलब्ध",
      daysData: "दिनों का पूर्वानुमान डेटा शामिल",
    },
    soilAnalysis: {
      title: "मिट्टी विश्लेषण",
      description: "अपनी मिट्टी की संरचना का विश्लेषण करें और AI-संचालित सिफारिशें प्राप्त करें",
      nitrogen: "नाइट्रोजन (N)",
      phosphorus: "फास्फोरस (P)",
      potassium: "पोटेशियम (K)",
      temperature: "तापमान",
      humidity: "आर्द्रता",
      ph: "pH स्तर",
      rainfall: "वर्षा",
      analyzeSoil: "मिट्टी का विश्लेषण करें",
      analyzing: "विश्लेषण कर रहे हैं...",
      irrigationAnalysis: "सिंचाई विश्लेषण",
      fertilityReport: "मिट्टी उर्वरता रिपोर्ट",
      recommendedCrops: "अनुशंसित फसलें",
      improvements: "सुधार सुझाव",
      exportReport: "रिपोर्ट निर्यात करें",
      sendToAnalysis: "विश्लेषण के लिए भेजें",
      soilParameters: "मिट्टी के पैरामीटर",
      enterResults: "अपनी मिट्टी परीक्षण परिणाम और पर्यावरणीय स्थितियां दर्ज करें",
      overallFertility: "समग्र उर्वरता",
      irrigationScore: "सिंचाई स्कोर",
    },
  },
  or: {
    sidebar: {
      dashboard: "ଡ୍ୟାଶବୋର୍ଡ",
      analysis: "ବିଶ୍ଳେଷଣ",
      pestDisease: "କୀଟ ଏବଂ ରୋଗ",
      marketPrices: "ବଜାର ମୂଲ୍ୟ",
      settings: "ସେଟିଂସ",
      fieldManagement: "କ୍ଷେତ୍ର ପରିଚାଳନା",
      weather: "ପାଣିପାଗ",
      soilAnalysis: "ମାଟି ବିଶ୍ଳେଷଣ",
    },
    dashboard: {
      goodMorning: "ସୁପ୍ରଭାତ",
      goodAfternoon: "ନମସ୍କାର",
      goodEvening: "ଶୁଭ ସନ୍ଧ୍ୟା",
      avgTemp: "ହାରାହାରି ତାପମାତ୍ରା",
      rainfall: "ବୃଷ୍ଟିପାତ",
      rainfallUnit: "ମିମି ଏହି ମାସରେ",
      sunlight: "ସୂର୍ଯ୍ୟାଲୋକ ଘଣ୍ଟା",
      sunlightUnit: "ହାରାହାରି ଦୈନିକ",
      wind: "ପବନର ବେଗ",
      quickActions: "ଶୀଘ୍ର କାର୍ଯ୍ୟ",
      quickActionsDesc: "ଏକ ନୂତନ ବିଶ୍ଳେଷଣ ସହିତ ଆରମ୍ଭ କରନ୍ତୁ କିମ୍ବା ଆପଣଙ୍କର କ୍ଷେତ୍ରଗୁଡିକ ଦେଖନ୍ତୁ।",
      newAnalysis: "ନୂଆ ବିଶ୍ଳେଷଣ",
      viewMap: "ମାନଚିତ୍ର ଦେଖନ୍ତୁ",
      welcomeTitle: "ଏଗ୍ରିଭିଜନ୍ ଏଆଇ ବିଷୟରେ",
      welcomeDesc: "ଫସଲ ଅମଳ ପୂର୍ବାନୁମାନ ଏବଂ ଅପ୍ଟିମାଇଜେସନ୍ ପାଇଁ ଆପଣଙ୍କର ଏଆଇ-ଚାଳିତ ସହାୟକ।",
      welcomeContent: "ବିଭିନ୍ନ ବୈଶିଷ୍ଟ୍ୟଗୁଡିକ ଅନୁସନ୍ଧାନ କରିବାକୁ ବାମପଟେ ଥିବା ନେଭିଗେସନ୍ ବ୍ୟବହାର କରନ୍ତୁ। ଏକ ନୂତନ ବିଶ୍ଳେଷଣ ଚଳାଇ କିମ୍ବା ଇଣ୍ଟରାକ୍ଟିଭ୍ ମାନଚିତ୍ର ଅନୁସନ୍ଧାନ କରି ଆରମ୍ଭ କରନ୍ତୁ।",
    },
    settings: {
        title: "ସେଟିଂସ",
        description: "ଆପଣଙ୍କର ଆପ୍ଲିକେସନ୍ ସେଟିଂସ ଏବଂ ପସନ୍ଦଗୁଡିକ ପରିଚାଳନା କରନ୍ତୁ।",
        profile: {
            title: "ପ୍ରୋଫାଇଲ୍",
            description: "ଆପଣଙ୍କର ବ୍ୟକ୍ତିଗତ ସୂଚନା ଅଦ୍ୟତନ କରନ୍ତୁ।",
            firstName: "ପ୍ରଥମ ନାମ",
            lastName: "ଶେଷ ନାମ",
            email: "ଇମେଲ୍",
            updateButton: "ପ୍ରୋଫାଇଲ୍ ଅଦ୍ୟତନ କରନ୍ତୁ",
        },
        preferences: {
            title: "ପସନ୍ଦ",
            description: "ଆପଣଙ୍କର ଅନୁଭୂତି କଷ୍ଟମାଇଜ୍ କରନ୍ତୁ।",
            darkMode: "ଡାର୍କ ମୋଡ୍",
            darkModeDesc: "ଡାର୍କ କଲର୍ ସ୍କିମ୍ ସକ୍ଷମ କିମ୍ବା ଅକ୍ଷମ କରନ୍ତୁ।",
            language: "ଭାଷା",
            languageDesc: "ଇଣ୍ଟରଫେସ୍ ପାଇଁ ଆପଣଙ୍କର ପସନ୍ଦିତ ଭାଷା ବାଛନ୍ତୁ।",
            selectLanguage: "ଭାଷା ବାଛନ୍ତୁ",
            emailNotifications: "ଇମେଲ୍ ବିଜ୍ଞପ୍ତି",
            emailNotificationsDesc: "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଅଦ୍ୟତନ ପାଇଁ ଇମେଲ୍ ବିଜ୍ଞପ୍ତି ଗ୍ରହଣ କରନ୍ତୁ।",
        },
        apiKeys: {
            title: "API କୀ",
            description: "ତୃତୀୟ-ପକ୍ଷ ଏକୀକରଣ ପାଇଁ ଆପଣଙ୍କର API କୀ ପରିଚାଳନା କରନ୍ତୁ।",
            gmapsKey: "ଗୁଗୁଲ୍ ମ୍ୟାପ୍ସ API କୀ",
            gmapsKeyDesc: "ଏହି କୀ ମାନଚିତ୍ର କାର୍ଯ୍ୟକାରିତା ପାଇଁ ବ୍ୟବହୃତ ହୁଏ।",
            revokeButton: "ପ୍ରତ୍ୟାହାର କରନ୍ତୁ",
            generateButton: "ନୂଆ କୀ ସୃଷ୍ଟି କରନ୍ତୁ",
        },
        myFields: {
          title: "ମୋର କ୍ଷେତ୍ର",
          description: "ଶୀଘ୍ର ପ୍ରବେଶ ପାଇଁ ଆପଣଙ୍କର ସଞ୍ଚିତ କ୍ଷେତ୍ରଗୁଡିକ ପରିଚାଳନା କରନ୍ତୁ।",
          newFieldButton: "ନୂଆ କ୍ଷେତ୍ର ଯୋଡନ୍ତୁ",
          fieldName: "କ୍ଷେତ୍ର ନାମ / ଡାକନାମ",
          fieldLocation: "କ୍ଷେତ୍ର ସ୍ଥାନ",
          fieldCrop: "ମୁଖ୍ୟ ଫସଲ",
          fieldSize: "ଆକାର",
          fieldSizeUnit: "ହେକ୍ଟର",
          noFields: "ଆପଣ ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି କ୍ଷେତ୍ର ଯୋଡି ନାହାଁନ୍ତି।",
          editField: "କ୍ଷେତ୍ର ସମ୍ପାଦନ କରନ୍ତୁ",
          deleteField: "କ୍ଷେତ୍ର ବିଲୋପ କରନ୍ତୁ",
          deleteConfirmTitle: "ଆପଣ ନିଶ୍ଚିତ କି?",
          deleteConfirmText: "ଏହି କାର୍ଯ୍ୟକୁ ପୂର୍ବବତ୍ କରାଯାଇପାରିବ ନାହିଁ। ଏହା ଆପଣଙ୍କ କ୍ଷେତ୍ରକୁ ସ୍ଥାୟୀ ଭାବରେ ବିଲୋପ କରିବ।",
          cancel: "ବାତିଲ କରନ୍ତୁ",
          delete: "ବିଲୋପ କରନ୍ତୁ",
          addNewField: "ନୂଆ କ୍ଷେତ୍ର ଯୋଡନ୍ତୁ",
          saveChanges: "ପରିବର୍ତ୍ତନ ସଞ୍ଚୟ କରନ୍ତୁ",
        }
    },
    predictionTabs: {
        title: "ବିଶ୍ଳେଷଣ ଏବଂ ପୂର୍ବାନୁମାନ",
        description: "ଏକ ବିଶ୍ଳେଷଣ ପ୍ରକାର ବାଛନ୍ତୁ ଏବଂ ଆବଶ୍ୟକୀୟ ସୂଚନା ପ୍ରଦାନ କରନ୍ତୁ।",
        quickPredictionTab: "ଶୀଘ୍ର ପୂର୍ବାନୁମାନ",
        detailedAnalysisTab: "ବିସ୍ତୃତ ବିଶ୍ଳେଷଣ",
        fieldDescriptionLabel: "କ୍ଷେତ୍ରର ବିବରଣୀ",
        fieldDescriptionPlaceholder: "ଆପଣଙ୍କ କ୍ଷେତ୍ରର ବର୍ଣ୍ଣନା କରନ୍ତୁ, ଯେଉଁଥିରେ ଫସଲ ପ୍ରକାର, ମାଟିର ଅବସ୍ଥା, ଏବଂ ସାମ୍ପ୍ରତିକ ପାଣିପାଗ ଅନ୍ତର୍ଭୁକ୍ତ।",
        fieldDescriptionHelper: "ଏକ ଭଲ ପୂର୍ବାନୁମାନ ପାଇଁ ଯଥାସମ୍ଭବ ବିସ୍ତୃତ ବିବରଣୀ ପ୍ରଦାନ କରନ୍ତୁ।",
        getQuickPredictionButton: "ଶୀଘ୍ର ପୂର୍ବାନୁମାନ ପାଆନ୍ତୁ",
        getDetailedAnalysisButton: "ବିସ୍ତୃତ ବିଶ୍ଳେଷଣ ଚଲାନ୍ତୁ |",
        analyzing: "ବିଶ୍ଳେଷଣ କରାଯାଉଛି...",
        selectLocationWarning: "ଦୟାକରି ପ୍ରଥମେ ଏକ ସ୍ଥାନ ପ୍ରବେଶ କରନ୍ତୁ।",
        showMoreParams: "ଅଧିକ ପାରାମିଟର ଦେଖାନ୍ତୁ",
        form: {
            cropType: "ଫସଲ ପ୍ରକାର",
            sowingDate: "ବୁଣିବା ତାରିଖ",
            soilN: "ମାଟିରେ ନାଇଟ୍ରୋଜେନ୍",
            seasonalRainfall: "ଋତୁକାଳୀନ ବର୍ଷା (ମିମି)",
            expectedRainfall: "ଆଶା କରାଯାଉଥିବା ବର୍ଷା (ମିମି)",
            ndviDeclineRate: "NDVI ହ୍ରାସ ହାର",
            consecutiveDryDays: "କ୍ରମାଗତ ଶୁଖିଲା ଦିନ",
            gdd: "ବଢୁଥିବା ଡିଗ୍ରୀ ଦିନ",
            soilPh: "ମାଟିର pH",
            soilSoc: "ମୃତ୍ତିକା ଜୈବିକ କାର୍ବନ",
            soilClayPct: "ମାଟିରେ ମାଟି %",
            ndviMean: "ମଧ୍ୟମ NDVI",
            ndviMax: "ସର୍ବାଧିକ NDVI",
            ndviAuc: "NDVI AUC",
            ndviPeakDate: "NDVI ଶିଖର ତାରିଖ",
            historicalYield: "ଐତିହାସିକ ଅମଳ (ଟନ୍/ହେକ୍ଟର)",
        },
        quickPredictionSuccessTitle: "ପୂର୍ବାନୁମାନ ସଫଳ",
        quickPredictionSuccessDescription: "ଅମଳ ପୂର୍ବାନୁମାନ ସୃଷ୍ଟି କରାଯାଇଛି।",
        predictionFailedTitle: "ପୂର୍ବାନୁମାନ ବିଫଳ",
        locationNotSetTitle: "ସ୍ଥାନ ସେଟ୍ ହୋଇନାହିଁ",
        locationNotSetDescription: "ଦୟାକରି ଏକ ଅକ୍ଷାଂଶ ଏବଂ ଦ୍ରାଘିମା ପ୍ରବେଶ କରନ୍ତୁ।",
        recommendationFailedTitle: "ସୁପାରିଶ ବିଫଳ",
        explanationFailedTitle: "ବ୍ୟାଖ୍ୟା ବିଫଳ",
        analysisCompleteTitle: "ବିଶ୍ଳେଷଣ ସମ୍ପୂର୍ଣ୍ଣ",
        analysisCompleteDescription: "ବିସ୍ତୃତ ବିଶ୍ଳେଷଣ ଫଳାଫଳ ପ୍ରସ୍ତୁତ।",
    },
    results: {
        awaitingAnalysis: "ବିଶ୍ଳେଷଣ ପାଇଁ ଅପେକ୍ଷା",
        resultsWillAppear: "ଆପଣ ଏକ ବିଶ୍ଳେଷଣ ଚଳାଇବା ପରେ ଆପଣଙ୍କର ପୂର୍ବାନୁମାନ ଫଳାଫଳ ଏଠାରେ ଦେଖାଯିବ।",
        analysisResults: "ବିଶ୍ଳେଷଣ ଫଳାଫଳ",
        resultsDescription: "ଆପଣଙ୍କ ଇନପୁଟ୍ ଉପରେ ଆଧାରିତ ଅମଳ ପୂର୍ବାନୁମାନ ଏବଂ କାର୍ଯ୍ୟକ୍ଷମ ସୁପାରିଶ।",
        predictedYield: "ଅନୁମାନିତ ଅମଳ (ଟନ୍/ହେକ୍ଟର)",
        confidence: "ଆତ୍ମବିଶ୍ୱାସ",
        recommendations: "ସୁପାରିଶ",
        aiExplanation: "AI ବ୍ୟାଖ୍ୟା",
        localizedRecommendations: "ସ୍ଥାନୀୟ ସୁପାରିଶ",
        audioReadout: "ଅଡିଓ ରିଡଆଉଟ୍",
        audioNotSupported: "ଆପଣଙ୍କ ବ୍ରାଉଜର୍ ଅଡିଓ ଏଲିମେଣ୍ଟକୁ ସମର୍ଥନ କରେ ନାହିଁ।",
        predictionFactors: "ପୂର୍ବାନୁମାନ କାରକଗୁଡିକର ବ୍ୟାଖ୍ୟା",
        ndviTrend: "ସିମୁଲେଟେଡ୍ NDVI ଟ୍ରେଣ୍ଡ",
    },
    pestDisease: {
      title: "କୀଟ ଏବଂ ରୋଗ ଚିହ୍ନଟ",
      description: "ସମ୍ଭାବ୍ୟ ରୋଗ କିମ୍ବା କୀଟ ଚିହ୍ନଟ କରିବାକୁ ଏକ ଉଦ୍ଭିଦର ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ।",
      uploadCardTitle: "ପ୍ରତିଛବି ଅପଲੋଡ୍ କରନ୍ତୁ",
      uploadCardDescription: "ଏକ ଫାଇଲ୍ ବାଛନ୍ତୁ କିମ୍ବା ଫଟୋ କ୍ୟାପଚର୍ କରିବାକୁ ଆପଣଙ୍କ ୱେବକ୍ୟାମ୍ ବ୍ୟବହାର କରନ୍ତୁ।",
      uploadButton: "ଫାଇଲ୍ ବାଛନ୍ତୁ",
      useWebcamButton: "ୱେବକ୍ୟାମ୍ ବ୍ୟବହାର କରନ୍ତୁ",
      or: "କିମ୍ବା",
      diagnoseButton: "ଉଦ୍ଭିଦର ନିରାକରଣ କରନ୍ତୁ",
      analyzing: "ନିରାକରଣ କରାଯାଉଛି...",
      diagnosisResult: "ନିରାକରଣ ଫଳାଫଳ",
      plantName: "ଉଦ୍ଭିଦର ନାମ",
      latinName: "ଲାଟିନ୍ ନାମ",
      isHealthy: "ସ୍ୱାସ୍ଥ୍ୟବାନ୍ କି?",
      healthy: "ସ୍ୱାସ୍ଥ୍ୟବାନ୍",
      unhealthy: "ଅସୁସ୍ଥ",
      diagnosis: "ନିରାକରଣ",
      notAPlant: "ଉଦ୍ଭିଦ ନୁହେଁ",
      notAPlantDescription: "AI ନିର୍ଣ୍ଣୟ କରିଛି ଯେ ପ୍ରତିଛବିଟି ସମ୍ଭବତଃ ଏକ ଉଦ୍ଭିଦ ନୁହେଁ। ଦୟାକରି ଅନ୍ୟ ଏକ ପ୍ରତିଛବି ଚେଷ୍ଟା କରନ୍ତୁ।",
      awaitingDiagnosis: "ନିରାକରଣକୁ ଅପେକ୍ଷା କରୁଛି",
      awaitingDiagnosisDescription: "ଫଳାଫଳ ଦେଖିବାକୁ ଏକ ଉଦ୍ଭିଦ ପ୍ରତିଛବି ଅପଲੋଡ୍ କରନ୍ତୁ ଏବଂ 'ନିରାକରଣ' କ୍ଲିକ୍ କରନ୍ତୁ।",
      diagnosisError: "ନିରାକରଣ ସମୟରେ ଏକ ତ୍ରୁଟି ଘଟିଛି। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।",
      webcamTitle: "ୱେବକ୍ୟାମ୍ କ୍ୟାପଚର୍",
      webcamDescription: "ଫ୍ରେମରେ ଉଦ୍ଭିଦକୁ ସ୍ଥିର କରନ୍ତୁ ଏବଂ କ୍ୟାପଚର୍ କ୍ଲିକ୍ କରନ୍ତୁ।",
      captureButton: "କ୍ୟାପଚର୍",
      retakeButton: "ପୁନର୍ବାର ନିଅନ୍ତୁ",
      usePhotoButton: "ଏହି ଫଟୋ ବ୍ୟବହାର କରନ୍ତୁ",
      cameraPermissionRequired: "କ୍ୟାମେରା ପ୍ରବେଶ ଆବଶ୍ୟକ",
      cameraPermissionDescription: "ଏହି ବୈଶିଷ୍ଟ୍ୟକୁ ବ୍ୟବହାର କରିବାକୁ ଦୟାକରି କ୍ୟାମେରା ପ୍ରବେଶ ଅନୁମତି ଦିଅନ୍ତୁ।",
      symptoms: "ଲକ୍ଷଣ",
      precautions: "ସତର୍କତା",
      cure: "ନିରାକରଣ / ଚିକିତ୍ସା",
      plantHistory: "ଉଦ୍ଭିଦ ଇତିହାସ ଏବଂ ବୈଶିଷ୍ଟ୍ୟ",
      idealConditions: "ଆଦର୍ଶ ବଢୁଥିବା ପରିସ୍ଥିତି",
    },
    market: {
        title: "ବଜାର ମୂଲ୍ୟ",
        description: "ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ଫସଲ ପାଇଁ ନବୀନତମ ସିମୁଲେଟେଡ୍ ବଜାର ମୂଲ୍ୟ ପ୍ରାପ୍ତ କରନ୍ତୁ।",
        location: "ସ୍ଥାନ",
        crop: "ଫସଲ",
        fetchPricesButton: "ମୂଲ୍ୟ ପ୍ରାପ୍ତ କରନ୍ତୁ",
        fetching: "ପ୍ରାପ୍ତ କରୁଛି...",
        marketPrices: "ବଜାର ମୂଲ୍ୟ",
        lastUpdated: "ଶେଷ ଅଦ୍ୟତନ",
        grade: "ଗ୍ରେଡ୍",
        pricePerUnit: (unit: string) => `ମୂଲ୍ୟ / ${unit}`,
        trend: "ପ୍ରବୃତ୍ତି",
        unit: "ଏକକ",
        quintal: "କ୍ୱିଣ୍ଟାଲ",
        tonne: "ଟନ୍",
        kg: "କିଗ୍ରା",
        grades: {
          "Premium Quality": "ପ୍ରିମିୟମ୍ ଗୁଣବତ୍ତା",
          "Standard Quality": "ମାନକ ଗୁଣବତ୍ତା",
          "Fair Quality": "ଉଚିତ୍ ଗୁଣବତ୍ତା",
        },
    },
    fieldManagement: {
      title: "କ୍ଷେତ୍ର ପରିଚାଳନା",
      description: "ସ୍ୱୟଂଚାଳିତ କ୍ଷେତ୍ରଫଳ ଗଣନା ସହିତ ଆପଣଙ୍କ କୃଷି କ୍ଷେତ୍ରଗୁଡ଼ିକୁ ଅଙ୍କନ ଏବଂ ପରିଚାଳନା କରନ୍ତୁ",
      yourFields: "ଆପଣଙ୍କ କ୍ଷେତ୍ର",
      noFields: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି କ୍ଷେତ୍ର ନାହିଁ",
      drawField: "କ୍ଷେତ୍ର ଅଙ୍କନ କରନ୍ତୁ",
      cancelDrawing: "ବାତିଲ କରନ୍ତୁ",
      saveField: "କ୍ଷେତ୍ର ସଂରକ୍ଷଣ କରନ୍ତୁ",
      fieldName: "କ୍ଷେତ୍ର ନାମ",
      location: "ସ୍ଥାନ",
      crop: "ଫସଲ",
      area: "କ୍ଷେତ୍ରଫଳ",
      coordinates: "ସ୍ଥାନାଙ୍କ",
      totalArea: "ମୋଟ କ୍ଷେତ୍ରଫଳ",
      editField: "ସମ୍ପାଦନା କରନ୍ତୁ",
      deleteField: "ବିଲୋପ କରନ୍ତୁ",
      sendToAnalysis: "ବିଶ୍ଳେଷଣକୁ ପଠାନ୍ତୁ",
      interactiveMap: "ଇଣ୍ଟରାକ୍ଟିଭ୍ ଫିଲ୍ଡ ମ୍ୟାପ୍",
      useTools: "ଆପଣଙ୍କ କ୍ଷେତ୍ର ଅଙ୍କନ କରିବାକୁ ଉପକରଣଗୁଡିକ ବ୍ୟବହାର କରନ୍ତୁ",
      viewManage: "ଆପଣଙ୍କ କ୍ଷେତ୍ରଗୁଡ଼ିକୁ ଦେଖନ୍ତୁ ଏବଂ ପରିଚାଳନା କରନ୍ତୁ",
    },
    weather: {
      title: "ପାଣିପାଗ ସୂଚନା",
      description: "ଆପଣଙ୍କ କ୍ଷେତ୍ର ପାଇଁ ରିଅଲ-ଟାଇମ୍ ପାଣିପାଗ, ପୂର୍ବାନୁମାନ ଏବଂ ଐତିହାସିକ ତଥ୍ୟ",
      currentWeather: "ବର୍ତ୍ତମାନ ପାଣିପାଗ",
      forecast: "7-ଦିନର ପୂର୍ବାନୁମାନ",
      historical: "ଐତିହାସିକ ତଥ୍ୟ",
      selectLocation: "ସ୍ଥାନ ଚୟନ କରନ୍ତୁ",
      currentLocation: "ବର୍ତ୍ତମାନ ସ୍ଥାନ",
      yourFields: "ଆପଣଙ୍କ କ୍ଷେତ୍ର",
      temperature: "ତାପମାତ୍ରା",
      humidity: "ଆର୍ଦ୍ରତା",
      windSpeed: "ପବନର ଗତି",
      pressure: "ଚାପ",
      visibility: "ଦୃଶ୍ୟମାନତା",
      condition: "ଅବସ୍ଥା",
      export: "ରପ୍ତାନି କରନ୍ତୁ",
      sendToAnalysis: "ବିଶ୍ଳେଷଣକୁ ପଠାନ୍ତୁ",
      feelsLike: "ଅନୁଭବ ହୁଏ",
      forecastAvailable: "ପୂର୍ବାନୁମାନ ଉପଲବ୍ଧ",
      daysData: "ଦିନର ପୂର୍ବାନୁମାନ ତଥ୍ୟ ଅନ୍ତର୍ଭୁକ୍ତ",
    },
    soilAnalysis: {
      title: "ମାଟି ବିଶ୍ଳେଷଣ",
      description: "ଆପଣଙ୍କ ମାଟିର ଗଠନ ବିଶ୍ଳେଷଣ କରନ୍ତୁ ଏବଂ AI-ଚାଳିତ ସୁପାରିଶ ପ୍ରାପ୍ତ କରନ୍ତୁ",
      nitrogen: "ନାଇଟ୍ରୋଜେନ୍ (N)",
      phosphorus: "ଫସଫରସ୍ (P)",
      potassium: "ପୋଟାସିୟମ୍ (K)",
      temperature: "ତାପମାତ୍ରା",
      humidity: "ଆର୍ଦ୍ରତା",
      ph: "pH ସ୍ତର",
      rainfall: "ବର୍ଷା",
      analyzeSoil: "ମାଟି ବିଶ୍ଳେଷଣ କରନ୍ତୁ",
      analyzing: "ବିଶ୍ଳେଷଣ କରୁଛି...",
      irrigationAnalysis: "ଜଳସେଚନ ବିଶ୍ଳେଷଣ",
      fertilityReport: "ମାଟି ଉର୍ବରତା ରିପୋର୍ଟ",
      recommendedCrops: "ପରାମର୍ଶିତ ଫସଲ",
      improvements: "ଉନ୍ନତି ପରାମର୍ଶ",
      exportReport: "ରିପୋର୍ଟ ରପ୍ତାନି କରନ୍ତୁ",
      sendToAnalysis: "ବିଶ୍ଳେଷଣକୁ ପଠାନ୍ତୁ",
      soilParameters: "ମାଟି ପାରାମିଟର",
      enterResults: "ଆପଣଙ୍କ ମାଟି ପରୀକ୍ଷା ଫଳାଫଳ ଏବଂ ପରିବେଶ ଅବସ୍ଥା ପ୍ରବେଶ କରନ୍ତୁ",
      overallFertility: "ସାମଗ୍ରିକ ଉର୍ବରତା",
      irrigationScore: "ଜଳସେଚନ ସ୍କୋର",
    },
  },
  te: {
    sidebar: {
      dashboard: "డాష్‌బోర్డ్",
      analysis: "విశ్లేషణ",
      pestDisease: "తెగులు & వ్యాధి",
      marketPrices: "మార్కెట్ ధరలు",
      settings: "సెట్టింగ్‌లు",
      fieldManagement: "పొలం నిర్వహణ",
      weather: "వాతావరణం",
      soilAnalysis: "నేల విశ్లేషణ",
    },
    dashboard: {
      goodMorning: "శుభోదయం",
      goodAfternoon: "శుభ మధ్యాహ్నం",
      goodEvening: "శుభ సాయంత్రం",
      avgTemp: "సగటు ఉష్ణోగ్రత",
      rainfall: "వర్షపాతం",
      rainfallUnit: "మిమీ ఈ నెల",
      sunlight: "సూర్యరశ్మి గంటలు",
      sunlightUnit: "సగటు రోజువారీ",
      wind: "గాలి వేగం",
      quickActions: "త్వరిత చర్యలు",
      quickActionsDesc: "కొత్త విశ్లేషణతో ప్రారంభించండి లేదా మీ ఫీల్డ్‌లను వీక్షించండి.",
      newAnalysis: "కొత్త విశ్లేషణ",
      viewMap: "మ్యాప్‌ను వీక్షించండి",
      welcomeTitle: "అగ్రివిజన్ AI గురించి",
      welcomeDesc: "పంట దిగుబడి అంచనా మరియు ఆప్టిమైజేషన్ కోసం మీ AI-ఆధారిత సహాయకుడు.",
      welcomeContent: "వివిధ ఫీచర్‌లను అన్వేషించడానికి ఎడమ వైపున ఉన్న నావిగేషన్‌ను ఉపయోగించండి. కొత్త విశ్లేషణను అమలు చేయడం ద్వారా లేదా ఇంటరాక్టివ్ మ్యాప్‌ను అన్వేషించడం ద్వారా ప్రారంభించండి.",
    },
    settings: {
      title: "సెట్టింగ్‌లు",
      description: "మీ అప్లికేషన్ సెట్టింగ్‌లు మరియు ప్రాధాన్యతలను నిర్వహించండి.",
      profile: {
        title: "ప్రొఫైల్",
        description: "మీ వ్యక్తిగత సమాచారాన్ని నవీకరించండి.",
        firstName: "మొదటి పేరు",
        lastName: "చివరి పేరు",
        email: "ఇమెయిల్",
        updateButton: "ప్రొఫైల్‌ను నవీకరించండి",
      },
      preferences: {
        title: "ప్రాధాన్యతలు",
        description: "మీ అనుభవాన్ని అనుకూలీకరించండి.",
        darkMode: "డార్క్ మోడ్",
        darkModeDesc: "డార్క్ కలర్ స్కీమ్‌ను ప్రారంభించండి లేదా నిలిపివేయండి.",
        language: "భాష",
        languageDesc: "ఇంటర్‌ఫేస్ కోసం మీ ఇష్టపడే భాషను ఎంచుకోండి.",
        selectLanguage: "భాషను ఎంచుకోండి",
        emailNotifications: "ఇమెయిల్ నోటిఫికేషన్‌లు",
        emailNotificationsDesc: "ముఖ్యమైన నవీకరణల కోసం ఇమెయిల్ నోటిఫికేషన్‌లను స్వీకరించండి.",
      },
      apiKeys: {
        title: "API కీలు",
        description: "మూడవ పక్షం అనుసంధానాల కోసం మీ API కీలను నిర్వహించండి.",
        gmapsKey: "Google Maps API కీ",
        gmapsKeyDesc: "ఈ కీ మ్యాప్ కార్యాచరణల కోసం ఉపయోగించబడుతుంది.",
        revokeButton: "రద్దు చేయండి",
        generateButton: "కొత్త కీని రూపొందించండి",
      },
      myFields: {
        title: "నా ఫీల్డ్‌లు",
        description: "త్వరిత ప్రాప్యత కోసం మీ సేవ్ చేసిన ఫీల్డ్‌లను నిర్వహించండి.",
        newFieldButton: "కొత్త ఫీల్డ్‌ను జోడించండి",
        fieldName: "ఫీల్డ్ పేరు / ముద్దుపేరు",
        fieldLocation: "ఫీల్డ్ స్థానం",
        fieldCrop: "ప్రధాన పంట",
        fieldSize: "పరిమాణం",
        fieldSizeUnit: "హెక్టార్లు",
        noFields: "మీరు ఇంకా ఏ ఫీల్డ్‌లను జోడించలేదు.",
        editField: "ఫీల్డ్‌ను సవరించండి",
        deleteField: "ఫీల్డ్‌ను తొలగించండి",
        deleteConfirmTitle: "మీరు ఖచ్చితంగా ఉన్నారా?",
        deleteConfirmText: "ఈ చర్యను రద్దు చేయలేరు. ఇది మీ ఫీల్డ్‌ను శాశ్వతంగా తొలగిస్తుంది.",
        cancel: "రద్దు చేయి",
        delete: "తొలగించు",
        addNewField: "కొత్త ఫీల్డ్‌ను జోడించండి",
        saveChanges: "మార్పులను భద్రపరచు",
      },
    },
    predictionTabs: {
      title: "విశ్లేషణ & అంచనా",
      description: "విశ్లేషణ రకాన్ని ఎంచుకుని, అవసరమైన సమాచారాన్ని అందించండి.",
      quickPredictionTab: "త్వరిత అంచనా",
      detailedAnalysisTab: "వివరణాత్మక విశ్లేషణ",
      fieldDescriptionLabel: "ఫీల్డ్ వివరణ",
      fieldDescriptionPlaceholder: "పంట రకం, నేల పరిస్థితి మరియు ఇటీవలి వాతావరణంతో సహా మీ ఫీల్డ్‌ను వివరించండి...",
      fieldDescriptionHelper: "మంచి అంచనా కోసం వీలైనంత ఎక్కువ వివరాలను అందించండి.",
      getQuickPredictionButton: "త్వరిత అంచనా పొందండి",
      getDetailedAnalysisButton: "వివరణాత్మక విశ్లేషణను అమలు చేయండి",
      analyzing: "విశ్లేషిస్తోంది...",
      selectLocationWarning: "దయచేసి ముందుగా ఒక స్థానాన్ని నమోదు చేయండి.",
      showMoreParams: "మరిన్ని పారామితులను చూపండి",
      form: {
        cropType: "పంట రకం",
        sowingDate: "విత్తే తేదీ",
        soilN: "నేలలో నత్రజని",
        seasonalRainfall: "కాలానుగుణ వర్షపాతం (మిమీ)",
        expectedRainfall: "అપેక్షిత వర్షపాతం (మిమీ)",
        ndviDeclineRate: "NDVI క్షీణత రేటు",
        consecutiveDryDays: "వరుస పొడి రోజులు",
        gdd: "పెరుగుతున్న డిగ్రీ రోజులు",
        soilPh: "నేల pH",
        soilSoc: "నేల సేంద్రీయ కార్బన్",
        soilClayPct: "నేల బంకమన్ను శాతం",
        ndviMean: "NDVI సగటు",
        ndviMax: "NDVI గరిష్టం",
        ndviAuc: "NDVI AUC",
        ndviPeakDate: "NDVI గరిష్ట తేదీ",
        historicalYield: "చారిత్రక దిగుబడి (టన్నులు/హెక్టారు)",
      },
      quickPredictionSuccessTitle: "అంచనా విజయవంతమైంది",
      quickPredictionSuccessDescription: "దిగుబడి అంచనా రూపొందించబడింది.",
      predictionFailedTitle: "అంచనా విఫలమైంది",
      locationNotSetTitle: "స్థానం సెట్ చేయబడలేదు",
      locationNotSetDescription: "దయచేసి ఒక అక్షాంశం మరియు రేఖాంశం నమోదు చేయండి.",
      recommendationFailedTitle: "సిఫార్సు విఫలమైంది",
      explanationFailedTitle: "వివరణ విఫలమైంది",
      analysisCompleteTitle: "విశ్లేషణ పూర్తయింది",
      analysisCompleteDescription: "వివరణాత్మక విశ్లేషణ ఫలితాలు సిద్ధంగా ఉన్నాయి.",
    },
    results: {
      awaitingAnalysis: "విశ్లేషణ కోసం వేచి ఉంది",
      resultsWillAppear: "మీరు విశ్లేషణను అమలు చేసిన తర్వాత మీ అంచనా ఫలితాలు ఇక్కడ కనిపిస్తాయి.",
      analysisResults: "విశ్లేషణ ఫలితాలు",
      resultsDescription: "మీ ఇన్‌పుట్‌ల ఆధారంగా దిగుబడి అంచనాలు మరియు కార్యాచరణ సిఫార్సులు.",
      predictedYield: "అంచనా వేసిన దిగుబడి (టన్నులు/హెక్టారు)",
      confidence: "విశ్వాసం",
      recommendations: "సిఫార్సులు",
      aiExplanation: "AI వివరణ",
      localizedRecommendations: "స్థానికీకరించిన సిఫార్సులు",
      audioReadout: "ఆడియో రీడౌట్",
      audioNotSupported: "మీ బ్రౌజర్ ఆడియో ఎలిమెంట్‌కు మద్దతు ఇవ్వదు.",
      predictionFactors: "అంచనా కారకాల వివరణ",
      ndviTrend: "అనుకరణ NDVI ట్రెండ్",
    },
    pestDisease: {
      title: "తెగులు & వ్యాధి గుర్తింపు",
      description: "సంభావ్య వ్యాధులు లేదా తెగుళ్లను గుర్తించడానికి మొక్క యొక్క ఫోటోను అప్‌లోడ్ చేయండి.",
      uploadCardTitle: "చిత్రాన్ని అప్‌లోడ్ చేయండి",
      uploadCardDescription: "ఫైల్‌ను ఎంచుకోండి లేదా ఫోటో తీయడానికి మీ వెబ్‌క్యామ్‌ను ఉపయోగించండి.",
      uploadButton: "ఫైల్‌ను ఎంచుకోండి",
      useWebcamButton: "వెబ్‌క్యామ్ ఉపయోగించండి",
      or: "లేదా",
      diagnoseButton: "మొక్కను నిర్ధారించండి",
      analyzing: "నిర్ధారణ చేస్తోంది...",
      diagnosisResult: "నిర్ధారణ ఫలితం",
      plantName: "మొక్క పేరు",
      latinName: "లాటిన్ పేరు",
      isHealthy: "ఆరోగ్యంగా ఉందా?",
      healthy: "ఆరోగ్యంగా ఉంది",
      unhealthy: "అనారోగ్యంగా ఉంది",
      diagnosis: "నిర్ధారణ",
      notAPlant: "మొక్క కాదు",
      notAPlantDescription: "AI ఈ చిత్రం మొక్క కాదని నిర్ధారించింది. దయచేసి మరో చిత్రాన్ని ప్రయత్నించండి.",
      awaitingDiagnosis: "నిర్ధారణ కోసం వేచి ఉంది",
      awaitingDiagnosisDescription: "ఫలితాలను చూడటానికి మొక్క చిత్రాన్ని అప్‌లోడ్ చేసి 'నిర్ధారించండి' క్లిక్ చేయండి.",
      diagnosisError: "నిర్ధారణ సమయంలో లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
      webcamTitle: "వెబ్‌క్యామ్ క్యాప్చర్",
      webcamDescription: "ఫ్రేమ్‌లో మొక్కను ఉంచి క్యాప్చర్ క్లిక్ చేయండి.",
      captureButton: "క్యాప్చర్",
      retakeButton: "మళ్లీ తీయండి",
      usePhotoButton: "ఈ ఫోటోను ఉపయోగించండి",
      cameraPermissionRequired: "కెమెరా యాక్సెస్ అవసరం",
      cameraPermissionDescription: "ఈ ఫీచర్‌ను ఉపయోగించడానికి దయచేసి కెమెరా యాక్సెస్‌ను అనుమతించండి.",
      symptoms: "లక్షణాలు",
      precautions: "జాగ్రత్తలు",
      cure: "నివారణ / చికిత్స",
      plantHistory: "మొక్క చరిత్ర & లక్షణాలు",
      idealConditions: "ఆదర్శ పెరుగుతున్న పరిస్థితులు",
    },
    market: {
      title: "మార్కెట్ ధరలు",
      description: "మీ ప్రాంతంలోని పంటల కోసం తాజా అనుకరణ మార్కెట్ ధరలను పొందండి.",
      location: "స్థానం",
      crop: "పంట",
      fetchPricesButton: "ధరలను పొందండి",
      fetching: "తెస్తోంది...",
      marketPrices: "మార్కెట్ ధరలు",
      lastUpdated: "చివరిగా నవీకరించబడింది",
      grade: "గ్రేడ్",
      pricePerUnit: (unit: string) => `ధర / ${unit}`,
      trend: "ట్రెండ్",
      unit: "యూనిట్",
      quintal: "క్వింటాల్",
      tonne: "టన్ను",
      kg: "కిలో",
      grades: {
        "Premium Quality": "ప్రీమియం నాణ్యత",
        "Standard Quality": "ప్రామాణిక నాణ్యత",
        "Fair Quality": "సరసమైన నాణ్యత",
      },
    },
    fieldManagement: {
      title: "పొలం నిర్వహణ",
      description: "స్వయంచాలక వైశాల్యం గణనతో మీ వ్యవసాయ పొలాలను గీయండి మరియు నిర్వహించండి",
      yourFields: "మీ పొలాలు",
      noFields: "ఇంకా పొలాలు లేవు",
      drawField: "పొలం గీయండి",
      cancelDrawing: "రద్దు చేయండి",
      saveField: "పొలం సేవ్ చేయండి",
      fieldName: "పొలం పేరు",
      location: "స్థానం",
      crop: "పంట",
      area: "వైశాల్యం",
      coordinates: "కోఆర్డినేట్స్",
      totalArea: "మొత్తం వైశాల్యం",
      editField: "సవరించండి",
      deleteField: "తొలగించండి",
      sendToAnalysis: "విశ్లేషణకు పంపండి",
      interactiveMap: "ఇంటరాక్టివ్ ఫీల్డ్ మ్యాప్",
      useTools: "మీ పొలాన్ని గీయడానికి సాధనాలను ఉపయోగించండి",
      viewManage: "మీ పొలాలను చూడండి మరియు నిర్వహించండి",
    },
    weather: {
      title: "వాతావరణ సమాచారం",
      description: "మీ పొలాల కోసం రియల్-టైమ్ వాతావరణం, అంచనాలు మరియు చారిత్రక డేటా",
      currentWeather: "ప్రస్తుత వాతావరణం",
      forecast: "7-రోజుల అంచనా",
      historical: "చారిత్రక డేటా",
      selectLocation: "స్థానం ఎంచుకోండి",
      currentLocation: "ప్రస్తుత స్థానం",
      yourFields: "మీ పొలాలు",
      temperature: "ఉష్ణోగ్రత",
      humidity: "తేమ",
      windSpeed: "గాలి వేగం",
      pressure: "ఒత్తిడి",
      visibility: "దృశ్యత",
      condition: "పరిస్థితి",
      export: "ఎగుమతి చేయండి",
      sendToAnalysis: "విశ్లేషణకు పంపండి",
      feelsLike: "అనిపిస్తుంది",
      forecastAvailable: "అంచనా అందుబాటులో ఉంది",
      daysData: "రోజుల అంచనా డేటా చేర్చబడింది",
    },
    soilAnalysis: {
      title: "నేల విశ్లేషణ",
      description: "మీ నేల కూర్పును విశ్లేషించండి మరియు AI-ఆధారిత సిఫార్సులను పొందండి",
      nitrogen: "నైట్రోజన్ (N)",
      phosphorus: "ఫాస్ఫరస్ (P)",
      potassium: "పొటాషియం (K)",
      temperature: "ఉష్ణోగ్రత",
      humidity: "తేమ",
      ph: "pH స్థాయి",
      rainfall: "వర్షపాతం",
      analyzeSoil: "నేలను విశ్లేషించండి",
      analyzing: "విశ్లేషిస్తోంది...",
      irrigationAnalysis: "నీటిపారుదల విశ్లేషణ",
      fertilityReport: "నేల సారవంతత నివేదిక",
      recommendedCrops: "సిఫార్సు చేయబడిన పంటలు",
      improvements: "మెరుగుదల సూచనలు",
      exportReport: "నివేదికను ఎగుమతి చేయండి",
      sendToAnalysis: "విశ్లేషణకు పంపండి",
      soilParameters: "నేల పారామితులు",
      enterResults: "మీ నేల పరీక్ష ఫలితాలు మరియు పర్యావరణ పరిస్థితులను నమోదు చేయండి",
      overallFertility: "మొత్తం సారవంతత",
      irrigationScore: "నీటిపారుదల స్కోర్",
    },
  },
};
