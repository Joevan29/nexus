import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import AppShell from '@/src/components/layout/AppShell'; 

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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        <AppShell>
          {children}
        </AppShell>

        <Toaster 
          position="bottom-right" 
          toastOptions={{
            className: 'bg-white border border-slate-200 shadow-lg text-slate-800 rounded-xl',
            descriptionClassName: 'text-slate-500'
          }} 
        />
      </body>
    </html>
  );
}