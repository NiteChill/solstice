import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LucideProvider } from 'lucide-react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';

import { router } from './router';

import './globals.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LucideProvider strokeWidth={2.25} size={16}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <RouterProvider router={router} />
        </ThemeProvider>
      </LucideProvider>
    </QueryClientProvider>
  </StrictMode>,
);
