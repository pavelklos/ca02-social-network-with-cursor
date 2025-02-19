import "./globals.css";
import Navigation from "@/components/Navigation";
import { AuthProvider } from "@/lib/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <main className="pb-16">
            {children}
          </main>
          <Navigation />
        </AuthProvider>
      </body>
    </html>
  );
}
