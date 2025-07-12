import AppSidebarLayout from './app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import type { ReactNode }  from 'react';
import ProviderLayout from './provider-layout';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {

    return (
        <ProviderLayout>
            <AppSidebarLayout breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppSidebarLayout>
        </ProviderLayout>
    )
}
