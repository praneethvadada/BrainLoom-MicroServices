// 📄 /app/auth/layout.tsx
// Auth pages (/auth/login, /auth/forgot-password) have their own full-screen layout.
// Strips the public Navbar so auth pages can be full-screen dark backgrounds.

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
