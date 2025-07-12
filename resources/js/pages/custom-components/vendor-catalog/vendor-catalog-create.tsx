import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/icon"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Save } from "lucide-react"
import VendorCatalogSearchForm from "./vendor-catalog-search-form"
import VendorCatalogCreateForm from "./vendor-catalog-create-form"
import { SubfieldSelectType } from "@/types"

interface VendorCatalogCreateType {
    refreshData: () => void, 
    subfields: SubfieldSelectType[], 
    vendorID: number
}

export default function VendorCatalogCreate({ refreshData, subfields, vendorID }: VendorCatalogCreateType) {

    const [ isDialogOpen, setIsDialogOpen ] = useState(false)

    // get subfields


    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <div className="w-full flex justify-between">
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Icon iconNode={Plus}></Icon>
                        Tambah Katalog
                    </Button>
                </DialogTrigger>
                <VendorCatalogSearchForm refreshData={refreshData}></VendorCatalogSearchForm>
            </div>
            <DialogContent className="sm:max-w-[425px] overflow-auto max-h-[90dvh] p-4 flex flex-col">
                <DialogHeader>
                    <DialogTitle>Tambah Katalog</DialogTitle>
                    <DialogDescription>
                        Anda bisa menambahkan katalog untuk vendor terkait di sini.
                    </DialogDescription>
                </DialogHeader>
                <VendorCatalogCreateForm vendorID={vendorID} subfields={subfields} dialogToggle={setIsDialogOpen} refreshData={refreshData}>
                    <DialogFooter className="max-w-full">
                        <Button type="submit" className="w-full mb-4">
                            <Icon iconNode={Save} />
                            Simpan Data
                        </Button>
                    </DialogFooter>
                </VendorCatalogCreateForm>
            </DialogContent>
        </Dialog>
    )
}
