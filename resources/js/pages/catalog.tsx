import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"
import CatalogList from "./custom-components/catalog/catalog-list"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor',
        href: route('panel.dashboard')
    },
    {
        title: 'Katalog',
        href: route('panel.catalog')
    },
]

export default function Katalog() {

    return (
        <main>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Katalog" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <div className="mb-4">
                        <h1 className="font-bold text-3xl mb-1">Katalog</h1>
                        <p className="text-gray-600">Anda dapat melihat semua katalog yang dibuat oleh vendor apa pun di sini.</p>
                    </div>
                    <CatalogList />
                </div>
            </AppLayout>
        </main>
    )
}