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
          <PageTitle>Hello User!</PageTitle>

          <PageDescription>
            Welcome to your favorite pantry planner. What would you like to do today?
          </PageDescription>

          <View className="flex w-full flex-col gap-6 space-y-4">
            <CallToAction
              disabled={true}
              variant="shoppingList"
              icon="shopping-cart"
              onPress={() => router.push('/shopping-list')}>
              Start New Shopping List
            </CallToAction>

            <CallToAction
              variant="pantryItems"
              icon="shopping-bag"
              onPress={() => router.push('/pantry-items')}>
              Register new pantry items
            </CallToAction>

            <CallToAction variant="markets" icon="map-pin" onPress={() => router.push('/markets')}>
              Enter a new favorite market
            </CallToAction>

            <CallToAction
              disabled={true}
              variant="meals"
              icon="calendar"
              onPress={() => router.push('/meals')}>
              Plan next week&apos;s meals
            </CallToAction>

            <CallToAction
              disabled={true}
              variant="recipes"
              icon="book"
              onPress={() => router.push('/recipes')}>
              Add new recipes
            </CallToAction>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
