import { PageHeader } from "@/components/page-header";
import { ProfileClientPage } from "./profile-client-page";
import { suggestCommunities } from "@/ai/flows/suggest-communities";

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Your Profile"
        description="Manage your personal information and learning preferences."
      />
      <ProfileClientPage suggestCommunitiesFn={suggestCommunities} />
    </>
  );
}
