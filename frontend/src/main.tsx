import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LucideProvider } from 'lucide-react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';

import { router } from './router';

import './globals.css';
import { AuthProvider } from './features/auth/contexts/auth-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: import.meta.env.PROD,
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LucideProvider strokeWidth={2.25} size={16}>
          <ThemeProvider attribute="class" defaultTheme="system">
            <RouterProvider router={router} />
          </ThemeProvider>
        </LucideProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
