import type { Metadata } from "next";
import { ReactNode } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rashonda's Cakes",
  description: "Enjoy our delicious cakes!",
};

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {children}
//       </body>
//     </html>
//   );
// }


export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-pink-50 text-gray-800">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

/**
 * Header Component: contains the site nav.
 */
function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-xl text-pink-600">
          <Link href="/">Rashonda's Cakes</Link>
        </div>
        <nav>
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="hover:text-pink-700">Home</Link>
            </li>
            <li>
              <Link href="/catalog" className="hover:text-pink-700">Catalog</Link>
            </li>
            <li>
              <Link href="/gallery" className="hover:text-pink-700">Gallery</Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-pink-700">Cart</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

/**
 * Footer Component
 */
function Footer() {
  return (
    <footer className="bg-white mt-12 border-t">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Rashonda’s Cakes. All rights reserved.
        </p>
      </div>
    </footer>
  );
}