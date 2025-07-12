import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { fetchApi, formatCurrency, processError } from "@/lib/common";
import { APIResponse, CatalogItem, CustomAlertDialogProps, SubfieldSelectType } from "@/types";
import { router } from "@inertiajs/react";
import { Search, Trash2 } from "lucide-react";
import VendorCatalogUpdate from "./vendor-catalog-update";
import { CustomAlertDialog } from "@/pages/custom-dialogs/custom-alert-dialog";
import { AxiosResponse } from "axios";
import { toast } from "sonner";

interface VendorCatalogListItemType {
    props: CatalogItem,
    refreshData: () => void,
    subfields: SubfieldSelectType[],
}

export default function VendorCatalogListItem({ props, refreshData, subfields }: VendorCatalogListItemType) {

    const visitCatalogDetail = () => {
        router.visit(route('panel.catalog.detail', props.uuid))
    }

    const deleteAction = () => {
        const axios = fetchApi()
        axios.delete(route('api.catalog.delete'), {
            params: {
                id: props.id
            }
        })  
            .then((response: AxiosResponse) => {
                const res = response.data as APIResponse
                if (res.status === 'success') {
                    toast.warning(`Katalog ${props.title} sudah dihapus`)
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
        title: `Hapus katalog ${props.title}?`,
        description: `Aksi ini tidak bisa dikembalikan kecuali menghubungi sistem administrator.`,
        cancelText: 'Batal',
        cancelTextVariant: "outline",
        confirmText: "Ya, Hapus",
        confirmTextVariant: "destructive"
    }

    return (
        <>
            <TableRow>
                <TableCell>
                    <Button onClick={visitCatalogDetail} type="button" variant="default">
                        <Icon iconNode={Search} />
                    </Button>
                </TableCell>
                <TableCell>
                    <p className="font-bold pt-2 pb-3 whitespace-normal">{props.title}</p>
                    <div className="mb-2 flex items-center">
                        <VendorCatalogUpdate catalogID={props.id} refreshData={refreshData} subfields={subfields} />
                        <CustomAlertDialog {...deleteProps}>
                            <Button variant="link" className="text-red-600">
                                <Icon iconNode={Trash2} />
                                Hapus
                            </Button>
                        </CustomAlertDialog>
                    </div>
                </TableCell>
                <TableCell className="max-w-[140px] whitespace-normal">{props.qualification}</TableCell>
                <TableCell className="max-w-[100px] whitespace-normal text-right">{formatCurrency(props.value)}</TableCell>
            </TableRow>
        </>
    )
}