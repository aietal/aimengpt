import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import {
  TooltipProvider,
} from "@/components/ui/tooltip"

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps<{}>) {
  const queryClient = new QueryClient();

  return (
    <div className={inter.className}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={400}>
        <Component {...pageProps} />
      </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default appWithTranslation(App);
