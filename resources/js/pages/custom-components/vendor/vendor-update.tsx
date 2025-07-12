import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/icon"
import { useState } from "react"
import { Save, SquarePen } from "lucide-react"
import VendorUpdateForm from "./vendor-update-form"
import { VendorItemType } from "@/types"

export default function VendorUpdate({ defaultValue, refreshData }: { defaultValue: VendorItemType, refreshData: () => void }) {

    const [ isDialogOpen, setIsDialogOpen ] = useState(false)

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mr-4">
                    <Icon iconNode={SquarePen}></Icon>
                    Update
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Vendor</DialogTitle>
                    <DialogDescription>
                        Anda bisa merubah data vendor yang anda kelola di sini
                    </DialogDescription>
                </DialogHeader>
                <VendorUpdateForm defaultValue={defaultValue} dialogToggle={setIsDialogOpen} refreshData={refreshData}>
                    <DialogFooter className="max-w-full">
                        <Button type="submit" className="w-full mb-4">
                            <Icon iconNode={Save} />
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </VendorUpdateForm>
            </DialogContent>
        </Dialog>
    )
}
