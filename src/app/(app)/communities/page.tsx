"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { communities } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Users, Check, Plus, BrainCircuit, Server, Coffee } from "lucide-react";

// A helper component to handle icon rendering including React icon as SVG
const CommunityIcon = ({ iconName, className }: { iconName: string, className?: string }) => {
  const commonProps = { className: cn("h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors", className) };
  switch (iconName) {
    case 'BrainCircuit': return <BrainCircuit {...commonProps} />;
    case 'React': return (
      <svg {...commonProps} fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>React</title>
        <path d="M12.001 2.002c-5.524 0-10.001 4.476-10.001 10.001s4.477 10.001 10.001 10.001 10.001-4.476 10.001-10.001-4.477-10.001-10.001-10.001zm0 18.002c-4.412 0-8.001-3.588-8.001-8.001s3.589-8.001 8.001-8.001 8.001 3.588 8.001 8.001-3.589 8.001-8.001 8.001z"></path><path d="M12 5.688a6.51 6.51 0 0 0-3.255 1.031l.91 1.576a5.01 5.01 0 0 1 2.345-.794c1.234 0 2.364.53 3.125 1.523l1.536-.921A6.485 6.485 0 0 0 12 5.688zm-.91 1.576L9.555 6.342a6.487 6.487 0 0 0-4.067 5.66l1.71.342a5.008 5.008 0 0 1 3.037-4.384zm1.82 3.152a1.493 1.493 0 1 0 0 2.986 1.493 1.493 0 0 0 0-2.986zM6.342 14.445l-1.576.91a6.485 6.485 0 0 0 5.66 4.067l.342-1.71a5.008 5.008 0 0 1-4.426-3.267zm11.316-2.443a5.008 5.008 0 0 1-3.037 4.384l.91 1.576a6.487 6.487 upbeat 0 0 0 4.067-5.66l-1.71-.342z"></path>
      </svg>
    );
    case 'Server': return <Server {...commonProps} />;
    case 'Coffee': return <Coffee {...commonProps} />;
    default: return <Users {...commonProps} />;
  }
};


export default function CommunitiesPage() {
  const { user, joinCommunity, leaveCommunity } = useAuth();

  return (
    <>
      <PageHeader
        title="Communities"
        description="Find and join communities to learn and grow with your peers."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {communities.map((community) => {
          const isJoined = user?.joinedCommunityIds.includes(community.id);
          return (
            <Card key={community.id} className="flex flex-col group overflow-hidden">
              <div className="relative">
                <Link href={`/communities/${community.id}`}>
                  <Image
                    src={community.image}
                    alt={community.name}
                    width={600}
                    height={400}
                    data-ai-hint={`${community.name}`}
                    className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                {isJoined && (
                  <Badge variant="default" className="absolute top-2 right-2 bg-primary/80 backdrop-blur-sm">
                    <Check className="h-3 w-3 mr-1" /> Joined
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CommunityIcon iconName={community.icon} />
                  <Link href={`/communities/${community.id}`} className="hover:underline">
                    {community.name}
                  </Link>
                </CardTitle>
                <CardDescription>{community.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {community.memberCount.toLocaleString()} members
                </div>
              </CardContent>
              <CardFooter>
                {isJoined ? (
                  <Button variant="outline" className="w-full" onClick={() => leaveCommunity(community.id)}>
                    Leave
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => joinCommunity(community.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Join
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </>
  );
}
