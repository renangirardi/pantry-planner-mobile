import { File, Directory, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { STORAGE_KEYS } from './storage';

async function getBackupDataString() {
  const markets = (await AsyncStorage.getItem(STORAGE_KEYS.MARKETS)) || '[]';
  const items = (await AsyncStorage.getItem(STORAGE_KEYS.ITEMS)) || '[]';
  const shoppingLists = (await AsyncStorage.getItem(STORAGE_KEYS.SHOPPINGLISTS)) || '[]';

  const backupData = {
    markets: JSON.parse(markets),
    items: JSON.parse(items),
    shoppingLists: JSON.parse(shoppingLists),
    exportDate: new Date().toISOString(),
  };

  return JSON.stringify(backupData, null, 2);
}

export async function exportDataToShare() {
  try {
    const jsonString = await getBackupDataString();
    const dateStr = new Date().toISOString().split('T')[0];
    const file = new File(Paths.document, `shopping_backup_${dateStr}.json`);

    file.write(jsonString);

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(file.uri, {
        mimeType: 'application/json',
        dialogTitle: 'Share your Backup',
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error sharing data:', error);
    throw error;
  }
}

export async function exportDataToDevice() {
  try {
    const jsonString = await getBackupDataString();
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `shopping_backup_${dateStr}`;

    if (Platform.OS === 'android') {
      const directory = await Directory.pickDirectoryAsync();

      if (directory) {
        const newFile = directory.createFile(fileName, 'application/json');

        newFile.write(jsonString);
        return true;
      } else {
        return false;
      }
    } else {
      const file = new File(Paths.document, `${fileName}.json`);
      file.write(jsonString);
      await Sharing.shareAsync(file.uri, { UTI: 'public.json' });
      return true;
    }
  } catch (error) {
    console.error('Error saving data to device:', error);
    throw error;
  }
}

export async function importDataFromFile() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return false;
    }

    const file = new File(result.assets[0].uri);
    const fileContent = await file.text();
    const backupData = JSON.parse(fileContent);

    if (!backupData.markets || !backupData.items || !backupData.shoppingLists) {
      throw new Error('Invalid backup file format');
    }

    await AsyncStorage.setItem(STORAGE_KEYS.MARKETS, JSON.stringify(backupData.markets));
    await AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(backupData.items));
    await AsyncStorage.setItem(
      STORAGE_KEYS.SHOPPINGLISTS,
      JSON.stringify(backupData.shoppingLists)
    );

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
}
