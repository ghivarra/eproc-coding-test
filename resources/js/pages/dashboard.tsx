import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"
import { Head } from "@inertiajs/react"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/'
    }
]

export default function Dashboard() {
    return (
        <main>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dasbor" />
                Hello...
            </AppLayout>
        </main>
    )
}