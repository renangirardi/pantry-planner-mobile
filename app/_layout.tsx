import '../global.css';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useEffect } from 'react';
import { populateDatabaseWhenEmpty } from 'services/seed';
import Toast from 'react-native-toast-message';
import { toastConfig } from 'utils/toastConfig';

import { AREA_THEMES } from 'utils/area-themes';
import BackButton from 'components/BackButton';

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
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#09090b',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 2,
              borderBottomColor: '#27272a',
            },
            headerTintColor: '#f4f4f5',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            drawerInactiveTintColor: '#ffffff',
            drawerStyle: { backgroundColor: '#18181b' },
          }}>
          {/* ==================== HOME ==================== */}
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: 'Home',
              title: 'Pantry Planner',
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.default.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              drawerActiveBackgroundColor: `${AREA_THEMES.default.hexColor}15`,
              drawerActiveTintColor: AREA_THEMES.default.hexColor,
              drawerIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
            }}></Drawer.Screen>
          {/* ==================== SHOPPING ==================== */}
          <Drawer.Screen
            name="shopping-list/index"
            options={{
              drawerLabel: 'Shopping Lists',
              title: 'Shopping List',
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.shopping.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              drawerActiveBackgroundColor: `${AREA_THEMES.shopping.hexColor}15`,
              drawerActiveTintColor: AREA_THEMES.shopping.hexColor,
              drawerIcon: ({ color, size }) => (
                <Feather name="shopping-cart" size={size} color={color} />
              ),
            }}></Drawer.Screen>

          {/* ==================== SETTINGS ==================== */}
          <Drawer.Screen
            name="settings/index"
            options={{
              drawerLabel: 'Settings',
              title: 'Settings',
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.default.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              drawerActiveBackgroundColor: `${AREA_THEMES.default.hexColor}15`,
              drawerActiveTintColor: AREA_THEMES.default.hexColor,
              drawerIcon: ({ color, size }) => (
                <Feather name="settings" size={size} color={color} />
              ),
            }}></Drawer.Screen>
          {/* ============================================================== */}
          {/* THE FOLLOWING SCREENS ARE HIDDEN BUT MAINTAIN THE THEME COLORS */}
          {/* ============================================================== */}
          <Drawer.Screen
            name="markets/index"
            options={{
              drawerLabel: 'Favorite Markets',
              title: 'Favorite Markets',
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.market.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              drawerActiveBackgroundColor: `${AREA_THEMES.market.hexColor}15`,
              drawerActiveTintColor: AREA_THEMES.market.hexColor,
              drawerIcon: ({ color, size }) => <Feather name="map-pin" size={size} color={color} />,
            }}></Drawer.Screen>
          <Drawer.Screen
            name="markets/[id]/index"
            options={{
              title: 'Edit Market',
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.market.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerLeft: () => (
                <BackButton backRoute="/markets/" color={AREA_THEMES.market.hexColor} />
              ),
            }}></Drawer.Screen>
          <Drawer.Screen
            name="markets/create-new/index"
            options={{
              title: 'New Market',
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.market.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerLeft: () => (
                <BackButton backRoute="/markets/" color={AREA_THEMES.market.hexColor} />
              ),
            }}></Drawer.Screen>
          <Drawer.Screen
            name="pantry-items/index"
            options={{
              drawerLabel: 'Pantry Items',
              title: 'Pantry Items',
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.pantry.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              drawerActiveBackgroundColor: `${AREA_THEMES.pantry.hexColor}15`,
              drawerActiveTintColor: AREA_THEMES.pantry.hexColor,
              drawerIcon: ({ color, size }) => (
                <Feather name="shopping-bag" size={size} color={color} />
              ),
            }}></Drawer.Screen>
          <Drawer.Screen
            name="pantry-items/[id]/index"
            options={{
              title: 'Edit Item',
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.pantry.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerLeft: () => (
                <BackButton backRoute="/pantry-items/" color={AREA_THEMES.pantry.hexColor} />
              ),
            }}></Drawer.Screen>
          <Drawer.Screen
            name="pantry-items/create-new/index"
            options={{
              title: 'New Item',
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.pantry.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerLeft: () => (
                <BackButton backRoute="/pantry-items/" color={AREA_THEMES.pantry.hexColor} />
              ),
            }}></Drawer.Screen>
          <Drawer.Screen
            name="shopping-list/[id]/index"
            options={{
              title: 'Shopping List',
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.shopping.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerLeft: () => (
                <BackButton backRoute="/shopping-list/" color={AREA_THEMES.shopping.hexColor} />
              ),
            }}></Drawer.Screen>
          <Drawer.Screen
            name="shopping-list/create-new/index"
            options={{
              title: 'New Shopping List',
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.shopping.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerLeft: () => (
                <BackButton backRoute="/shopping-list/" color={AREA_THEMES.shopping.hexColor} />
              ),
            }}></Drawer.Screen>
          <Drawer.Screen
            name="shopping-list/shop-now/[id]/index"
            options={{
              title: "Let's Shop!",
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.shopping.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerLeft: () => (
                <BackButton backRoute="/shopping-list/" color={AREA_THEMES.shopping.hexColor} />
              ),
            }}></Drawer.Screen>
          <Drawer.Screen
            name="categories/index"
            options={{
              drawerLabel: 'Categories',
              title: 'Categories',
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.categories.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              drawerActiveBackgroundColor: `${AREA_THEMES.categories.hexColor}15`,
              drawerActiveTintColor: AREA_THEMES.categories.hexColor,
              drawerIcon: ({ color, size }) => <Feather name="package" size={size} color={color} />,
            }}></Drawer.Screen>
          <Drawer.Screen
            name="categories/create-new/index"
            options={{
              title: 'Create New Category',
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.categories.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerLeft: () => (
                <BackButton backRoute="/categories/" color={AREA_THEMES.categories.hexColor} />
              ),
            }}></Drawer.Screen>
          <Drawer.Screen
            name="categories/[id]/index"
            options={{
              title: 'Category Details',
              drawerItemStyle: { display: 'none' },
              headerStyle: {
                backgroundColor: '#09090b',
                borderBottomWidth: 2,
                borderBottomColor: AREA_THEMES.categories.hexColor,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerLeft: () => (
                <BackButton backRoute="/categories/" color={AREA_THEMES.categories.hexColor} />
              ),
            }}></Drawer.Screen>
        </Drawer>
      </SafeAreaView>
      <Toast config={toastConfig} position="bottom" bottomOffset={80} />
    </GestureHandlerRootView>
  );
}
