import { useCallback, useEffect, useState } from "react"
import CatalogListItem from "./catalog-list-item"
import { APIResponse, CatalogItem } from "@/types"
import { fetchApi, processError } from "@/lib/common"
import { AxiosResponse } from "axios"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const CatalogQuerySchema = z.object({
    catalogQuery: z.string()
})

export default function CatalogList() {

    type CatalogListResponse = {
        total: number,
        totalFiltered: number,
        data: CatalogItem[]
    }
    const [ catalogs, setCatalogs ] = useState<CatalogListResponse|undefined>(undefined)

    // fetch data
    const fetchCatalogData = useCallback((query?: string, controller?: AbortController) => {
        const axios = fetchApi()
        axios.get(route('api.catalog.index'), {
            signal: (typeof controller !== 'undefined') ? controller.signal : undefined,
            params: {
                query: (typeof query === 'undefined') ? '' : query,
                limit: 20,
                offset: 0
            }
        }).then((response: AxiosResponse) => {
            const res = response.data as APIResponse
            if (res.status === 'success') {
                const data = res.data as CatalogListResponse
                setCatalogs(data)
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
        fetchCatalogData('', controller)
        return () => {
            controller.abort()
        }
    }, [fetchCatalogData])
    
    // process list
    const RenderVendorItem = () => {
        if (typeof catalogs === 'undefined') {
            return (<h1>Belum ada data vendor.</h1>)
        }

        const data = catalogs.data

        return (
            <div>
                {data.map(catalog => (
                    <CatalogListItem props={catalog} key={catalog.id} refreshData={fetchCatalogData} />
                ))}
            </div>
        )
    }

    const form = useForm<z.infer<typeof CatalogQuerySchema>>({
        resolver: zodResolver(CatalogQuerySchema),
        defaultValues: {
            catalogQuery: ''
        }
    })

    const searchData = (data: z.infer<typeof CatalogQuerySchema>) => {
        fetchCatalogData(data.catalogQuery)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(searchData)}>
                    <FormField control={form.control} name="catalogQuery" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-4">
                            <FormControl>
                                <Input id="catalogQuery" className="max-w-[160px]" placeholder="Cari katalog..." {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                </form>
            </Form>
            <RenderVendorItem />
        </>
    )
}