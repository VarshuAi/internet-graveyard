import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Internet Graveyard — We Archive What Disappeared',
  description: 'A digital archaeology platform documenting, verifying, and preserving websites, apps, online services, games, and communities that have died, been abandoned, or turned into zombie platforms.',
  keywords: [
    'internet graveyard',
    'dead websites',
    'defunct services',
    'digital archaeology',
    'internet history',
    'vine memorial',
    'google reader shutdown',
    'abandoned apps'
  ],
  authors: [{ name: 'Internet Graveyard Preservation Guild' }],
  openGraph: {
    title: 'Internet Graveyard — We Archive What Disappeared',
    description: 'The internet forgets. We archive what disappeared. Explore memorials, death causes, evidence dossiers, and the decade timeline of defunct internet services.',
    type: 'website',
    siteName: 'Internet Graveyard'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-graveyard-900 text-zinc-100 font-sans min-h-screen flex flex-col antialiased selection:bg-red-500/30 selection:text-white bg-archival-grid">
        <Navbar />
        <main className="flex-1 w-full flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
