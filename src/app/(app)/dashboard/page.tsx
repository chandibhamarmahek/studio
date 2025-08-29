"use client";

import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { communities } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BrainCircuit, Coffee, Server } from "lucide-react";
import { cn } from "@/lib/utils";

// A helper component to handle icon rendering including React icon as SVG
const CommunityIcon = ({ iconName, className }: { iconName: string, className?: string }) => {
  const commonProps = { className: cn("h-6 w-6 text-muted-foreground", className) };
  switch (iconName) {
    case 'BrainCircuit': return <BrainCircuit {...commonProps} />;
    case 'React': return (
      <svg {...commonProps} fill="currentColor" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>React</title>
        <path d="M12.001 2.002c-5.524 0-10.001 4.476-10.001 10.001s4.477 10.001 10.001 10.001 10.001-4.476 10.001-10.001-4.477-10.001-10.001-10.001zm0 18.002c-4.412 0-8.001-3.588-8.001-8.001s3.589-8.001 8.001-8.001 8.001 3.588 8.001 8.001-3.589 8.001-8.001 8.001z M12.001 5.688a6.51 6.51 0 0 0-3.255 1.031l.91 1.576a5.01 5.01 0 0 1 2.345-.794c1.234 0 2.364.53 3.125 1.523l1.536-.921A6.485 6.485 0 0 0 12.001 5.688zm-.91 1.576L9.556 6.342a6.487 6.487 0 0 0-4.067 5.66l1.71.342a5.008 5.008 0 0 1 3.037-4.384zm1.82 3.152a1.493 1.493 0 1 0 0 2.986 1.493 1.493 0 0 0 0-2.986zm-4.75-3.037 1.576-.91a6.485 6.485 0 0 0 5.66 4.067l.342-1.71a5.008 5.008 0 0 1-4.426-3.267zm11.316-2.443a5.008 5.008 0 0 1-3.037 4.384l.91 1.576a6.487 6.487 0 0 0 4.067-5.66l-1.71-.342z"></path>
      </svg>
    );
    case 'Server': return <Server {...commonProps} />;
    case 'Coffee': return <Coffee {...commonProps} />;
    default: return null;
  }
};


export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const joinedCommunities = communities.filter(c => user.joinedCommunityIds.includes(c.id));

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name}!`}
        description="Here's a quick overview of your learning world."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Communities</CardTitle>
            <CardDescription>
              Jump back into your learning groups.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {joinedCommunities.length > 0 ? (
              <div className="space-y-4">
                {joinedCommunities.map(community => (
                  <Link href={`/communities/${community.id}`} key={community.id} className="block">
                    <div className="flex items-center justify-between p-3 -m-3 rounded-lg hover:bg-muted">
                        <div className="flex items-center gap-4">
                          <CommunityIcon iconName={community.icon} />
                          <div>
                              <p className="font-semibold">{community.name}</p>
                              <p className="text-sm text-muted-foreground">{community.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven&apos;t joined any communities yet.</p>
                <Button asChild>
                  <Link href="/communities">Explore Communities</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                    Complete your profile to get personalized community suggestions.
                </p>
                <Button asChild>
                    <Link href="/profile">Go to Profile</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
