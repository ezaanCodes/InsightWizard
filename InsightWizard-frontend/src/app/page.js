// src/app/page.js
 'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the /Home page on load
    router.replace('/home');
  }, [router]);

  return null; // You can return a loader or nothing if the redirect is instantaneous

}
