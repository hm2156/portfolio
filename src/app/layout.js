import './globals.css';
import { Poppins, Noto_Serif } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '700'],
});

const notoserrif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  weight: ['400', '700'],
});

export const metadata = {
  title: 'Huda Marta',
  description: 'A minimal, dark-mode portfolio.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} ${notoserrif.variable} font-body bg-zinc-950 text-zinc-300`}>
        {children}
      </body>
    </html>
  );
}