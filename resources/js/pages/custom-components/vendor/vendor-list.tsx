import { useCallback, useEffect, useState } from "react"
import VendorItem from "./vendor-item"
import VendorCreate from "./vendor-create"
import { APIResponse, VendorItemType } from "@/types"
import { fetchApi, processError } from "@/lib/common"
import { AxiosResponse } from "axios"
import { toast } from "sonner"


export default function VendorList() {

    type VendorListResponse = {
        total: number,
        filteredData: number,
        data: VendorItemType[]
    }
    const [ vendors, setVendors ] = useState<VendorListResponse|undefined>(undefined)

    // fetch data
    const fetchVendorData = useCallback((query?: string, controller?: AbortController) => {
        const axios = fetchApi()
        axios.get(route('api.vendor.index'), {
            signal: (typeof controller !== 'undefined') ? controller.signal : undefined,
            params: {
                query: (typeof query === 'undefined') ? '' : query,
                limit: 10,
                offset: 0
            }
        }).then((response: AxiosResponse) => {
            const res = response.data as APIResponse
            if (res.status === 'success') {
                const data = res.data as VendorListResponse
                setVendors(data)
            } else {
                toast.warning(res.message)
            }
        }).catch((err) => {
            console.error(err)
            if (typeof err.response.data.message !== 'undefined') {
                processError({ err: [] }, err.response.data.message)
            }
        })
    }, [])

    // use effect
    useEffect(() => {
        const controller = new AbortController()
        fetchVendorData('', controller)
        return () => {
            controller.abort()
        }
    }, [fetchVendorData])
    
    // process list
    const RenderVendorItem = () => {
        if (typeof vendors === 'undefined') {
            return (<h1>Belum ada data vendor.</h1>)
        }

        const data = vendors.data

        return (
            <div>
                {data.map(vendor => (
                    <VendorItem props={vendor} key={vendor.id} refreshData={fetchVendorData} />
                ))}
            </div>
        )
    }

    return (
        <>
            <VendorCreate refreshData={fetchVendorData} />
            <RenderVendorItem />
        </>
    )
}