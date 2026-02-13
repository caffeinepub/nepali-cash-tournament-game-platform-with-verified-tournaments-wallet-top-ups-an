import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Trophy, Wallet, ArrowUpCircle, ArrowDownCircle, Shield, Menu } from 'lucide-react';
import { t } from '../../i18n';
import { Badge } from '@/components/ui/badge';

export default function AppNav() {
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { path: '/', label: t('dashboard'), icon: Home },
    { path: '/tournaments', label: t('tournaments'), icon: Trophy },
    { path: '/wallet', label: t('wallet'), icon: Wallet },
    { path: '/topup', label: t('topUp'), icon: ArrowUpCircle },
    { path: '/withdraw', label: t('withdraw'), icon: ArrowDownCircle },
  ];

  if (isAdmin) {
    navItems.push({ path: '/admin', label: t('admin'), icon: Shield });
  }

  const NavContent = () => (
    <nav className="flex flex-col gap-1.5 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <Button
            key={item.path}
            variant={isActive ? 'default' : 'ghost'}
            className="justify-start gap-3 h-11"
            onClick={() => navigate({ to: item.path })}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
            {item.path === '/admin' && <Badge variant="secondary" className="ml-auto text-xs">Admin</Badge>}
          </Button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed bottom-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-xl">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <aside className="hidden lg:block w-64 border-r bg-card/30 backdrop-blur-sm">
        <NavContent />
      </aside>
    </>
  );
}
