import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem, User } from "@/types"
import { Head } from "@inertiajs/react"
import { useState } from "react"

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

export default function Vendor() {

    const [ user, setUser ] = useState<User|null>(null)

    return (
        <main>
            <AppLayout breadcrumbs={breadcrumbs} updateUser={setUser}>
                <Head title="Katalog" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <div className="bg-green-50 text-green-700 p-4 rounded-md">
                        Selamat datang kembali <b>{user?.name}</b>.
                    </div>
                </div>
            </AppLayout>
        </main>
    )
}