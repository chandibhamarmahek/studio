"use client";

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/lib/types';
import { users, communities } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, interest?: string) => boolean;
  logout: () => void;
  updateUserProfile: (updatedUser: Partial<User>) => void;
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = useCallback((email: string, interest?: string) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      let userToLogin = { ...foundUser };
      if (interest) {
        const communityToJoin = communities.find(c => c.name.toLowerCase() === interest.toLowerCase());
        if (communityToJoin) {
          if (!userToLogin.joinedCommunityIds.includes(communityToJoin.id)) {
            userToLogin.joinedCommunityIds = [...userToLogin.joinedCommunityIds, communityToJoin.id];
          }
        } else {
            toast({
                variant: "destructive",
                title: "Community not found",
                description: `We couldn't find a community for "${interest}". Please check the name and try again.`,
            });
            return false;
        }
      }
      setUser(userToLogin);
      return true;
    }
    return false;
  }, [toast]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUserProfile = useCallback((updatedUser: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updatedUser } : null);
  }, []);

  const joinCommunity = useCallback((communityId: string) => {
    setUser(prev => {
        if (!prev || prev.joinedCommunityIds.includes(communityId)) return prev;
        return { ...prev, joinedCommunityIds: [...prev.joinedCommunityIds, communityId] };
    });
  }, []);

  const leaveCommunity = useCallback((communityId:string) => {
    setUser(prev => {
        if (!prev) return prev;
        return { ...prev, joinedCommunityIds: prev.joinedCommunityIds.filter(id => id !== communityId) };
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUserProfile, joinCommunity, leaveCommunity }}>
      {children}
    </AuthContext.Provider>
  );
};
