import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { ReactNode } from "react"
import { fetchApi, processError } from "@/lib/common"
import { AxiosResponse } from "axios"
import { toast } from "sonner"
import { APIResponse } from "@/types"

const VendorQuerySchema = z.object({
    name: z.string().min(1, { message: 'Nama vendor harus diisi' }),
    website: z.url({ message: 'Website tidak valid' }),
    foundedAt: z.string()
})

type VendorCreateFormProps = {
    children: ReactNode,
    dialogToggle: React.Dispatch<React.SetStateAction<boolean>>,
    onUpdate: () => void
}

export default function VendorCreateForm({ children, dialogToggle, onUpdate }: VendorCreateFormProps) {

    const form = useForm<z.infer<typeof VendorQuerySchema>>({
        resolver: zodResolver(VendorQuerySchema),
        defaultValues: {
            name: '',
            website: '',
            foundedAt: '2000'
        }
    })

    const sendFormData = (data: z.infer<typeof VendorQuerySchema>) => {
        
        const input = new FormData()
        input.append('name', data.name)
        input.append('website', data.website)
        input.append('founded_at', data.foundedAt)
        
        const axios = fetchApi()
        axios.post(route('api.vendor.create'), input)
            .then((response: AxiosResponse) => {
                const res = response.data as APIResponse
                if (res.status === 'success') {
                    toast.success(`Vendor ${data.name} berhasil dibuat`)
                    dialogToggle(false)
                    onUpdate()
                }
            })
            .catch((err) => {
                console.error(err)
                if (typeof err.response.data.message !== 'undefined') {
                    const errorResponse: {
                        name?: string[],
                        website?: string[],
                        foundedAt?: string[],
                    } = err.response.data.data.errors
                    processError(errorResponse, err.response.data.message)
                }
            })
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