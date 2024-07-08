import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { UserNameForm } from "@/components/forms/user-name-form";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/app/_components/sidebar-nav";
import { ProfileForm } from "./profile-form";

export const metadata = constructMetadata({
  title: "Settings – Moon Crypto",
  description: "Configure your account and website settings.",
});

export default async function SettingsPage() {
  const user = await getCurrentUser();

  // if (!user) {
  //   redirect("/login");
  // }

  return (
    <>
      {/* <div className="grid gap-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        <UserNameForm user={{ id: '123', name: 'user.name' || "" }} />
      </div> */}
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <ProfileForm user={user} />
      </div>

    </>
  );
}
