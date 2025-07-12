import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import AppLogo from './app-logo';
import { DynamicIcon } from './dynamic-icon';
import useAuthorizedUser from '@/hooks/use-authorized-user';

const mainNavItems: NavItem[] = [
    {
        title: 'Dasbor',
        href: route('panel.dashboard'),
        icon: DynamicIcon('LayoutGrid'),
    },
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {

    const authUserContext = useAuthorizedUser()

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser user={authUserContext} />
            </SidebarFooter>
        </Sidebar>
    );
}
