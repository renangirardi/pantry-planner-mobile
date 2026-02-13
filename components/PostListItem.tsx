import { Link } from 'expo-router';
import { View, Text, Pressable } from 'react-native';

import { Post } from 'interfaces/Post';

import Button from 'components/Button/Button';

interface PostListItemProps {
  post: Post;
  type: string;
  onDeleteClick: (id: string | undefined) => void;
  isDeleting: boolean;
  deletingId?: string;
}

export default function PostListItem({
  post,
  type,
  onDeleteClick,
  isDeleting,
  deletingId,
}: PostListItemProps) {
  const isCurrentDeleting = isDeleting && deletingId === post.id;

  return (
    <View className="flex-col border-b border-zinc-700 bg-zinc-900 p-4 active:bg-zinc-950">
      <View className="mb-4">
        <Link href={`/posts/${post.id}`} asChild>
          <Pressable>
            <Text className="mb-1 text-lg font-bold text-zinc-100" numberOfLines={1}>
              {post.title}
            </Text>
          </Pressable>
        </Link>

        <Text className="text-sm leading-5 text-zinc-400" numberOfLines={2}>
          {post.content}
        </Text>

        {post.author && (
          <Text className="mt-2 text-xs italic text-zinc-500">Author: {post.author}</Text>
        )}
      </View>

      <View className="flex-row items-center gap-3">
        {type === 'readOnly' && (
          <Link href={`/posts/${post.id}`} asChild>
            <Button variant="primary" icon="book-open">
              Read Post
            </Button>
          </Link>
        )}

        {type === 'admin' && (
          <>
            <View className="flex-1">
              <Link href={`/posts/edit/${post.id}`} asChild>
                <Button variant="secondary" icon="edit-2">
                  Edit
                </Button>
              </Link>
            </View>

            <View className="flex-1">
              <Button
                variant="danger"
                icon="trash-2"
                onPress={() => onDeleteClick(post.id)}
                disabled={isCurrentDeleting}>
                {isCurrentDeleting ? '...' : 'Delete'}
              </Button>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
