import Link from 'next/link';
import LoginPage from './(auth)/login/page';

export default function HomePage() {
  return (
      <div className="w-full min-h-screen max-w-6xl mx-auto">
        <div className="relative bg-[#1f1f1f] rounded-[2rem] overflow-hidden shadow-2xl">
          <LoginPage />
        </div>
      </div>
  );
}