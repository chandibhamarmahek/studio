"use client";

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { communities, posts as allPosts, users } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Check, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CommunityDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, joinCommunity, leaveCommunity } = useAuth();

  const community = communities.find(c => c.id === params.id);
  const posts = allPosts.filter(p => p.communityId === params.id);
  
  if (!community) {
    return <div>Community not found.</div>;
  }
  
  const isJoined = user?.joinedCommunityIds.includes(community.id);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }

  return (
    <>
      <PageHeader title={community.name} description={community.description}>
        {isJoined ? (
          <Button variant="outline" onClick={() => leaveCommunity(community.id)}>
            <Check className="mr-2 h-4 w-4" /> Joined
          </Button>
        ) : (
          <Button onClick={() => joinCommunity(community.id)}>
            <Plus className="mr-2 h-4 w-4" /> Join Community
          </Button>
        )}
      </PageHeader>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {isJoined && (
            <Card>
              <CardHeader>
                <CardTitle>Create a new post</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full gap-2">
                  <Textarea placeholder="What's on your mind?" />
                  <Button>Post</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Discussions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {posts.map(post => {
                const author = users.find(u => u.id === post.authorId);
                return (
                  <div key={post.id} className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={author?.avatar} />
                      <AvatarFallback>{author ? getInitials(author.name) : 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                         <p className="font-semibold">{author?.name}</p>
                         <p className="text-xs text-muted-foreground">{post.createdAt}</p>
                      </div>
                      <h3 className="font-semibold text-lg mt-1">{post.title}</h3>
                      <p className="text-muted-foreground mt-1">{post.content}</p>
                      <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">{post.replies.length} replies</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {posts.length === 0 && <p className="text-muted-foreground text-center py-4">No discussions yet. Start one!</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <Image 
              src={community.image} 
              alt={community.name} 
              width={600} 
              height={400} 
              className="w-full h-48 object-cover" 
              data-ai-hint={`${community.name}`}
            />
            <CardHeader>
              <CardTitle>About {community.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{community.memberCount.toLocaleString()} members</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
