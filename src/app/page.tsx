import { Suspense } from 'react';
import PostFeed from '@/components/PostFeed';
import AuthCheck from '@/components/AuthCheck';

export default function Home() {
  return (
    <AuthCheck>
      <div className="max-w-screen-sm mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Feed</h1>
        <Suspense fallback={<div>Loading posts...</div>}>
          <PostFeed />
        </Suspense>
      </div>
    </AuthCheck>
  );
}
