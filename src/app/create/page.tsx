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