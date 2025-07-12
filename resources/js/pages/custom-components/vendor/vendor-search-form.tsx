import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"

const VendorQuerySchema = z.object({
    vendorQuery: z.string()
})

export default function VendorSearch() {

    const form = useForm<z.infer<typeof VendorQuerySchema>>({
        resolver: zodResolver(VendorQuerySchema),
        defaultValues: {
            vendorQuery: ''
        }
    })

    const searchData = (data: z.infer<typeof VendorQuerySchema>) => {
        console.log(data)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(searchData)}>
                    <FormField control={form.control} name="vendorQuery" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-4">
                            <FormControl>
                                <Input id="vendorQuery" className="max-w-[160px]" placeholder="Cari vendor..." {...field} />
                            </FormControl>
                        </FormItem>
                    )} />
                </form>
            </Form>
        </>
    )
}