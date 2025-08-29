"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { chats as initialChats, users, addMessageToChat, Message } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  
  const [chats, setChats] = useState(initialChats);
  const [newMessage, setNewMessage] = useState('');

  const chat = chats.find(c => c.id === params.id);
  
  if (!user || !chat) {
    return <div>Loading...</div>;
  }
  
  const otherUserId = chat.participants.find(p => p !== user.id);
  const otherUser = users.find(u => u.id === otherUserId);

  if (!otherUser) {
    return <div>User not found.</div>;
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg${Date.now()}`,
      senderId: user.id,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedChat = addMessageToChat(chat.id, message);
    if(updatedChat) {
      setChats(prevChats => prevChats.map(c => c.id === chat.id ? updatedChat : c));
    }
    setNewMessage('');
  };


  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Card className="flex flex-col flex-1">
        <CardHeader className="flex flex-row items-center gap-4 p-4 border-b">
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/inbox">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Avatar>
            <AvatarImage src={otherUser.avatar} />
            <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{otherUser.name}</p>
            <p className="text-sm text-muted-foreground">Active now</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {chat.messages.map(message => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2 max-w-xs",
                message.senderId === user.id ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.senderId === user.id ? user.avatar : otherUser.avatar} />
                <AvatarFallback>{getInitials(message.senderId === user.id ? user.name : otherUser.name)}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "rounded-lg px-4 py-2",
                  message.senderId === user.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
            <Input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
