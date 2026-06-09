import { Bebas_Neue, Source_Sans_3, Geist, Geist_Mono, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import '../../lib/fontawesome'
import Header from "./components/ui/Header";
// import TopHeader from "./components/ui/TopHeader";
import Disclosures from "./components/ui/Disclosures";
import TempFooter from "./components/ui/TempFooter";
import ScrollEffects from "./ScrollEffects";
import { AuthProvider } from "./components/auth/AuthProvider";
import SubHeader from "./components/ui/SubHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],           // or ['latin-ext']
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'], // pick what you need
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-source-sans',   // Best for Tailwind
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add the weights you need
  style: ["normal", "italic"],
  variable: "--font-dm-sans", // Recommended for Tailwind
  // display: "swap",
});

const playfair = Playfair_Display({
  subsets: ['latin'],           // or ['latin-ext'] if needed
  weight: ['400', '500', '600', '700', '900'], // specify weights you need
  style: ['normal', 'italic'],  // optional
  display: 'swap',              // recommended
  variable: '--font-playfair',  // for Tailwind / CSS variables (best)
});

export const metadata = {
  title: "Far Flung Change",
  description: "deliBErate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${sourceSans.variable} ${dmSans.variable} ${playfair.variable}`}>
        <AuthProvider>
          <ScrollEffects />
          {/* <TopHeader /> */}
          <Header />
          <SubHeader />
          <main className="site-content">{children}</main>
          <TempFooter />
          <Disclosures />
        </AuthProvider>
      </body>
    </html>
  );
}
