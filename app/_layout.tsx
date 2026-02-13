import "../global.css"; // Importante: Carrega o Tailwind
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />
      {/* SafeAreaView garante que não fique embaixo do notch/camera */}
      <SafeAreaView className="flex-1 bg-zinc-950">
        <Slot />
      </SafeAreaView>
    </>
  );
}