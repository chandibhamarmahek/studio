"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { chats, users as allUsers, User } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function InboxPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  if (!user) return null;

  const userChats = chats.filter(chat => chat.participants.includes(user.id));
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim()) {
      const results = allUsers.filter(u => 
        u.id !== user.id && u.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleUserClick = (selectedUser: User) => {
    // Check if a chat with this user already exists
    const existingChat = userChats.find(chat => chat.participants.includes(selectedUser.id));
    if (existingChat) {
      router.push(`/inbox/${existingChat.id}`);
    } else {
      // Create a new chat (in a real app, this would be a backend call)
      const newChat = {
        id: `chat${Date.now()}`,
        participants: [user.id, selectedUser.id] as [string, string],
        messages: [],
      };
      chats.unshift(newChat); // Add to our mock data
      router.push(`/inbox/${newChat.id}`);
    }
    // Clear search
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <>
      <PageHeader
        title="Inbox"
        description="Your direct messages and conversations."
      />
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for people to message..." 
            className="pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchResults.length > 0 && (
             <Card className="absolute z-10 w-full mt-2 shadow-lg">
                <CardContent className="p-2">
                    {searchResults.map(foundUser => (
                        <div key={foundUser.id} onClick={() => handleUserClick(foundUser)} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted cursor-pointer">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={foundUser.avatar} />
                                <AvatarFallback>{getInitials(foundUser.name)}</AvatarFallback>
                            </Avatar>
                            <p className="font-semibold">{foundUser.name}</p>
                        </div>
                    ))}
                </CardContent>
             </Card>
          )}
        </div>
        
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {userChats.map((chat) => {
                const otherUserId = chat.participants.find(p => p !== user.id);
                const otherUser = allUsers.find(u => u.id === otherUserId);
                const lastMessage = chat.messages[chat.messages.length - 1];

                if (!otherUser) return null;

                return (
                  <Link key={chat.id} href={`/inbox/${chat.id}`}>
                    <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={otherUser.avatar} />
                        <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between">
                          <p className="font-semibold">{otherUser.name}</p>
                          {lastMessage && <p className="text-xs text-muted-foreground">{lastMessage.timestamp}</p>}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {lastMessage ? (
                            <>
                              {lastMessage.senderId === user.id && "You: "}
                              {lastMessage.text}
                            </>
                          ) : (
                            "No messages yet"
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {userChats.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
                No conversations yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
