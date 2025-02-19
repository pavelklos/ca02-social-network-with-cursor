"use client";

import { useAuth } from '@/lib/hooks/useAuth';
import SignInWithGoogle from './SignInWithGoogle';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      Loading...
    </div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Welcome to Social Network</h1>
        <p className="text-gray-600 mb-4">Please sign in to continue</p>
        <SignInWithGoogle />
      </div>
    );
  }

  return <>{children}</>;
} 