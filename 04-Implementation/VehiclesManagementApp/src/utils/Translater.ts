// react native
import { NativeModules } from "react-native";

// npm packages
import axios from "axios";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// project imports
import { en } from "../constants/Languages/English";
import { tr } from "../constants/Languages/Turkish";
import { ar } from "../constants/Languages/Arabic";

// current device's language
export const lng = NativeModules.I18nManager.localeIdentifier.split("_")[0];

/** Start Functions **/
export const initI18Next = i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng,
  fallbackLng: "en",
  resources: {
    en: {
      translation: en,
    },
    tr: {
      translation: tr,
    },
    ar: {
      translation: ar,
    },
  },
});

export async function translateText(text: string): Promise<string> {
  const apiKey = "AIzaSyBxehp7r1lMdZtjeXN7n4CG1gSSVs0W0Sk";

  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        q: text,
        target: lng,
      }
    );

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    return text;
  }
}

/** End Functions **/
