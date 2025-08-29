import { LoginForm } from '@/components/login-form';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="absolute top-8 left-8">
            <Logo />
        </div>
        <LoginForm />
    </div>
  );
}
