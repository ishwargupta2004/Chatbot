import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/Theme-Provider";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";


export const metadata = {
  title: "Ai_Chatbot",
  description: "Ai chatbot we can embed in our website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-linear-to-br from-gray-950 via-zinc-900 to-stone-900 text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange>

          <ClerkProvider>

            <Navbar />

            <main className="relative min-h-screen container mx-auto pt-40 md:pt-32">
              {/* Background glow effects (behind everything) */}
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
              </div>

              {/* Page content (above glow) */}
              <div className="relative z-10">{children}</div>

              <Footer />

            </main>

            <Toaster position="top-center" richColors />

          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
