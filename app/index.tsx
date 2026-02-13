import { View, Text } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 justify-center items-center bg-zinc-900 p-6">
      <Text className="text-3xl font-bold text-green-500 mb-4">
        Hello Native! 🚀
      </Text>
      <Text className="text-zinc-400 text-center text-lg">
        Seu ambiente React Native com Tailwind está configurado.
      </Text>
      
      <View className="mt-8 bg-zinc-800 p-4 rounded-lg border border-zinc-700">
        <Text className="text-zinc-200 font-semibold">
          Próximo passo: Criar seus componentes em /components
        </Text>
      </View>
    </View>
  );
}