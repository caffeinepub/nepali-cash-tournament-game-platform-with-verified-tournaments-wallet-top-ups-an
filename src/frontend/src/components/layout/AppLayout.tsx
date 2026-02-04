import { useGetCallerUserProfile } from '../../hooks/useAuth';
import AppNav from './AppNav';
import LoginButton from '../auth/LoginButton';
import { Heart } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/assets/generated/app-logo.dim_512x512.png" alt="Logo" className="h-10 w-10" />
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg">प्रतियोगिता</h1>
              {userProfile && <p className="text-sm text-muted-foreground">{userProfile.name}</p>}
            </div>
          </div>
          <LoginButton />
        </div>
      </header>

      <div className="flex flex-1">
        <AppNav />
        <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      </div>

      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2026. Built with <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline">
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
