import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/common";
import { CatalogItem } from "@/types";
import { router } from "@inertiajs/react";
import { Search } from "lucide-react";

export default function VendorCatalogListItem({ props }: {props: CatalogItem}) {

    const visitCatalogDetail = () => {
        router.visit(route('panel.catalog.detail', props.uuid))
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
                    <p>{props.title}</p>
                    <div>

                    </div>
                </TableCell>
                <TableCell className="max-w-100px">{props.vendor_name}</TableCell>
                <TableCell className="max-w-[140px]">{props.qualification}</TableCell>
                <TableCell className="max-w-[100px] text-right">{formatCurrency(props.value)}</TableCell>
            </TableRow>
        </>
    )
}