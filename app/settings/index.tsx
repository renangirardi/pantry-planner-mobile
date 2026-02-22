import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';

import Container from 'components/Container';
import ContentBox from 'components/ContentBox';
import Button from 'components/Button';
import Modal from 'components/Modal';

import { exportDataToShare, exportDataToDevice, importDataFromFile } from 'services/backup-service';
import ExportButton from 'components/ExportButton';

export default function Settings() {
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExportShare = async () => {
    setIsProcessing(true);
    setIsExportModalOpen(false);
    try {
      const success = await exportDataToShare();
      if (success) {
        Toast.show({ type: 'success', text1: 'File ready to share! 📤' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error sharing file.' });
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
        Toast.show({ type: 'success', text1: 'Saved to your device successfully! 💾' });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error saving to device.' });
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
        Toast.show({ type: 'success', text1: 'Your data has been restored! 🚀' });
        router.replace('/');
      } else {
        setIsImportModalOpen(false);
      }
    } catch (error) {
      setIsImportModalOpen(false);
      Toast.show({ type: 'error', text1: 'The selected file is invalid.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container>
      <View className="flex-1 p-6">
        <ScrollView showsVerticalScrollIndicator={false}>
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
          <View className="mt-8 border-t border-zinc-800 pt-6">
            <Text className="text-center text-sm text-zinc-600">Pantry Planner v1.0.0</Text>
          </View>
        </ScrollView>
      </View>

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
        confirmVariant="danger">
        <Text className="text-base text-zinc-300">
          Importing a backup file will{' '}
          <Text className="font-bold text-red-400">replace and delete</Text> all your current data.
          Do you wish to continue?
        </Text>
      </Modal>
    </Container>
  );
}
