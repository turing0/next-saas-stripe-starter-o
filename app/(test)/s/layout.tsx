import { SidebarNav } from "@/app/_components/sidebar-nav"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardNav } from "@/components/layout/dashboard-sidenav"
import { Separator } from "@/components/ui/separator"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}


interface SettingsLayoutProps {
  children: React.ReactNode
}
const sidebarNavItems = [
  {
    title: "Profile",
    href: "/s",
  },
  // {
  //   title: "Account",
  //   href: "/s/account",
  // },
  {
    title: "Appearance",
    href: "/s/appearance",
  },
  // {
  //   title: "Notifications",
  //   href: "/s/notifications",
  // },
  {
    title: "Display",
    href: "/s/display",
  },
]

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <DashboardShell>
      {/* <DashboardHeader
          heading="Settings"
          text="Manage account and website settings."
      /> */}
      {/* <Separator className="" /> */}
      {/* <div className="hidden space-y-6 p-5 pb-16 md:block"> */}
      <div className="grid gap-10">
        {/* <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div> */}
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          {/* <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside> */}
          <aside className="hidden w-[200px] flex-col md:flex">
            <DashboardNav items={sidebarNavItems} />
          </aside>

          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </DashboardShell>
  )
}