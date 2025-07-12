import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, localDate } from "@/lib/common"
import { CatalogItem } from "@/types"
import { router } from "@inertiajs/react"
import { Search } from "lucide-react"

export default function CatalogListItem({ props }: { props: CatalogItem, refreshData: () => void }) {

    const visitCatalog = () => {
        router.visit(route('panel.catalog.detail', props.uuid))
    }

    return (
        <Card className="mb-8 bg-gradient-to-bl from-white to-cyan-50">
            <CardHeader>
                <CardTitle>
                    <div>
                        <p className="mb-2 text-gray-600">{props.vendor_name}</p>
                        <p className="text-xl">{props.title} </p>
                    </div>
                </CardTitle>
                <CardDescription>{props.number}</CardDescription>
                <CardAction>
                    <Button onClick={visitCatalog} type="button">
                        <Icon iconNode={Search} />
                        Detail
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className="font-bold text-gray-700 tracking-wider ">
                    {formatCurrency(props.value)}
                </div>
            </CardContent>
            <CardFooter>
                <div>
                    <b>Waktu Pendaftaran:</b>
                    <br />
                    <span className="mr-2">{localDate(props.register_date_start)}</span>
                    s/d
                    <span className="ml-2">{localDate(props.register_date_end)}</span>
                </div>
            </CardFooter>
        </Card>
    )
}