import { createContext, type ReactNode, useContext, useState } from "react";

type LabelContextType = {
  t: (key: string, values?: Record<string, string>) => string;
};

const translations = {
  en: {
    "button.submit": "Submit1",
    "button.cancel": "Cancel1",
  },

  de: {
    "button.submit": "Ausführen",
    "button.cancel": "Abbrechen",
  },
} as any;
export type Locale = keyof typeof translations;

const I18nContext = createContext<LabelContextType | undefined>(undefined);

export const I18nContextProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>("en");
  const t = (key: string, values?: Record<string, string>): string => {
    let translation = translations[locale][key] || key; // Fallback auf Key, falls nicht vorhanden

    if (values) {
      Object.keys(values).forEach((placeholder) => {
        translation = translation.replace(
          `{${placeholder}}`,
          values[placeholder],
        );
      });
    }

    return translation;
  };

  return <I18nContext.Provider value={{ t }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    return () => undefined;
  }
  return context.t;
};

const LabelContext = createContext<{ t: (key: string) => string } | undefined>(
  undefined,
);

export const LabelContextProvider = ({
  children,
  contextKey,
}: {
  children: ReactNode;
  contextKey: string;
}) => {
  const t = useI18n();

  const translate = (key: string): string => {
    console.log("Labels ", contextKey + "." + key);

    return t(contextKey + "." + key) || contextKey + "." + key;
  };

  return (
    <LabelContext.Provider value={{ t: translate }}>
      {children}
    </LabelContext.Provider>
  );
};

export const useLabels = () => {
  const t = useI18n();
  const context = useContext(LabelContext);
  if (!context) {
    return t;
  }
  return context.t;
};
