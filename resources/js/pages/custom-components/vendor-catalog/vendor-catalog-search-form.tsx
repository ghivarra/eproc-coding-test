import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"

const vendorCatalogQuerySchema = z.object({
    vendorCatalogQuery: z.string()
})

export default function VendorCatalogSearchForm({ refreshData }: { refreshData: (query?: string) => void }) {

    const form = useForm<z.infer<typeof vendorCatalogQuerySchema>>({
        resolver: zodResolver(vendorCatalogQuerySchema),
        defaultValues: {
            vendorCatalogQuery: ''
        }
    })

    const searchData = (data: z.infer<typeof vendorCatalogQuerySchema>) => {
        refreshData(data.vendorCatalogQuery)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(searchData)}>
                    <FormField control={form.control} name="vendorCatalogQuery" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-4">
                            <FormControl>
                                <Input id="vendorCatalogQuery" className="max-w-[160px]" placeholder="Cari vendor..." {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                </form>
            </Form>
        </>
    )
}