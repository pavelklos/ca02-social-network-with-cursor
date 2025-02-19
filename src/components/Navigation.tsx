"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, PlusSquare } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const tabs = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Profile', href: `/profile/${user.uid}`, icon: User },
    { name: 'Create', href: '/create', icon: PlusSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex flex-col items-center p-4 ${
                  isActive 
                    ? 'text-blue-500' 
                    : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm mt-1">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 