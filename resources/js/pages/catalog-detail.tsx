import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Head, usePage } from "@inertiajs/react"
import CatalogDetailContent from "./custom-components/catalog/catalog-detail-content"

export default function CatalogDetail() {

    const { props } = usePage()

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dasbor',
            href: route('panel.dashboard')
        },
        {
            title: 'Katalog',
            href: route('panel.catalog')
        },
        {
            title: 'Detail',
            href: route('panel.catalog.detail', props.uuid as string)
        }
    ]

    // set id
    const id = props.id as number

    // render
    return (
        <main>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Detail" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <CatalogDetailContent id={id} />
                </div>
            </AppLayout>
        </main>
    )
}