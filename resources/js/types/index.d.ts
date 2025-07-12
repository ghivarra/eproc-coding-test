import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    // auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    // email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface APIResponse {
    status: "success" | "error",
    message: string,
    data: unknown,
}

export interface VendorItemType {
    id: number,
    name: string,
    website: string,
    founded_at: string,
    user_id: number,
    user_name: string,
}

interface CustomAlertDialogProps {
    children?: ReactNode,
    callback: () => void,
    title: string,
    description: string,
    cancelText: string,
    cancelTextVariant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
    confirmText: string,
    confirmTextVariant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined,
}

interface SubfieldsCollection {
    catalog_id: number,
    field_id: number,
    field_name: string,
    subfield_id: number,
    subfield_name: string,
}

interface CatalogItem {
    id: number,
    uuid: string,
    title: string,
    number: string,
    location: string,
    qualification: string,
    value: number,
    vendor_id: number,
    vendor_name: string,
    register_date_start: string,
    register_date_end: string,
    created_at: string,
    updated_at: string,
    method: string?,
    documentation_date_start?: string,
    documentation_date_end?: string,
    description?: string,
    subfields_collection?: SubfieldsCollection[]
}