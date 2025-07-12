import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { APIResponse, CustomAlertDialogProps, VendorItemType } from "@/types"
import { LogIn } from "lucide-react"
import { Icon } from "@/components/icon"
import VendorUpdate from "./vendor-update"
import { Trash2 } from "lucide-react"
import { CustomAlertDialog } from "@/pages/custom-dialogs/custom-alert-dialog"
import { fetchApi, processError } from "@/lib/common"
import { AxiosResponse } from "axios"
import { toast } from "sonner"

export default function VendorItem({ props, refreshData }: { props: VendorItemType, refreshData: () => void }) {

    const deleteAction = () => {
        const axios = fetchApi()
        axios.delete(route('api.vendor.delete'), {
            params: {
                id: props.id
            }
        })  
            .then((response: AxiosResponse) => {
                const res = response.data as APIResponse
                if (res.status === 'success') {
                    toast.warning(`Vendor ${props.name} dan semua katalog yang diterbitkan vendor ini sudah dihapus`)
                    refreshData()
                }
            })
            .catch((err) => {
                console.error(err)
                if (typeof err.response.data.message !== 'undefined') {
                    if (typeof err.response.data.data !== 'undefined') {
                        const errorResponse: {
                            id?: string[],
                        } = err.response.data.data.errors
                        processError(errorResponse, err.response.data.message)
                    } else {
                        toast.error(err.response.data.message)
                    }
                } else {
                    toast.error(err.message)
                }
            })
    }

    const deleteProps: CustomAlertDialogProps = {
        callback: deleteAction,
        title: `Hapus vendor ${props.name}?`,
        description: `Anda juga akan menghapus semua katalog yang sudah diterbitkan oleh vendor ${props.name}. Aksi ini tidak bisa dikembalikan kecuali menghubungi sistem administrator.`,
        cancelText: 'Batal',
        cancelTextVariant: "outline",
        confirmText: "Ya, Hapus",
        confirmTextVariant: "destructive"
    }

    return (
        <Card className="mb-8 bg-gradient-to-bl from-white to-cyan-50">
            <CardHeader>
                <CardTitle>{props.name} ({props.founded_at})</CardTitle>
                <CardDescription>{props.website}</CardDescription>
                <CardAction>
                    <Button type="button">
                        <Icon iconNode={LogIn} />
                        Masuk
                    </Button>
                </CardAction>
            </CardHeader>
            <CardFooter>
                <VendorUpdate defaultValue={props} refreshData={refreshData} />
                <CustomAlertDialog {...deleteProps}>
                    <Button variant="link" className="text-red-600">
                        <Icon iconNode={Trash2} />
                        Hapus
                    </Button>
                </CustomAlertDialog>
            </CardFooter>
        </Card>
    )
}