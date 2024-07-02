import { Avatar } from '@client/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@client/components/dropdown'
import { Navbar, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '@client/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/16/solid'
import {
  HomeIcon,
  InboxIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'
import { FaHashtag } from 'react-icons/fa'

export default function ConnectLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                <Avatar initials="SC" src="/tailwind-logo.svg" />
                <SidebarLabel>Somewhere Cool</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownDivider />
                <DropdownItem href="/teams/1">
                  <Avatar slot="icon" initials="SC" src="/tailwind-logo.svg" />
                  <DropdownLabel>Somewhere Cool</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/teams/2">
                  <Avatar slot="icon" initials="WC" className="bg-purple-500 text-white" />
                  <DropdownLabel>Workcation</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem href="/auth">
                  <PlusIcon />
                  <DropdownLabel>New Connection&hellip;</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <SidebarSection className="max-lg:hidden">
              <SidebarItem href="/search">
                <MagnifyingGlassIcon />
                <SidebarLabel>Search</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="inbox">
                <InboxIcon />
                <SidebarLabel>Inbox</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <Channels />
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar initials={"UN"} src="/profile-photo.jpg" className="size-10" square alt="" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">username</span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      chat.somewhere.cool
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="top start">
                <DropdownItem href="/my-profile">
                  <UserIcon />
                  <DropdownLabel>My profile</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownDivider />
              </DropdownMenu>
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}

function Channels() {
  const channels: ChannelProps[] = [
    { text: 'General', url: '1' },
    { text: 'Announcements', url: '2' },
    { text: 'Design', url: '3' },
    { text: 'Engineering', url: '4' },
    { text: 'Marketing', url: '5' },
    { text: 'Random', url: '6' },
  ]

  return (
    <SidebarSection>
      {
        channels.map((channel) => (
          <Channel key={channel.text} text={channel.text} url={channel.url} />
        ))
      }
    </SidebarSection>
  )
}

type ChannelProps = {
  text: string
  url: string
}

function Channel(props: ChannelProps) {
  return (
    <SidebarItem href={props.url}>
      <FaHashtag />
      <SidebarLabel>{props.text}</SidebarLabel>
    </SidebarItem>
  )
}
