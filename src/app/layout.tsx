import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

const fontVariables = '[--font-display:Georgia,serif] [--font-sans:Inter,system-ui,sans-serif] [--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace]';

export const metadata: Metadata = {
  title: 'Maitri — Hotel Operating System',
  description: 'AI-first property management for Thai hospitality. Multi-language inbox, channel manager, compliance — built for the way modern hotels work.',
  openGraph: {
    title: 'Maitri — Hotel Operating System',
    description: 'AI-first property management for Thai hospitality.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={fontVariables}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
      </body>
    </html>
  );
}
