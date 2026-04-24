export type Language = "en" | "hi" | "mr";

export const LANGUAGES: { code: Language; label: string; speechCode: string }[] = [
  { code: "en", label: "English", speechCode: "en-IN" },
  { code: "hi", label: "हिन्दी", speechCode: "hi-IN" },
  { code: "mr", label: "मराठी", speechCode: "mr-IN" },
];

type TranslationStrings = {
  appName: string;
  appSubtitle: string;
  welcomeTitle: string;
  welcomeText: string;
  inputPlaceholder: string;
  disclaimer: string;
  chipEligible: string;
  chipForm6: string;
  chipEVM: string;
  chipDates: string;
  chipChecklist: string;
  demoTip: string;
  offline: string;
  voiceListening: string;
};

const translations: Record<Language, TranslationStrings> = {
  en: {
    appName: "ElectoGuide Bharat",
    appSubtitle: "AI Election Assistant",
    welcomeTitle: "Welcome to ElectoGuide Bharat",
    welcomeText: "Your AI-powered guide to Indian elections. Ask about voter registration, EVM voting, election dates, and more.",
    inputPlaceholder: "Ask about elections, voter ID, EVM...",
    disclaimer: "ElectoGuide provides educational info. Verify with ECI (eci.gov.in) for official details.",
    chipEligible: "Am I eligible to vote?",
    chipForm6: "How to fill Form 6?",
    chipEVM: "How does EVM work?",
    chipDates: "Election phase dates",
    chipChecklist: "Registration checklist",
    demoTip: "Running in demo mode. Add your Gemini API key for AI-powered responses!",
    offline: "You are offline. Some features may be limited.",
    voiceListening: "Listening...",
  },
  hi: {
    appName: "इलेक्टोगाइड भारत",
    appSubtitle: "AI चुनाव सहायक",
    welcomeTitle: "इलेक्टोगाइड भारत में आपका स्वागत है",
    welcomeText: "भारतीय चुनावों के लिए AI-संचालित गाइड। वोटर रजिस्ट्रेशन, EVM वोटिंग, चुनाव तिथियों के बारे में पूछें।",
    inputPlaceholder: "चुनाव, वोटर ID, EVM के बारे में पूछें...",
    disclaimer: "यह शैक्षिक जानकारी है। आधिकारिक जानकारी के लिए ECI (eci.gov.in) देखें।",
    chipEligible: "क्या मैं वोट दे सकता/सकती हूँ?",
    chipForm6: "फॉर्म 6 कैसे भरें?",
    chipEVM: "EVM कैसे काम करता है?",
    chipDates: "चुनाव चरण तिथियाँ",
    chipChecklist: "रजिस्ट्रेशन चेकलिस्ट",
    demoTip: "डेमो मोड में चल रहा है। AI उत्तरों के लिए Gemini API key जोड़ें!",
    offline: "आप ऑफ़लाइन हैं। कुछ सुविधाएँ सीमित हो सकती हैं।",
    voiceListening: "सुन रहा हूँ...",
  },
  mr: {
    appName: "इलेक्टोगाइड भारत",
    appSubtitle: "AI निवडणूक सहाय्यक",
    welcomeTitle: "इलेक्टोगाइड भारत मध्ये स्वागत",
    welcomeText: "भारतीय निवडणुकांसाठी AI-सक्षम मार्गदर्शक। मतदार नोंदणी, EVM मतदान, निवडणूक तारखांबद्दल विचारा.",
    inputPlaceholder: "निवडणूक, मतदार ID, EVM बद्दल विचारा...",
    disclaimer: "ही शैक्षणिक माहिती आहे. अधिकृत माहितीसाठी ECI (eci.gov.in) पहा.",
    chipEligible: "मी मतदान करू शकतो/शकते का?",
    chipForm6: "फॉर्म 6 कसा भरायचा?",
    chipEVM: "EVM कसे काम करते?",
    chipDates: "निवडणूक टप्पा तारखा",
    chipChecklist: "नोंदणी चेकलिस्ट",
    demoTip: "डेमो मोड मध्ये चालू आहे. AI उत्तरांसाठी Gemini API key जोडा!",
    offline: "तुम्ही ऑफलाइन आहात. काही वैशिष्ट्ये मर्यादित असू शकतात.",
    voiceListening: "ऐकत आहे...",
  },
};

export function t(lang: Language): TranslationStrings {
  return translations[lang] || translations.en;
}

export function getChips(lang: Language) {
  const s = t(lang);
  return [
    { label: s.chipEligible, key: "eligible" },
    { label: s.chipForm6, key: "form6" },
    { label: s.chipEVM, key: "evm" },
    { label: s.chipDates, key: "dates" },
    { label: s.chipChecklist, key: "checklist" },
  ];
}
