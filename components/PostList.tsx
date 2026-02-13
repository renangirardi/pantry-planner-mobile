import { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Post } from 'interfaces/Post';
import { deletePost } from 'services/post-service';

import Modal from 'components/Modal';
import PostListHeader from 'components/PostListHeader';
import PostListItem from 'components/PostListItem';
import PostListFooter from 'components/PostListFooter';

interface PostListProps {
  posts?: Post[];
  type: 'readOnly' | 'admin';
}

export default function PostList({ posts, type }: PostListProps) {
  const router = useRouter();

  const [postIdToDelete, setPostIdToDelete] = useState<string | undefined>(undefined);
  const [isDeleting, setIsDeleting] = useState(false);

  const postBeingDeleted = posts?.find((p) => p.id === postIdToDelete);

  const handleOpenModal = (postId: string | undefined) => {
    setPostIdToDelete(postId);
  };

  const handleCloseModal = () => {
    setPostIdToDelete(undefined);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    if (!postIdToDelete) return;

    setIsDeleting(true);
    try {
      await deletePost(postIdToDelete);

      router.setParams({ status: 'post-deleted' });

      handleCloseModal();
    } catch (error) {
      console.error(error);
      router.setParams({ error: 'Failed to delete post.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View className="w-full overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 shadow-sm">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id!}
        scrollEnabled={false}
        ListHeaderComponent={<PostListHeader type={type} />}
        ListFooterComponent={<PostListFooter total={posts?.length || 0} />}
        renderItem={({ item }) => (
          <PostListItem
            post={item}
            type={type}
            onDeleteClick={handleOpenModal}
            isDeleting={isDeleting}
            deletingId={postIdToDelete}
          />
        )}
        ListEmptyComponent={
          <View className="items-center p-8">
            <Text className="text-zinc-300">No posts found.</Text>
          </View>
        }
        removeClippedSubviews={true}
      />

      <Modal
        isOpen={!!postIdToDelete}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        isLoading={isDeleting}>
        <View>
          <Text className="text-base text-[#ededed]">
            Are you sure you want to delete the post{' '}
            <Text className="font-bold">&quot;{postBeingDeleted?.title}&quot;</Text>?
          </Text>
          <Text className="mt-2 text-sm font-semibold text-red-500">
            This action cannot be undone.
          </Text>
        </View>
      </Modal>
    </View>
  );
}
