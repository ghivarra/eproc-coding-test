import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/icon"
import { SquarePen } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Save } from "lucide-react"
import { APIResponse, CatalogItem, SubfieldSelectType } from "@/types"
import { Separator } from "@radix-ui/react-separator"
import { fetchApi, processError } from "@/lib/common"
import { toast } from "sonner"
import { AxiosResponse } from "axios"
import VendorCatalogUpdateForm from "./vendor-catalog-update-form"

interface VendorCatalogUpdateType {
    refreshData: () => void, 
    subfields: SubfieldSelectType[], 
    catalogID: number,
}

export default function VendorCatalogUpdate({ refreshData, subfields, catalogID }: VendorCatalogUpdateType) {

    const [ isDialogOpen, setIsDialogOpen ] = useState(false)
    const [ catalogData, setCatalogData ] = useState<CatalogItem|undefined>(undefined)

    // abort controller
    // fetch data
    const fetchCatalogData = useCallback((controller?: AbortController) => {
        const axios = fetchApi()
        axios.get(route('api.catalog.find'), {
            signal: (typeof controller !== 'undefined') ? controller.signal : undefined,
            params: {
                id: catalogID,
            }
        }).then((response: AxiosResponse) => {
            const res = response.data as APIResponse
            if (res.status === 'success') {
                const data = res.data as CatalogItem
                setCatalogData(data)
            } else {
                toast.warning(res.message)
            }
        }).catch((err) => {
            console.error(err)
            if (typeof err.response.data.message !== 'undefined') {
                processError({ err: [] }, err.response.data.message)
            }
        })
    }, [catalogID])

    // use effect
    useEffect(() => {

        const controller = new AbortController()

        if (isDialogOpen && (typeof catalogID !== 'undefined') && catalogData === undefined) {
            fetchCatalogData(controller)
        }

        return () => {
            controller.abort()
        }

    }, [isDialogOpen, catalogID, fetchCatalogData, catalogData])

    // render
    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <div>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Icon iconNode={SquarePen}></Icon>
                        Update
                    </Button>
                </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-[90dvw] md:max-w-[90dvw] md:w-[860px] overflow-auto max-h-[90dvh] p-4 flex flex-col">
                <DialogHeader className="pt-4">
                    <DialogTitle>Update Katalog</DialogTitle>
                    <DialogDescription>
                        Anda bisa memperbaharui data katalog untuk vendor terkait di sini.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <VendorCatalogUpdateForm defaultValue={catalogData} catalogID={catalogID} subfields={subfields} dialogToggle={setIsDialogOpen} refreshData={refreshData}>
                    <DialogFooter className="max-w-full">
                        <Button type="submit" className="w-full mb-4">
                            <Icon iconNode={Save} />
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </VendorCatalogUpdateForm>
            </DialogContent>
        </Dialog>
    )
}
