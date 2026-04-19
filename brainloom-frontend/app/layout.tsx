// 📄 /app/layout.tsx
import "@/styles/globals.css";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import AppWrapper from "@/components/common/AppWrapper";

export const metadata = {
  title: "BrainLoom",
  description: "A modern platform to learn development, cyber security, and system design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppWrapper>
          {/* Navbar is conditionally rendered — hidden on admin and auth pages */}
          <ConditionalNavbar />
          <main>{children}</main>
        </AppWrapper>
      </body>
    </html>
  );
}