import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import VendorList from "./custom-components/vendor/vendor-list"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor',
        href: route('panel.dashboard')
    },
    {
        title: 'Vendor',
        href: route('panel.vendor')
    },
]

export default function Vendor() {

    return (
        <main>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Vendor" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <VendorList />
                </div>
            </AppLayout>
        </main>
    )
}