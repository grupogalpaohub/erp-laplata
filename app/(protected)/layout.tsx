// Layout protegido - autenticação é feita pelo middleware
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
