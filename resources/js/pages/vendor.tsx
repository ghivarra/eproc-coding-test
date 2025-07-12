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
                    <div className="mb-4">
                        <h1 className="font-bold text-3xl mb-1">Vendor</h1>
                        <p className="text-gray-600">Tambah, update data, dan hapus vendor yang anda kelola.</p>
                    </div>
                    <VendorList />
                </div>
            </AppLayout>
        </main>
    )
}