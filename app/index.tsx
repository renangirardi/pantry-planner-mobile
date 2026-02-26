import CallToAction from 'components/CallToAction';
import Container from 'components/Container';
import PageDescription from 'components/PageDescription';
import PageTitle from 'components/PageTitle';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import MessageBar from 'components/MessageBar';

export default function Home() {
  const router = useRouter();

  return (
    <Container>
      <MessageBar
        id="tutorial-home"
        title="Welcome aboard!"
        message="Start by setting up your favorite Markets and adding Items to create smart, aisle-sorted Shopping Lists. If you prefer not to use specific markets, your lists will be automatically grouped by categories instead!"
      />

      <ScrollView>
        <View className="mt-10 flex-1 items-center justify-center p-6">
          <PageTitle>Hello User!</PageTitle>

          <PageDescription>
            Welcome to your favorite pantry planner. What would you like to do today?
          </PageDescription>

          <View className="flex w-full flex-col gap-6 space-y-4">
            <CallToAction
              variant="shoppingList"
              icon="shopping-cart"
              onPress={() => router.push('/shopping-list')}>
              Let&apos;s go Shopping
            </CallToAction>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}
