export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#151515] flex items-center justify-center p-4 lg:p-8">
      {children}
    </div>
  );
}