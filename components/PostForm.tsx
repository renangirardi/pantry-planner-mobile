import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { createPost, updatePost, deletePost } from 'services/post-service';

import Button from 'components/Button';
import Input from 'components/Input';
import TextArea from 'components/TextArea';
import Modal from 'components/Modal';

interface PostFormProps {
  isEditing?: boolean;
  initialData?: {
    id?: string;
    title: string;
    content: string;
    author: string;
  };
}

export default function PostForm({
  isEditing = false,
  initialData = { title: '', content: '', author: '' },
}: PostFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    author: initialData.author || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Title and Content are required. ⚠️',
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && initialData.id) {
        await updatePost(initialData.id, { ...formData });

        router.replace({
          pathname: '/manage-posts',
          params: { status: 'post-updated' },
        });
      } else {
        await createPost({ ...formData });

        router.replace({
          pathname: '/manage-posts',
          params: { status: 'post-created' },
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error saving post',
        text2: 'Something went wrong. Please try again. ❌',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!initialData.id) return;

    setIsDeleting(true);
    try {
      await deletePost(initialData.id);
      setShowDeleteModal(false);

      router.replace({
        pathname: '/manage-posts',
        params: { status: 'post-deleted' },
      });
    } catch (error) {
      console.error(error);
      setShowDeleteModal(false);

      Toast.show({
        type: 'error',
        text1: 'Deletion failed',
        text2: 'Could not delete the post. ❌',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View className="gap-4">
      <Input
        id="title"
        placeholder="Write the title of your post here"
        value={formData.title}
        onChangeText={(text: string) => handleChange('title', text)}>
        Title:
      </Input>

      <TextArea
        id="content"
        name="content"
        placeholder="Write the content of your post here"
        value={formData.content}
        onChangeText={(text: string) => handleChange('content', text)}>
        Content:
      </TextArea>

      <Input
        id="author"
        placeholder="Write the author name"
        value={formData.author}
        onChangeText={(text: string) => handleChange('author', text)}>
        Author:
      </Input>

      <View className="mt-2 flex-row gap-4">
        <View className="flex-1">
          <Button variant="primary" onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
          </Button>
        </View>

        {isEditing && (
          <View className="flex-1">
            <Button variant="danger" onPress={() => setShowDeleteModal(true)} disabled={isLoading}>
              Delete Post
            </Button>
          </View>
        )}
      </View>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        isLoading={isDeleting}>
        <View>
          <Text className="text-base text-zinc-300">
            Are you sure you want to delete the post{' '}
            <Text className="font-bold">&quot;{initialData?.title}&quot;</Text>?
          </Text>
          <Text className="mt-2 text-sm font-semibold text-red-500">
            This action cannot be undone.
          </Text>
        </View>
      </Modal>
    </View>
  );
}
