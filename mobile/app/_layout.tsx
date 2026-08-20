import { BricolageGrotesque_600SemiBold, BricolageGrotesque_700Bold } from "@expo-google-fonts/bricolage-grotesque";
import { Manrope_500Medium, Manrope_600SemiBold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toast } from "@/components/ui";
import { StoreProvider } from "@/lib/store";
import { ThemeProvider, useAppTheme } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import { CatalogueProvider, useCatalogue } from "@/lib/catalogue";
import { ProfileProvider } from "@/lib/profile";

function AppNavigation(){
  const theme=useAppTheme();
  useCatalogue();
  return <><StatusBar style={theme.dark?"light":"dark"}/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:theme.colors.paper},animation:theme.motion.reduceMotion?"none":"slide_from_right"}}/><Toast/></>;
}

export default function RootLayout(){
  const [loaded]=useFonts({BricolageGrotesque_600SemiBold,BricolageGrotesque_700Bold,Manrope_500Medium,Manrope_600SemiBold,Manrope_800ExtraBold});
  if(!loaded)return <View style={{flex:1,backgroundColor:"#FAFAFA",alignItems:"center",justifyContent:"center"}}><ActivityIndicator color="#0A0A0A"/></View>;
  return <SafeAreaProvider><ThemeProvider><AuthProvider><ProfileProvider><CatalogueProvider><StoreProvider><AppNavigation/></StoreProvider></CatalogueProvider></ProfileProvider></AuthProvider></ThemeProvider></SafeAreaProvider>;
}
