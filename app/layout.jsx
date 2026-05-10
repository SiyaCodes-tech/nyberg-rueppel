import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Nyberg-Rueppel Digital Signature Scheme',
  description: 'A full-stack implementation of the Nyberg-Rueppel Digital Signature Scheme with message recovery.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12">
          {children}
        </main>
        <footer className="border-t border-gray-800 p-8 text-center text-gray-500 text-sm bg-gray-950 mt-12">
          Nyberg-Rueppel Digital Signature Scheme Demonstration &bull; Educational Purpose Only
        </footer>
      </body>
    </html>
  );
}
