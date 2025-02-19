I'll help you implement these features. Let's start with the Firebase utility functions and then build the UI components that will use them.

1. First, let's create Firebase utility functions for posts and users:

```typescript:src/lib/firebase/firebaseUtils.ts
import { db, storage } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  where
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { User, Post, Comment } from '../types';

// User Functions
export async function createUserProfile(user: User) {
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    ...user,
    followers: [],
    following: [],
  });
}

export async function getUserProfile(uid: string) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data() as User;
}

export async function updateUserProfile(uid: string, data: Partial<User>) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
}

// Post Functions
export async function createPost(post: Omit<Post, 'id' | 'createdAt'>, imageFile?: File) {
  let imageUrl;
  if (imageFile) {
    const imageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    imageUrl = await getDownloadURL(imageRef);
  }

  const postRef = await addDoc(collection(db, 'posts'), {
    ...post,
    imageUrl,
    likes: [],
    comments: [],
    createdAt: serverTimestamp(),
  });

  return postRef.id;
}

export async function getFeedPosts() {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Post[];
}

export async function getUserPosts(userId: string) {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef, 
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Post[];
}

// Like and Comment Functions
export async function toggleLike(postId: string, userId: string) {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  const post = postSnap.data() as Post;
  
  const likes = post.likes || [];
  const newLikes = likes.includes(userId)
    ? likes.filter(id => id !== userId)
    : [...likes, userId];
    
  await updateDoc(postRef, { likes: newLikes });
}

export async function addComment(
  postId: string, 
  comment: Omit<Comment, 'id' | 'createdAt'>
) {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  const post = postSnap.data() as Post;
  
  const newComment = {
    ...comment,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  
  await updateDoc(postRef, {
    comments: [...post.comments, newComment]
  });
  
  return newComment;
}
```

2. Now, let's create the post creation page:

```typescript:src/app/create/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { createPost } from '@/lib/firebase/firebaseUtils';
import AuthCheck from '@/components/AuthCheck';
import { ImagePlus, Loader } from 'lucide-react';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content.trim()) return;

    try {
      setLoading(true);
      await createPost({
        authorId: user.uid,
        authorName: user.displayName || '',
        authorPhoto: user.photoURL || '',
        content: content.trim(),
      }, image || undefined);

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCheck>
      <div className="max-w-screen-sm mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
          
          <div className="flex items-center gap-4">
            <label className="cursor-pointer flex items-center gap-2 text-blue-500">
              <ImagePlus className="h-6 w-6" />
              <span>Add Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
            {image && <span className="text-sm text-gray-500">{image.name}</span>}
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader className="h-6 w-6 animate-spin mx-auto" />
            ) : (
              'Post'
            )}
          </button>
        </form>
      </div>
    </AuthCheck>
  );
}
```

Would you like me to continue with:
1. Profile page implementation
2. Post and comment components (PostFeed, PostCard, CommentSection)

Let me know which part you'd like me to implement next!
