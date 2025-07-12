import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { ReactNode } from "react"
import { fetchApi, processError } from "@/lib/common"
import { AxiosResponse } from "axios"
import { toast } from "sonner"
import { APIResponse, VendorItemType } from "@/types"

const VendorQuerySchema = z.object({
    name: z.string().min(1, { message: 'Nama vendor harus diisi' }),
    website: z.url({ message: 'Website tidak valid' }),
    foundedAt: z.string()
})

type VendorUpdateFormProps = {
    children: ReactNode,
    dialogToggle: React.Dispatch<React.SetStateAction<boolean>>,
    refreshData: () => void,
    defaultValue: VendorItemType
}

export default function VendorUpdateForm({ children, dialogToggle, refreshData, defaultValue }: VendorUpdateFormProps) {

    const form = useForm<z.infer<typeof VendorQuerySchema>>({
        resolver: zodResolver(VendorQuerySchema),
        defaultValues: {
            name: defaultValue.name,
            website: defaultValue.website,
            foundedAt: defaultValue.founded_at
        }
    })

    const sendFormData = (data: z.infer<typeof VendorQuerySchema>) => {
        
        const input = {
            id: defaultValue.id.toString(),
            name: data.name,
            website: data.website,
            founded_at: data.foundedAt,
        }
        
        const axios = fetchApi()
        axios.patch(route('api.vendor.update'), input)
            .then((response: AxiosResponse) => {
                const res = response.data as APIResponse
                if (res.status === 'success') {
                    toast.success(`Vendor ${data.name} berhasil diperbaharui`)
                    dialogToggle(false)
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
                            <FormDescription>Nama resmi vendor.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="website" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-4">
                            <FormLabel htmlFor="website">Website</FormLabel>
                            <FormControl>
                                <Input id="website" type="text" placeholder="https://jakpro.co.id" required {...field} />
                            </FormControl>
                            <FormDescription>Website resmi perusahaan.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="foundedAt" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-4">
                            <FormLabel htmlFor="foundedAt">Tahun Didirikan</FormLabel>
                            <FormControl>
                                <Input id="foundedAt" type="number" max="2100" min="1900" placeholder="Tahun Didirikan" required {...field} />
                            </FormControl>
                            <FormDescription>Tahun perusahaan berdiri.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                    {children}
                </form>
            </Form>
        </>
    )
}