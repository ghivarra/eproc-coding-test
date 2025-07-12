import AppSidebarLayout from './app/app-sidebar-layout';
import { User, type BreadcrumbItem } from '@/types';
import type { ReactNode }  from 'react';
import ProviderLayout from './provider-layout';

interface AppLayoutProps {
    children: ReactNode,
    breadcrumbs?: BreadcrumbItem[],
    updateUser: React.Dispatch<React.SetStateAction<User | null>>
}

export default function AppLayout({ children, breadcrumbs, updateUser, ...props }: AppLayoutProps) {

    return (
        <ProviderLayout updateUser={updateUser}>
            <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppSidebarLayout>
        </ProviderLayout>
    )
}
