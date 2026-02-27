# 🛒 Pantry Planner Mobile

![Pantry Planner Banner](link-to-your-banner-image-or-gif.gif)

A modern, highly modular React Native mobile application designed to simplify household grocery management. Pantry Planner helps users track their pantry inventory, organize items by specific markets and aisles, and manage dynamic shopping lists with a focus on a seamless user experience.

## ✨ Key Features

* **Smart Inventory Management:** Track what you have at home, including brand details, categories, and exact physical locations (Market and Aisle numbers).
* **Dynamic Shopping Lists:** Create, edit, duplicate, and reuse shopping lists. Items are automatically grouped and sorted by your custom market aisles or broad categories.
* **Interactive Shopping Mode:** A step-by-step shopping experience with real-time progress tracking, inline quantity adjustments, and dynamic UI color changes based on completion status.
* **Contextual Shortcuts (On-the-fly Creation):** Add new categories, markets, or items without breaking your workflow using nested, context-aware native modals.
* **Data Portability (Backup & Restore):** Fully export your database as a JSON file to save locally or share via the cloud/messaging apps, and restore it effortlessly.
* **Smart Tutorial System:** Unobtrusive, dismissible hint banners on every screen to guide users, which can be globally reset from the Settings menu.
* **Custom Design System & Navigation:** Features a centralized theme configuration (`AREA_THEMES`) that dynamically alters component colors based on the app's current context, paired with a custom-built Drawer Navigation.
* **Offline-First:** Fully persistent local data storage, ensuring the app works flawlessly and lightning-fast without an internet connection.

## 🛠 Tech Stack

* **Framework:** React Native with Expo (SDK 54)
* **Language:** TypeScript
* **Styling:** NativeWind (Tailwind CSS for React Native)
* **Navigation:** Expo Router (File-based routing) & React Navigation Drawer
* **Storage:** React Native Async Storage
* **File Management:** Expo File System & Expo Sharing
* **Security/UUID:** Expo Crypto
* **Notifications:** React Native Toast Message
* **Icons:** Expo Vector Icons (Feather)

## 🏗 Architecture & Engineering Decisions

As a Mid-Level Front-End Developer, I prioritized maintainability, clean code, scalability, and UX in this project:

* **Component Separation:** Heavy screens and complex Modals were decoupled into independent, reusable functional components (e.g., `MultiSelectModal`, `ItemLocationCard`) to prevent unnecessary re-renders and keep files focused on a single responsibility.
* **Centralized Styling Logic:** Instead of hardcoding Tailwind classes across multiple screens, the app uses unified UI components (`<Button />`, `<MessageBar />`) that consume a centralized `AREA_THEMES` constant. This ensures visual consistency and makes global design changes effortless.
* **Optimized Data Seeding & Bulk Inserts:** Implemented a robust bulk-insert mechanism to instantly hydrate the local database with hundreds of pre-configured items, preventing UI freezes and relational ID duplication.
* **UX-Focused Data Handling:** Services automatically handle data sorting (e.g., alphabetical ordering and natural number sorting for aisles) before it hits the UI layer, ensuring dropdowns and lists are always intuitive.
* **Advanced Z-Index & Native Modal Handling:** Solved native overlapping issues by using isolated instances of notification components (`Toast`) inside native Modals to guarantee visibility, and properly implemented `useSafeAreaInsets` for edge-to-edge compatibility across modern devices.

## 🚀 How to Run Locally

1. **Clone the repository:**
   git clone https://github.com/your-username/pantry-planner-mobile.git
   
3. **Install dependencies:**
   npm install

4. **Start the Expo development server:**
   npx expo start

5. **Run on your device:**
   Download the **Expo Go** app on your iOS or Android device and scan the QR code displayed in your terminal.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
