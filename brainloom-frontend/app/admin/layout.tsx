// 📄 /app/admin/layout.tsx
// Admin pages have their own layout — no public Navbar.
// Each admin page renders its own top bar.

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
