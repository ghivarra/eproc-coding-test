import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem } from "@/types"

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
                Hello...
            </AppLayout>
        </main>
    )
}