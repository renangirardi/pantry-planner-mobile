import AsyncStorage from '@react-native-async-storage/async-storage';

const TUTORIAL_PREFIX = '@tutorial_';

export async function dismissTutorial(id: string): Promise<void> {
  try {
    await AsyncStorage.setItem(`${TUTORIAL_PREFIX}${id}`, 'true');
  } catch (error) {
    console.error('Error saving tutorial state:', error);
  }
}

export async function hasDismissedTutorial(id: string): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(`${TUTORIAL_PREFIX}${id}`);
    return value === 'true';
  } catch (error) {
    console.error('Error reading tutorial state:', error);
    return false;
  }
}

export async function resetAllTutorials(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const tutorialKeys = keys.filter((key) => key.startsWith(TUTORIAL_PREFIX));
    await AsyncStorage.multiRemove(tutorialKeys);
  } catch (error) {
    console.error('Error resetting tutorials:', error);
  }
}
