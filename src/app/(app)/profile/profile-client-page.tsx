"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/lib/types";
import { suggestCommunities, SuggestCommunitiesOutput } from "@/ai/flows/suggest-communities";
import { Loader2, Wand2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ProfileClientPageProps {
    suggestCommunitiesFn: typeof suggestCommunities;
}

export function ProfileClientPage({ suggestCommunitiesFn }: ProfileClientPageProps) {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    skills: user?.skills.join(", ") || "",
    learningGoals: user?.learningGoals || "",
    interests: user?.interests || "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[] | null>(null);

  if (!user) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    const updatedUser: Partial<User> = {
      ...formData,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
    };

    setTimeout(() => {
        updateUserProfile(updatedUser);
        setIsSaving(false);
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
    }, 1000);
  };

  const handleGetSuggestions = async () => {
    setIsSuggesting(true);
    setSuggestions(null);
    try {
        const result: SuggestCommunitiesOutput = await suggestCommunitiesFn({
            skills: formData.skills,
            learningGoals: formData.learningGoals,
            interests: formData.interests,
        });
        setSuggestions(result.suggestedCommunities);
    } catch (error) {
        console.error("Failed to get suggestions:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch AI suggestions. Please try again later.",
        });
    } finally {
        setIsSuggesting(false);
    }
  };


  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your skills, goals, and interests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input id="skills" name="skills" placeholder="React, Python, SQL" value={formData.skills} onChange={handleInputChange} />
              <p className="text-sm text-muted-foreground">Comma-separated skills.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="learningGoals">Learning Goals</Label>
              <Textarea id="learningGoals" name="learningGoals" value={formData.learningGoals} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              <Textarea id="interests" name="interests" value={formData.interests} onChange={handleInputChange} />
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>AI Community Suggestions</CardTitle>
            <CardDescription>Get AI-powered recommendations based on your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGetSuggestions} disabled={isSuggesting} className="w-full">
              {isSuggesting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Get Suggestions
            </Button>
            {suggestions && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold">Recommended for you:</h4>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Badge key={index} variant="secondary">{suggestion}</Badge>
                  ))}
                </div>
                <Button variant="link" asChild className="p-0 h-auto">
                    <Link href="/communities">Explore all communities &rarr;</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
