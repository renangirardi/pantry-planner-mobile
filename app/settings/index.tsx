import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';

import Container from 'components/Container';
import ContentBox from 'components/ContentBox';
import Button from 'components/Button';
import Modal from 'components/Modal';
import MessageBar from 'components/MessageBar'; // <-- Added MessageBar import
import ExportButton from 'components/ExportButton';

import { exportDataToShare, exportDataToDevice, importDataFromFile } from 'services/backup-service';
import { resetAllTutorials } from 'services/tutorial-service'; // <-- Added service import

export default function Settings() {
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isResetTutorialModalOpen, setIsResetTutorialModalOpen] = useState(false); // <-- Added state for reset modal

  const handleExportShare = async () => {
    setIsProcessing(true);
    setIsExportModalOpen(false);
    try {
      const success = await exportDataToShare();
      if (success) {
        Toast.show({
          type: 'customSuccess',
          text1: 'File ready to share!',
          text2: 'Choose an app to send your backup.',
        });
      }
    } catch (error) {
      console.log('Error: ', error);
      Toast.show({
        type: 'customError',
        text1: 'Error sharing file.',
        text2: 'Could not share the backup file.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportSave = async () => {
    setIsProcessing(true);
    setIsExportModalOpen(false);
    try {
      const success = await exportDataToDevice();
      if (success) {
        Toast.show({
          type: 'customSuccess',
          text1: 'Saved to your device successfully!',
          text2: 'Find the backup file in your Downloads folder.',
        });
      }
    } catch (error) {
      console.log('Error: ', error);
      Toast.show({
        type: 'customError',
        text1: 'Error saving to device.',
        text2: 'Could not save the backup file.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = async () => {
    setIsProcessing(true);
    try {
      const success = await importDataFromFile();
      if (success) {
        setIsImportModalOpen(false);
        Toast.show({
          type: 'customSuccess',
          text1: 'Your data has been restored!',
          text2: 'It is time to shop!',
        });
        router.replace('/');
      } else {
        setIsImportModalOpen(false);
      }
    } catch (error) {
      console.log('Error: ', error);
      setIsImportModalOpen(false);
      Toast.show({
        type: 'customError',
        text1: 'The selected file is invalid.',
        text2: 'Please select a valid backup file to import.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmResetTutorials = async () => {
    setIsProcessing(true);
    try {
      await resetAllTutorials();
      setIsResetTutorialModalOpen(false);
      Toast.show({
        type: 'customSuccess',
        text1: 'Tutorials Reset!',
        text2: 'Helpful hints will now show up across the app.',
      });
      router.replace('/');
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'customError',
        text1: 'Error resetting tutorials.',
        text2: 'Please try again later.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container>
      <MessageBar
        id="tutorial-settings"
        title="App Settings"
        message="Manage your data and content from here. We highly recommend exporting a backup of your data occasionally, especially if you have mapped out large supermarkets!"
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-6">
          {/* Content Management Section */}
          <ContentBox>
            <View className="mb-6">
              <View className="mb-4 flex-row items-center gap-2">
                <Feather name="settings" size={20} color="#a1a1aa" />
                <Text className="text-lg font-bold text-zinc-100">Content Management</Text>
              </View>
              <Text className="mb-6 text-sm text-zinc-400">
                Manage your markets, items, and categories. Edit or delete any content you no longer
                need.
              </Text>

              <View className="gap-4">
                <Button
                  icon="shopping-bag"
                  area="pantry"
                  variant="primary"
                  onPress={() => router.push('/pantry-items')}
                  disabled={isProcessing}>
                  Manage Items
                </Button>

                <Button
                  icon="package"
                  area="categories"
                  variant="primary"
                  onPress={() => router.push('/categories')}
                  disabled={isProcessing}>
                  Manage Categories
                </Button>

                <Button
                  icon="map-pin"
                  area="market"
                  variant="primary"
                  onPress={() => router.push('/markets')}
                  disabled={isProcessing}>
                  Manage Markets
                </Button>
              </View>
            </View>
          </ContentBox>

          {/* Data Management Section */}
          <ContentBox>
            <View className="mb-6">
              <View className="mb-4 flex-row items-center gap-2">
                <Feather name="database" size={20} color="#a1a1aa" />
                <Text className="text-lg font-bold text-zinc-100">Data Management</Text>
              </View>
              <Text className="mb-6 text-sm text-zinc-400">
                Create a backup of your markets, items, and shopping lists to avoid losing your data
                if you change phones or reinstall the app.
              </Text>

              <View className="gap-4">
                <Button
                  area="default"
                  variant="primary"
                  onPress={() => setIsExportModalOpen(true)}
                  disabled={isProcessing}>
                  {isProcessing ? 'Please wait...' : 'Export Data (Backup)'}
                </Button>

                <Button
                  area="default"
                  variant="secondary"
                  onPress={() => setIsImportModalOpen(true)}
                  disabled={isProcessing}>
                  Import Data (Restore)
                </Button>
              </View>
            </View>
          </ContentBox>

          {/* Tutorial Reset Section */}
          <ContentBox>
            <View className="mb-6">
              <View className="mb-4 flex-row items-center gap-2">
                <Feather name="info" size={20} color="#a1a1aa" />
                <Text className="text-lg font-bold text-zinc-100">Tutorial Reset</Text>
              </View>
              <Text className="mb-6 text-sm text-zinc-400">
                Bring back all the helpful hint banners across the app. This is great if you want a
                quick refresher on how things work.
              </Text>

              <View className="gap-4">
                <Button
                  area="default"
                  variant="secondary"
                  onPress={() => setIsResetTutorialModalOpen(true)}
                  disabled={isProcessing}>
                  Reset Tutorial Messages
                </Button>
              </View>
            </View>
          </ContentBox>
          <View className="mt-8 border-t border-zinc-800 pb-6 pt-6">
            <Text className="text-center text-sm text-zinc-600">Pantry Planner v1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onConfirm={() => {}}
        title="Export Options"
        hideFooter={true}>
        <Text className="mb-6 text-sm text-zinc-400">
          How would you like to export your backup file?
        </Text>

        <View className="mb-8 flex-col gap-3">
          <ExportButton
            onPress={handleExportSave}
            title="Save to Device"
            description="Save to your Downloads folder"
            option="save"
          />
          <ExportButton
            onPress={handleExportShare}
            title="Share File"
            description="Send via Email, Drive or WhatsApp"
            option="share"
          />
        </View>

        <Button onPress={() => setIsExportModalOpen(false)} variant="secondary">
          Cancel
        </Button>
      </Modal>

      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirm={handleConfirmImport}
        title="Import Warning"
        confirmText="Yes, Replace"
        confirmVariant="danger"
        isLoading={isProcessing}>
        <Text className="text-base text-zinc-300">
          Importing a backup file will{' '}
          <Text className="font-bold text-red-400">replace and delete</Text> all your current data.
          Do you wish to continue?
        </Text>
      </Modal>

      <Modal
        isOpen={isResetTutorialModalOpen}
        onClose={() => setIsResetTutorialModalOpen(false)}
        onConfirm={handleConfirmResetTutorials}
        title="Reset Tutorials?"
        confirmText="Yes, Reset"
        confirmVariant="primary"
        isLoading={isProcessing}>
        <Text className="text-base text-zinc-300">
          This will make all the blue helpful hint banners reappear at the top of the screens. Do
          you wish to continue?
        </Text>
      </Modal>
    </Container>
  );
}
