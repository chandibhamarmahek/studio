"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Inbox,
  User as UserIcon,
  LogOut,
  BrainCircuit,
  Coffee,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "./logo";
import { UserNav } from "./user-nav";
import { Separator } from "./ui/separator";

// A helper component to handle icon rendering including React icon as SVG
const CommunityIcon = ({ iconName, className }: { iconName: string, className?: string }) => {
  const commonProps = { className: cn("h-4 w-4", className) };
  switch (iconName) {
    case 'BrainCircuit': return <BrainCircuit {...commonProps} />;
    case 'React': return (
      <svg {...commonProps} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>React</title>
        <path d="M12.001 2.002c-5.524 0-10.001 4.476-10.001 10.001s4.477 10.001 10.001 10.001 10.001-4.476 10.001-10.001-4.477-10.001-10.001-10.001zm0 18.002c-4.412 0-8.001-3.588-8.001-8.001s3.589-8.001 8.001-8.001 8.001 3.588 8.001 8.001-3.589 8.001-8.001 8.001z M12.001 5.688a6.51 6.51 0 0 0-3.255 1.031l.91 1.576a5.01 5.01 0 0 1 2.345-.794c1.234 0 2.364.53 3.125 1.523l1.536-.921A6.485 6.485 0 0 0 12.001 5.688zm-.91 1.576L9.556 6.342a6.487 6.487 0 0 0-4.067 5.66l1.71.342a5.008 5.008 0 0 1 3.037-4.384zm1.82 3.152a1.493 1.493 0 1 0 0 2.986 1.493 1.493 0 0 0 0-2.986zm-4.75-3.037 1.576-.91a6.485 6.485 0 0 0 5.66 4.067l.342-1.71a5.008 5.008 0 0 1-4.426-3.267zm11.316-2.443a5.008 5.008 0 0 1-3.037 4.384l.91 1.576a6.487 6.487 0 0 0 4.067-5.66l-1.71-.342z"></path>
      </svg>
    );
    case 'Server': return <Server {...commonProps} />;
    case 'Coffee': return <Coffee {...commonProps} />;
    default: return null;
  }
};


export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/communities", label: "Communities", icon: Users },
    { href: "/inbox", label: "Inbox", icon: Inbox },
    { href: "/profile", label: "Profile", icon: UserIcon },
  ];

  return (
    <aside className="w-64 flex-col border-r bg-card flex">
      <div className="p-4 flex items-center justify-between">
        <Logo />
        <UserNav />
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === href && "bg-muted text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log out
        </Button>
      </div>
    </aside>
  );
}
