import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Icon } from "@/components/icon"
import { useState } from "react"
import { Save, SquarePen } from "lucide-react"
import VendorCreateForm from "./vendor-create-form"

export default function VendorUpdate({ onUpdate }: { onUpdate: () => void }) {

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
                <VendorCreateForm dialogToggle={setIsDialogOpen} onUpdate={onUpdate}>
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
