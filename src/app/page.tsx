// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the investment module
  // The middleware will handle authentication
  redirect('/investment');
}