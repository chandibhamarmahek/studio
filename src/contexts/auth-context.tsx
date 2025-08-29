"use client";

import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/lib/types';
import { users as initialUsers, communities } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string, interest?: string) => boolean;
  signup: (name: string, email: string, password?: string, interest?: string) => boolean;
  logout: () => void;
  updateUserProfile: (updatedUser: Partial<User>) => void;
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();

  const login = useCallback((email: string, password?: string, interest?: string) => {
    const foundUser = users.find(u => u.email === email);
    
    if (!foundUser) return false;

    let userToLogin = { ...foundUser };
    
    if (interest) {
      const communityToJoin = communities.find(c => c.name.toLowerCase() === interest.toLowerCase());
      if (communityToJoin) {
        if (!userToLogin.joinedCommunityIds.includes(communityToJoin.id)) {
          userToLogin.joinedCommunityIds = [...userToLogin.joinedCommunityIds, communityToJoin.id];
        }
      }
    }
    
    setUser(userToLogin);
    return true;
  }, [users, toast]);

  const signup = useCallback((name: string, email: string, password?: string, interest?: string) => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false; // User already exists
    }

    const newUser: User = {
      id: `user${users.length + 1}`,
      name,
      email,
      avatar: `https://picsum.photos/seed/${name}/200`,
      skills: [],
      learningGoals: '',
      interests: interest ? interest : '',
      joinedCommunityIds: [],
    };
    
    if (interest) {
      const communityToJoin = communities.find(c => c.name.toLowerCase() === interest.toLowerCase());
      if (communityToJoin) {
        newUser.joinedCommunityIds.push(communityToJoin.id);
      } else {
        toast({
          variant: "destructive",
          title: "Community not found",
          description: `We couldn't find a community for "${interest}". You can join one later.`,
        });
      }
    }
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    setUser(newUser);
    return true;

  }, [users, toast]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUserProfile = useCallback((updatedUser: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updatedUser } : null);
    setUsers(prevUsers => prevUsers.map(u => u.id === user?.id ? { ...u, ...updatedUser } : u));
  }, [user?.id]);

  const joinCommunity = useCallback((communityId: string) => {
    setUser(prev => {
        if (!prev || prev.joinedCommunityIds.includes(communityId)) return prev;
        const newUser = { ...prev, joinedCommunityIds: [...prev.joinedCommunityIds, communityId] };
        setUsers(prevUsers => prevUsers.map(u => u.id === newUser.id ? newUser : u));
        return newUser;
    });
  }, []);

  const leaveCommunity = useCallback((communityId:string) => {
    setUser(prev => {
        if (!prev) return prev;
        const newUser = { ...prev, joinedCommunityIds: prev.joinedCommunityIds.filter(id => id !== communityId) };
        setUsers(prevUsers => prevUsers.map(u => u.id === newUser.id ? newUser : u));
        return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateUserProfile, joinCommunity, leaveCommunity }}>
      {children}
    </AuthContext.Provider>
  );
};
