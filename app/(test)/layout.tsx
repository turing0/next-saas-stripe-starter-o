import { DashboardNav } from "@/components/layout/dashboard-sidenav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { dashboardConfig } from "@/config/dashboard";

interface TestLayoutProps {
  children?: React.ReactNode;
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

export default function TestLayout({ children }: TestLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <NavBar />

      <MaxWidthWrapper className="min-h-svh">
        {/* <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr]"> */}
          {/* <aside className="hidden w-[200px] flex-col md:flex">
            <DashboardNav items={sidebarNavItems} />
          </aside> */}
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        {/* </div> */}
      </MaxWidthWrapper>
      <SiteFooter className="border-t" />
    </div>
  );
}
