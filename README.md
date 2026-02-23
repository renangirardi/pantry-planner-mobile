# 🛒 Pantry Planner Mobile

![Pantry Planner Banner](link-to-your-banner-image-or-gif.gif)

A modern, highly modular React Native mobile application designed to simplify household grocery management. Pantry Planner helps users track their pantry inventory, organize items by specific markets and aisles, and manage dynamic shopping lists with a focus on a seamless user experience.

## ✨ Key Features

* **Smart Inventory Management:** Track what you have at home, including brand details and exact physical locations (Market and Aisle numbers).
* **Dynamic Shopping Lists:** Create, edit, duplicate, and reuse shopping lists. Items are automatically grouped and sorted for efficiency.
* **Interactive Shopping Mode:** A step-by-step shopping experience with real-time progress tracking and dynamic UI color changes based on completion status.
* **Custom Design System:** Features a centralized, scalable theme configuration (`AREA_THEMES`) that dynamically alters component colors (buttons, toasts, borders) based on the app's current context (e.g., Shopping vs. Pantry).
* **Offline-First:** Fully persistent local data storage using AsyncStorage, ensuring the app works flawlessly without an internet connection.

## 🛠 Tech Stack

* **Framework:** React Native with Expo (SDK 54)
* **Language:** TypeScript
* **Styling:** NativeWind (Tailwind CSS for React Native)
* **Navigation:** Expo Router (File-based routing)
* **Storage:** React Native Async Storage
* **Notifications:** React Native Toast Message (Customized)
* **Icons:** Expo Vector Icons (Feather)

## 🏗 Architecture & Engineering Decisions

As a Mid-Level Front-End Developer, I prioritized maintainability, clean code, and modularity in this project:

* **Component Separation:** Heavy screens and complex Modals were decoupled into independent, reusable functional components (e.g., `ShoppingListOptionsModal`, `ItemLocationCard`) to prevent unnecessary re-renders and keep files focused on a single responsibility.
* **Centralized Styling Logic:** Instead of hardcoding Tailwind classes across multiple screens, the app uses a unified `<Button />` component that consumes a centralized `AREA_THEMES` constant. This ensures visual consistency and makes global design changes effortless.
* **UX-Focused Data Handling:** Services automatically handle data sorting (e.g., alphabetical ordering and natural number sorting for aisles via `localeCompare`) before it hits the UI layer, ensuring dropdowns and lists are always intuitive for the user.
* **Safe Area Handling:** Modals and bottom-sheet components properly implement `useSafeAreaInsets` to ensure native edge-to-edge compatibility across modern Android and iOS devices without overlapping system navigation bars.

## 🚀 How to Run Locally

1. **Clone the repository:**
   git clone https://github.com/your-username/pantry-planner-mobile.git
   cd pantry-planner-mobile

2. **Install dependencies:**
   npm install

3. **Start the Expo development server:**
   npx expo start

4. **Run on your device:**
   Download the **Expo Go** app on your iOS or Android device and scan the QR code displayed in your terminal.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
