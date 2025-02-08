import { Calendar, Home, Inbox, Search, Settings, Contact, CarFrontIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "../ui/button"
import { Link } from "react-router"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Account",
    url: "account",
    icon: Contact,
  },
  {
    title: "Dashboard",
    url: "dashboard",
    icon: CarFrontIcon,
  },
]

function AppSidebar() {
        // const {
        //   state,
        //   open,
        //   setOpen,
        //   openMobile,
        //   setOpenMobile,
        //   isMobile,
        //   toggleSidebar,
        // } = useSidebar()



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
      style={{
      }}
      >
        <AppSidebar />
        <main className="w-full mt-14">
          {children}
        </main>
      </SidebarProvider>
    )
  }
