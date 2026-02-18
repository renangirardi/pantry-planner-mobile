import '../global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { populateDatabaseWhenEmpty } from 'services/seed';

export default function Layout() {
  useEffect(() => {
    populateDatabaseWhenEmpty();
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-zinc-900 text-blue-500">
        <StatusBar style="light" />
        <Drawer
          screenOptions={{
            headerStyle: { backgroundColor: '#09090b' },
            headerTintColor: '#f4f4f5',
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

          {/* The following screens are hidden from the drawer but are needed for navigation */}
          <Drawer.Screen
            name="markets/[id]/index"
            options={{
              title: 'Market Details',
              drawerItemStyle: { display: 'none' },
            }}></Drawer.Screen>

          <Drawer.Screen
            name="markets/create-new/index"
            options={{
              title: 'Create New Market',
              drawerItemStyle: { display: 'none' },
            }}></Drawer.Screen>

          <Drawer.Screen
            name="pantry-items/[id]/index"
            options={{
              title: 'Item Details',
              drawerItemStyle: { display: 'none' },
            }}></Drawer.Screen>

          <Drawer.Screen
            name="pantry-items/create-new/index"
            options={{
              title: 'Create New Item',
              drawerItemStyle: { display: 'none' },
            }}></Drawer.Screen>
        </Drawer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
