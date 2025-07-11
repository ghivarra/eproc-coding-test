import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { APIResponse, User, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import AppLogo from './app-logo';
import { DynamicIcon } from './dynamic-icon';
import { fetchApi, logout } from '@/lib/common';
import { useState } from 'react';
import { AxiosResponse } from 'axios';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: DynamicIcon('LayoutGrid'),
    },
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {

    // reactivity
    const [ user, setUser ] = useState<User>({
        id: 0,
        name: '',
        email: '',
        created_at: '',
        updated_at: ''
    })

    // get user data
    fetchApi().get(route('api.auth.check'))
        .then((response: AxiosResponse) => {
            const res = response.data as APIResponse

            if (res.message === 'error') {
                logout()
                return
            } else {
                const data = res.data as User
                setUser(data)
            }
        })
        .catch((err) => {
            console.error(err)
        })

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
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
