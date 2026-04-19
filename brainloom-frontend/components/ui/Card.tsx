export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="p-4 border rounded shadow">{children}</div>;
}