import { Home, CarFrontIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import SideContent from "../sidecontent"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Account",
    url: "account",
    icon: CarFrontIcon,
  },
  // {
  //   title: "Dashboard",
  //   url: "dashboard",
  //   icon: CarFrontIcon,
  // },
  // {
  //   title: "Admin",
  //   url: "admin",
  //   icon: AppWindow,
  // },
]

function AppSidebar() {
  const {
    isMobile,
  } = useSidebar()

  if(isMobile) {
    return (
      <div className="fixed z-30 bottom-0 flex justify-around w-screen border-t-[1px] border-black bg-slate-300 p-2">
        {
          items.map((item, i) => 
            <Link to={item.url} key={i}>
              <Button>{item.title}</Button>
            </Link>
          )
        }
      </div>
    )
  }

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarTrigger />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      defaultOpen={false}
      style={{
      }}
    >
      <AppSidebar />
      <main className="w-full md:w-1/2 mt-14">
        {children}
      </main>
      <aside className="hidden md:block mt-14 w-1/2">
      <SideContent />
      </aside>
    </SidebarProvider>
  )
}
