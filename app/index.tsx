import CallToAction from 'components/CallToAction';
import Container from 'components/Container';
import PageDescription from 'components/PageDescription';
import PageTitle from 'components/PageTitle';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <Container>
      <ScrollView>
        <View className="mt-10 flex-1 items-center justify-center p-6">
          <PageTitle>Hello Guilherme Lorenzi!</PageTitle>

          <PageDescription>
            Welcome to your favorite pantry planner. What would you like to do today?
          </PageDescription>

          <View className="flex w-full flex-col gap-6 space-y-4">
            <CallToAction
              variant="shoppingList"
              icon="shopping-cart"
              onPress={() => router.push('/shopping-list')}>
              Start a new Shopping List
            </CallToAction>

            <CallToAction
              variant="pantryItems"
              icon="shopping-bag"
              onPress={() => router.push('/pantry-items')}>
              Register new Pantry Items
            </CallToAction>

            <CallToAction
              variant="categories"
              icon="package"
              onPress={() => router.push('/categories')}>
              Register new Categories
            </CallToAction>

            <CallToAction variant="markets" icon="map-pin" onPress={() => router.push('/markets')}>
              Enter a new Favorite Market
            </CallToAction>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
