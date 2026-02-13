import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

export default function FlashMessages() {
  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = params.status ? String(params.status) : null;
    let error = params.error ? String(params.error) : null;

    if (error === 'null' || error === 'undefined') {
      error = null;
    }

    if (!status && !error) return;

    if (status) {
      if (status === 'post-created') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Post created successfully! 🎉',
        });
      } else if (status === 'post-updated') {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Post updated successfully!',
        });
      } else if (status === 'post-deleted') {
        Toast.show({
          type: 'success',
          text1: 'Deleted',
          text2: 'Post deleted successfully.',
        });
      } else if (status === 'user-updated') {
        Toast.show({
          type: 'success',
          text1: 'Updated',
          text2: 'User updated successfully.',
        });
      } else if (status === 'user-created') {
        Toast.show({
          type: 'success',
          text1: 'Created',
          text2: 'User created successfully.',
        });
      }
    } else if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
      });
    }

    router.setParams({ status: null, error: null });
  }, [params.status, params.error]);

  return null;
}
