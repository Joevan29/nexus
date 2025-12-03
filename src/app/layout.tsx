import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CommandMenu } from '@/src/components/ui/CommandMenu';
import { Toaster } from 'sonner';
import NexusCopilot from '@/src/components/ui/NexusCopilot';
import RealtimeListener from '@/src/components/ui/RealtimeListener';
import Sidebar from '@/src/components/ui/Sidebar'; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NEXUS | Supply Chain Control",
  description: "Enterprise Logistics Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen bg-slate-50 text-slate-900 overflow-hidden`}>
        
        <Sidebar />

        <main className="flex-1 relative flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
            <div className="max-w-7xl mx-auto pb-20">
              {children}
            </div>
          </div>

          <CommandMenu />
          
          <NexusCopilot />
          
          <RealtimeListener />
          
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              className: 'bg-white border border-slate-200 shadow-lg text-slate-800 rounded-xl',
              descriptionClassName: 'text-slate-500'
            }} 
          />
        </main>

      </body>
    </html>
  );
}