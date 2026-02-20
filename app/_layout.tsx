import '../global.css';
import { View, Text, SectionList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { populateDatabaseWhenEmpty } from 'services/seed';
import { useRouter } from 'expo-router';

export default function Layout() {
  useEffect(() => {
    populateDatabaseWhenEmpty();
  }, []);

  const router = useRouter();

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-zinc-900 text-blue-500">
        <StatusBar style="light" />
        <Drawer
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#09090b',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: '#27272a',
            },
            headerTintColor: '#f4f4f5',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            drawerActiveTintColor: '#3b82f6',
            drawerInactiveTintColor: '#ffffff',
            drawerStyle: { backgroundColor: '#18181b' },
          }}>
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: 'Home',
              title: 'Pantry Planner',
              drawerIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
            }}></Drawer.Screen>

          <Drawer.Screen
            name="shopping-list/index"
            options={{
              drawerLabel: 'Shopping List',
              title: 'Shopping List',
              drawerIcon: ({ color, size }) => (
                <Feather name="shopping-cart" size={size} color={color} />
              ),
            }}></Drawer.Screen>

          <Drawer.Screen
            name="meals/index"
            options={{
              drawerLabel: 'Meals Planner',
              title: 'Meals',
              drawerIcon: ({ color, size }) => (
                <Feather name="calendar" size={size} color={color} />
              ),
              drawerItemStyle: { display: 'none' },
            }}></Drawer.Screen>

          <Drawer.Screen
            name="recipes/index"
            options={{
              drawerLabel: 'Recipes',
              title: 'Recipes',
              drawerIcon: ({ color, size }) => <Feather name="book" size={size} color={color} />,
              drawerItemStyle: { display: 'none' },
            }}></Drawer.Screen>

          <Drawer.Screen
            name="pantry-items/index"
            options={{
              drawerLabel: 'Pantry Items',
              title: 'Pantry Items',
              drawerIcon: ({ color, size }) => (
                <Feather name="shopping-bag" size={size} color={color} />
              ),
            }}></Drawer.Screen>

          <Drawer.Screen
            name="markets/index"
            options={{
              drawerLabel: 'Favorite Markets',
              title: 'Favorite Markets',
              drawerIcon: ({ color, size }) => <Feather name="map-pin" size={size} color={color} />,
            }}></Drawer.Screen>

          <Drawer.Screen
            name="profile/index"
            options={{
              drawerLabel: 'My Profile',
              title: 'My Profile',
              drawerIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
              drawerItemStyle: { display: 'none' },
            }}></Drawer.Screen>

          <Drawer.Screen
            name="settings/index"
            options={{
              drawerLabel: 'Settings',
              title: 'Settings',
              drawerIcon: ({ color, size }) => (
                <Feather name="settings" size={size} color={color} />
              ),
            }}></Drawer.Screen>

          {/* The following screens are hidden from the drawer but are needed for navigation */}
          <Drawer.Screen
            name="markets/[id]/index"
            options={{
              title: 'Edit Market',
              drawerItemStyle: { display: 'none' },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/markets/')}
                  className="ml-4 rounded-full p-2 active:bg-zinc-700">
                  <Feather name="arrow-left" size={24} color="#e4e4e7" />
                </TouchableOpacity>
              ),
            }}></Drawer.Screen>

          <Drawer.Screen
            name="markets/create-new/index"
            options={{
              title: 'New Market',
              drawerItemStyle: { display: 'none' },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/markets/')}
                  className="ml-4 rounded-full p-2 active:bg-zinc-700">
                  <Feather name="arrow-left" size={24} color="#e4e4e7" />
                </TouchableOpacity>
              ),
            }}></Drawer.Screen>

          <Drawer.Screen
            name="pantry-items/[id]/index"
            options={{
              title: 'Edit Item',
              drawerItemStyle: { display: 'none' },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/pantry-items/')}
                  className="ml-4 rounded-full p-2 active:bg-zinc-700">
                  <Feather name="arrow-left" size={24} color="#e4e4e7" />
                </TouchableOpacity>
              ),
            }}></Drawer.Screen>

          <Drawer.Screen
            name="pantry-items/create-new/index"
            options={{
              title: 'New Item',
              drawerItemStyle: { display: 'none' },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/pantry-items/')}
                  className="ml-4 rounded-full p-2 active:bg-zinc-700">
                  <Feather name="arrow-left" size={24} color="#e4e4e7" />
                </TouchableOpacity>
              ),
            }}></Drawer.Screen>

          <Drawer.Screen
            name="shopping-list/[id]/index"
            options={{
              title: 'Shopping List',
              drawerItemStyle: { display: 'none' },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/shopping-list/')}
                  className="ml-4 rounded-full p-2 active:bg-zinc-700">
                  <Feather name="arrow-left" size={24} color="#e4e4e7" />
                </TouchableOpacity>
              ),
            }}></Drawer.Screen>

          <Drawer.Screen
            name="shopping-list/create-new/index"
            options={{
              title: 'New Shopping List',
              drawerItemStyle: { display: 'none' },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/shopping-list/')}
                  className="ml-4 rounded-full p-2 active:bg-zinc-700">
                  <Feather name="arrow-left" size={24} color="#e4e4e7" />
                </TouchableOpacity>
              ),
            }}></Drawer.Screen>

          <Drawer.Screen
            name="shopping-list/shop-now/[id]/index"
            options={{
              title: "Let's Shop!",
              drawerItemStyle: { display: 'none' },
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => router.replace('/shopping-list/')}
                  className="ml-4 rounded-full p-2 active:bg-zinc-700">
                  <Feather name="arrow-left" size={24} color="#e4e4e7" />
                </TouchableOpacity>
              ),
            }}></Drawer.Screen>
        </Drawer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
