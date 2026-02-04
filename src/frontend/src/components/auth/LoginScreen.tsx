import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { t } from '../../i18n';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center max-w-md px-4">
        <img src="/assets/generated/app-logo.dim_512x512.png" alt="Logo" className="w-32 h-32 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">{t('welcome')}</h1>
        <p className="text-muted-foreground mb-8">कृपया जारी राख्न लगइन गर्नुहोस्</p>
        <Button
          onClick={handleLogin}
          disabled={isLoggingIn}
          size="lg"
          className="gap-2"
        >
          <LogIn className="h-5 w-5" />
          {isLoggingIn ? t('loggingIn') : t('login')}
        </Button>
      </div>
    </div>
  );
}
