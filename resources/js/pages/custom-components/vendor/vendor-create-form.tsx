import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { ReactNode } from "react"

const VendorQuerySchema = z.object({
    name: z.string().min(1, { message: 'Nama vendor harus diisi' }),
    website: z.url({ message: 'Website tidak valid' }),
    foundedAt: z.number()
})

type VendorCreateFormProps = {
    children: ReactNode,
    dialogToggle: React.Dispatch<React.SetStateAction<boolean>>
}

export default function VendorCreateForm({ children, dialogToggle }: VendorCreateFormProps) {

    const form = useForm<z.infer<typeof VendorQuerySchema>>({
        resolver: zodResolver(VendorQuerySchema),
        defaultValues: {
            name: '',
            website: '',
            foundedAt: 2000
        }
    })

    const sendFormData = (data: z.infer<typeof VendorQuerySchema>) => {
        console.log(data)
        dialogToggle(false)
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(sendFormData)}>
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-4">
                            <FormLabel htmlFor="name">Nama Vendor</FormLabel>
                            <FormControl>
                                <Input id="name" type="text" placeholder="PT. Jakarta Propertindo" required {...field} />
                            </FormControl>
                            <FormDescription>Wajib Diisi.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="website" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-4">
                            <FormLabel htmlFor="website">Website</FormLabel>
                            <FormControl>
                                <Input id="website" type="text" placeholder="https://jakpro.co.id" required {...field} />
                            </FormControl>
                            <FormDescription>Wajib Diisi.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="foundedAt" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-4">
                            <FormLabel htmlFor="foundedAt">Tahun Didirikan</FormLabel>
                            <FormControl>
                                <Input id="foundedAt" type="number" placeholder="Tahun Didirikan" required {...field} />
                            </FormControl>
                            <FormDescription>Wajib Diisi.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    {children}
                </form>
            </Form>
        </>
    )
}