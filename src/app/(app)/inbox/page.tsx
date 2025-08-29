"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { chats, users } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const { user } = useAuth();

  if (!user) return null;

  const userChats = chats.filter(chat => chat.participants.includes(user.id));
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }

  return (
    <>
      <PageHeader
        title="Inbox"
        description="Your direct messages and conversations."
      />
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {userChats.map((chat, index) => {
              const otherUserId = chat.participants.find(p => p !== user.id);
              const otherUser = users.find(u => u.id === otherUserId);
              const lastMessage = chat.messages[chat.messages.length - 1];

              if (!otherUser) return null;

              return (
                <Link key={chat.id} href={`/inbox/${chat.id}`}>
                  <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={otherUser.avatar} />
                      <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-semibold">{otherUser.name}</p>
                        <p className="text-xs text-muted-foreground">{lastMessage.timestamp}</p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage.senderId === user.id && "You: "}
                        {lastMessage.text}
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
    </>
  );
}
