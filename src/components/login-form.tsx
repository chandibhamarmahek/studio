"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { users } from '@/lib/data';

export function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [interest, setInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, signup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      let success = false;
      if (isSignUp) {
        success = signup(name, email, password, interest);
        if (success) {
           toast({
            title: "Account Created",
            description: "You have been successfully signed up and logged in.",
          });
        } else {
            toast({
                variant: "destructive",
                title: "Sign Up Failed",
                description: "A user with this email already exists.",
            });
        }
      } else {
        success = login(email, password, interest);
         if (!success) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: "Invalid email or password. Please try again.",
            });
         }
      }

      if (success) {
        router.push('/dashboard');
      } else {
        setIsLoading(false);
      }
    }, 1000);
  };

  const toggleFormMode = () => {
    setIsSignUp(!isSignUp);
    // Clear fields when toggling
    setEmail('');
    setPassword('');
    setName('');
    setInterest('');
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{isSignUp ? 'Create Account' : 'Login'}</CardTitle>
        <CardDescription>
          {isSignUp 
            ? 'Enter your details to create a new account.' 
            : <>Enter your email below to login. Hint: Use <code className="bg-muted px-1 rounded-sm">{users[0].email}</code> and any password.</>
          }
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          {isSignUp && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interest">Area of Interest (Optional)</Label>
            <Input
              id="interest"
              type="text"
              placeholder="e.g. React, Machine Learning"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
           <Button variant="link" type="button" onClick={toggleFormMode} disabled={isLoading}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
