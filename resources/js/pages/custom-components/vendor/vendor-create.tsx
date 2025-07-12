import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/icon"
import { Plus } from "lucide-react"
import VendorSearchForm from "./vendor-search-form"
import { useState } from "react"
import { Save } from "lucide-react"
import VendorCreateForm from "./vendor-create-form"

export default function VendorCreate({ refreshData }: { refreshData: () => void }) {

    const [ isDialogOpen, setIsDialogOpen ] = useState(false)

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <div className="w-full flex justify-between">
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Icon iconNode={Plus}></Icon>
                        Tambah Vendor
                    </Button>
                </DialogTrigger>
                <VendorSearchForm refreshData={refreshData} />
            </div>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tambah Vendor</DialogTitle>
                    <DialogDescription>
                        Anda bisa menambahkan vendor yang anda kelola di sini.
                    </DialogDescription>
                </DialogHeader>
                <VendorCreateForm dialogToggle={setIsDialogOpen} refreshData={refreshData}>
                    <DialogFooter className="max-w-full">
                        <Button type="submit" className="w-full mb-4">
                            <Icon iconNode={Save} />
                            Simpan Data
                        </Button>
                    </DialogFooter>
                </VendorCreateForm>
            </DialogContent>
        </Dialog>
    )
}
