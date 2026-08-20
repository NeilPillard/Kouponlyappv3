import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AccessibilityInfo, DynamicColorIOS, Platform, PlatformColor, Pressable, Text, TextInput, useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  ink: string;
  inkOnAccent: string;
  blackSoft: string;
  lime: string;
  paper: string;
  elevated: string;
  card: string;
  muted: string;
  line: string;
  soft: string;
  success: string;
  danger: string;
  onDark: string;
  onDarkMuted: string;
  backdrop: string;
  glass: string;
  glassSolid: string;
  input: string;
}

export interface MotionPreferences {
  reduceMotion: boolean;
  reduceTransparency: boolean;
}

export interface Theme {
  mode: ThemeMode;
  dark: boolean;
  highContrast: boolean;
  boldText: boolean;
  colors: ThemeColors;
  motion: MotionPreferences;
}

const light: ThemeColors = {
  ink: "#0A0A0A", inkOnAccent: "#0A0A0A", blackSoft: "#202020", lime: "#B7F52B",
  paper: "#FAFAFA", elevated: "#FFFFFF", card: "#FFFFFF", muted: "#59595F",
  line: "rgba(10,10,10,0.12)", soft: "#F0F0F2", success: "#08784F", danger: "#B42318",
  onDark: "#FFFFFF", onDarkMuted: "#D0D0D4", backdrop: "rgba(0,0,0,0.52)",
  glass: "rgba(255,255,255,0.48)", glassSolid: "#F7F7F8", input: "#FFFFFF",
};

const dark: ThemeColors = {
  ink: "#F5F5F7", inkOnAccent: "#080808", blackSoft: "#E4E4E7", lime: "#B7F52B",
  paper: "#000000", elevated: "#1C1C1E", card: "#1C1C1E", muted: "#B8B8BE",
  line: "rgba(255,255,255,0.16)", soft: "#2C2C2E", success: "#52D69A", danger: "#FF6961",
  onDark: "#FFFFFF", onDarkMuted: "#D0D0D4", backdrop: "rgba(0,0,0,0.68)",
  glass: "rgba(28,28,30,0.54)", glassSolid: "#242426", input: "#1C1C1E",
};

function withContrast(colors: ThemeColors, mode: ThemeMode): ThemeColors {
  return mode === "dark"
    ? { ...colors, muted: "#E0E0E4", line: "rgba(255,255,255,0.34)" }
    : { ...colors, muted: "#3A3A3F", line: "rgba(0,0,0,0.26)" };
}

const fallback: Theme = {
  mode: "light", dark: false, highContrast: false, boldText: false, colors: light,
  motion: { reduceMotion: false, reduceTransparency: false },
};

const ThemeContext = createContext<Theme>(fallback);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [reduceTransparency, setReduceTransparency] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [boldText, setBoldText] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    AccessibilityInfo.isReduceTransparencyEnabled().then(setReduceTransparency);
    AccessibilityInfo.isBoldTextEnabled().then(setBoldText);
    const contrast = Platform.OS === "ios"
      ? AccessibilityInfo.isDarkerSystemColorsEnabled()
      : AccessibilityInfo.isHighTextContrastEnabled();
    contrast.then(setHighContrast).catch(() => undefined);
    const subscriptions = [
      AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion),
      AccessibilityInfo.addEventListener("reduceTransparencyChanged", setReduceTransparency),
      AccessibilityInfo.addEventListener("boldTextChanged", setBoldText),
      AccessibilityInfo.addEventListener(
        Platform.OS === "ios" ? "darkerSystemColorsChanged" : "highTextContrastChanged",
        setHighContrast,
      ),
    ];
    return () => subscriptions.forEach(subscription => subscription.remove());
  }, []);

  const value = useMemo<Theme>(() => {
    const mode: ThemeMode = system === "dark" ? "dark" : "light";
    const base = mode === "dark" ? dark : light;
    return {
      mode,
      dark: mode === "dark",
      highContrast,
      boldText,
      colors: highContrast ? withContrast(base, mode) : base,
      motion: { reduceMotion, reduceTransparency },
    };
  }, [system, highContrast, boldText, reduceMotion, reduceTransparency]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() { return useContext(ThemeContext); }
export function getTheme(mode: ThemeMode, highContrast = false): ThemeColors {
  const colors = mode === "dark" ? dark : light;
  return highContrast ? withContrast(colors, mode) : colors;
}

function channel(value:number){const normalized=value/255;return normalized<=0.03928?normalized/12.92:Math.pow((normalized+0.055)/1.055,2.4)}
export function contrastRatio(foreground:string,background:string){const parse=(color:string)=>{const hex=color.replace("#","");const expanded=hex.length===3?hex.split("").map(x=>x+x).join(""):hex;const [r,g,b]=[0,2,4].map(index=>parseInt(expanded.slice(index,index+2),16));return .2126*channel(r)+.7152*channel(g)+.0722*channel(b)};const a=parse(foreground),b=parse(background);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)}

// Legacy static styles receive platform-semantic colors while screens migrate to useAppTheme.
const adaptive=(lightColor:string,darkColor:string,android?:string)=>Platform.OS==="ios"
  ? DynamicColorIOS({light:lightColor,dark:darkColor,highContrastLight:lightColor,highContrastDark:darkColor})
  : Platform.OS==="android"&&android?PlatformColor(android):lightColor;
export const C:any = {
  ...light,
  ink:adaptive(light.ink,dark.ink,"?android:attr/textColorPrimary"),
  blackSoft:adaptive(light.blackSoft,dark.blackSoft,"?android:attr/textColorPrimary"),
  paper:adaptive(light.paper,dark.paper,"?android:attr/colorBackground"),
  elevated:adaptive(light.elevated,dark.elevated,"?android:attr/colorBackgroundFloating"),
  card:adaptive(light.card,dark.card,"?android:attr/colorBackgroundFloating"),
  muted:adaptive(light.muted,dark.muted,"?android:attr/textColorSecondary"),
  line:adaptive("rgba(10,10,10,0.12)","rgba(255,255,255,0.16)"),
  soft:adaptive(light.soft,dark.soft),
  glass:adaptive(light.glass,dark.glass),
  glassSolid:adaptive(light.glassSolid,dark.glassSolid,"?android:attr/colorBackgroundFloating"),
  input:adaptive(light.input,dark.input,"?android:attr/colorBackgroundFloating"),
};

// Ensure legacy screen copy follows appearance even before every Text node adopts AppText.
(Text as any).defaultProps = { ...(Text as any).defaultProps, allowFontScaling: true, maxFontSizeMultiplier: 2.4, style: [{ color: C.ink }, (Text as any).defaultProps?.style] };
(TextInput as any).defaultProps = { ...(TextInput as any).defaultProps, allowFontScaling: true, maxFontSizeMultiplier: 2.4, style: [{ color: C.ink }, (TextInput as any).defaultProps?.style] };
(Pressable as any).defaultProps = { ...(Pressable as any).defaultProps, accessibilityRole: "button", hitSlop: 4 };

export const F = {
  heading: "BricolageGrotesque_700Bold",
  headingSemi: "BricolageGrotesque_600SemiBold",
  body: "Manrope_500Medium",
  bodySemi: "Manrope_600SemiBold",
  bodyBold: "Manrope_800ExtraBold",
} as const;

export type TypographyVariant = "largeTitle" | "title" | "headline" | "body" | "callout" | "caption" | "eyebrow";

export const typography = {
  largeTitle: { fontFamily: F.heading, fontSize: 30, lineHeight: 34 },
  title: { fontFamily: F.headingSemi, fontSize: 22, lineHeight: 27 },
  headline: { fontFamily: F.bodyBold, fontSize: 17, lineHeight: 22 },
  body: { fontFamily: F.body, fontSize: 15, lineHeight: 21 },
  callout: { fontFamily: F.bodySemi, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: F.body, fontSize: 12, lineHeight: 16 },
  eyebrow: { fontFamily: F.bodyBold, fontSize: 11, lineHeight: 15, letterSpacing: 0.8 },
} as const;

export const shadow = Platform.select({
  ios: { shadowColor: "#000", shadowOpacity: 0.10, shadowRadius: 14, shadowOffset: { width: 0, height: 7 } },
  android: { elevation: 3 },
  default: {},
});

export const darkShadow = Platform.select({
  ios: { shadowColor: "#000", shadowOpacity: 0.36, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
  android: { elevation: 4 },
  default: {},
});

export const layout = { gutter: 18, radius: 22, tabHeight: 76, maxWidth: 430, minTarget: 44 } as const;
