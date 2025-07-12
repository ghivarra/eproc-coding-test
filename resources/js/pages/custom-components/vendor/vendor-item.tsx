import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { VendorItemType } from "@/types"
import { LogIn } from "lucide-react"
import { Icon } from "@/components/icon"
import VendorUpdate from "./vendor-update"
import { Trash2 } from "lucide-react"

export default function VendorItem({ props, onUpdate }: { props: VendorItemType, onUpdate: () => void }) {
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
                <VendorUpdate onUpdate={onUpdate} />
                <Button variant="link" className="text-red-600">
                    <Icon iconNode={Trash2} />
                    Hapus
                </Button>
            </CardFooter>
        </Card>
    )
}