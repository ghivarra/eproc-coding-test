import AppLayout from "@/layouts/app-layout"
import { fetchApi, processError } from "@/lib/common"
import { APIResponse, BreadcrumbItem, VendorItemType } from "@/types"
import { Head, usePage } from "@inertiajs/react"
import { AxiosResponse } from "axios"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import VendorCatalogList from "./custom-components/vendor-catalog/vendor-catalog-list"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dasbor',
        href: route('panel.dashboard')
    },
    {
        title: 'Vendor',
        href: route('panel.vendor')
    },
    {
        title: 'Daftar Katalog',
        href: ''
    },
]

export default function Vendor() {

    const { props } = usePage()
    const [ vendor, setVendor ] = useState<VendorItemType|undefined>(undefined)

    // fetch data
    const fetchVendorData = useCallback(() => {
        const axios = fetchApi()
        axios.get(route('api.vendor.find'), {
            params: {
                id: props.id
            }
        }).then((response: AxiosResponse) => {
            const res = response.data as APIResponse
            if (res.status === 'success') {
                const data = res.data as VendorItemType
                setVendor(data)
            } else {
                toast.warning(res.message)
            }
        }).catch((err) => {
            console.error(err)
            if (typeof err.response.data.message !== 'undefined') {
                processError({ err: [] }, err.response.data.message)
            }
        })
    }, [props.id])

    // use effect
    useEffect(() => {
        fetchVendorData()
    }, [fetchVendorData])

    return (
        <main>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Katalog Vendor" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                    <div className="mb-4">
                        <h1 className="font-bold text-3xl mb-1">{ vendor && vendor.name } ({ vendor && vendor.founded_at })</h1>
                        <p className="text-gray-600">Tambah, update data, dan hapus katalog pada vendor { vendor && vendor.name } yang anda kelola.</p>
                    </div>
                    <section>
                        <VendorCatalogList vendorID={props.id as number}></VendorCatalogList>
                    </section>
                </div>
            </AppLayout>
        </main>
    )
}