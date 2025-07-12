import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { ReactNode, useState } from "react"
import { fetchApi, processError } from "@/lib/common"
import { AxiosResponse } from "axios"
import { toast } from "sonner"
import { APIResponse, SubfieldSelectType } from "@/types"
import { MultiSelect } from "@/components/multi-select"
import { Popover, PopoverContent } from "@radix-ui/react-popover"
import { PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

const VendorQuerySchema = z.object({
    title: z.string().min(1, { message: 'Nama/Judul katalog harus diisi' }),
    number: z.string().min(1, { message: 'Nomor katalog harus diisi' }),
    method: z.string().min(1, { message: 'Metode harus diisi' }),
    location: z.string().min(1, { message: 'Lokasi harus diisi' }),
    qualification: z.string().min(1, { message: 'Ada atau tidaknya kualifikasi harus diisi' }),
    value: z.string(),
    description: z.string(),
    registerDateStart: z.date(),
    registerDateEnd: z.date(),
})

type VendorCatalogCreateFormProps = {
    children: ReactNode,
    dialogToggle: React.Dispatch<React.SetStateAction<boolean>>,
    refreshData: () => void
    subfields: SubfieldSelectType[],
    vendorID: number,
}

export default function VendorCatalogCreateForm({ children, dialogToggle, refreshData, subfields, vendorID }: VendorCatalogCreateFormProps) {

    const [ subfieldSelects, setSubfieldSelects ] = useState<string[]>([])
    const multiSelectChange = (data: string[]) => {
        setSubfieldSelects(data)
    }


    const form = useForm<z.infer<typeof VendorQuerySchema>>({
        resolver: zodResolver(VendorQuerySchema),
        defaultValues: {
            title: '',
            number: '',
            method: '',
            location: '',
            qualification: '',
            value: '',
            description: '',
            registerDateStart: undefined,
            registerDateEnd: undefined,
        }
    })

    const sendFormData = (data: z.infer<typeof VendorQuerySchema>) => {

        
        const startDate = new Date(data.registerDateStart.setHours(12, 0, 0, 0))        
        const endDate = new Date(data.registerDateEnd.setHours(12, 0, 0, 0))
        
        const input = {
            vendor_id: vendorID,
            subfields: subfieldSelects,
            title: data.title,
            number: data.number,
            method: data.method,
            location: data.location,
            qualification: data.qualification,
            value: data.value,
            description: data.description,
            register_date_start: startDate.toJSON(),
            register_date_end: endDate.toJSON(),
        }
        
        const axios = fetchApi()
        axios.post(route('api.catalog.create'), input)
            .then((response: AxiosResponse) => {
                const res = response.data as APIResponse
                if (res.status === 'success') {
                    toast.success(`Katalog ${data.title} berhasil dibuat`)
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
                    <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-6">
                            <FormLabel htmlFor="createtitle">Nama/Judul Katalog</FormLabel>
                            <FormControl>
                                <Input id="createtitle" type="text" placeholder="cth. PROYEK PERBAIKAN JALAN KM 20" required {...field} />
                            </FormControl>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="number" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-6">
                            <FormLabel htmlFor="createNumber">Nomor Katalog</FormLabel>
                            <FormControl>
                                <Input id="createNumber" type="text" placeholder="cth. 0001/JLKJWQ/BID/2025" required {...field} />
                            </FormControl>
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="method" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-6">
                            <FormLabel htmlFor="createMethod">Metode</FormLabel>
                            <FormControl>
                                <Input id="createMethod" type="text" placeholder="cth. Pelelangan Dengan Pascakualifikasi" required {...field} />
                            </FormControl>
                            <FormDescription>Metode pengadaan atau pelaksanaan.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="qualification" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-6">
                            <FormLabel htmlFor="createQualification">Kualifikasi</FormLabel>
                            <FormControl>
                                <Input id="createQualification" type="text" placeholder="cth. Semua Jasa Konstruksi" required {...field} />
                            </FormControl>
                            <FormDescription>Kualifikasi persyaratan penyedia barang/jasa.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-6">
                            <FormLabel htmlFor="createLocation">Lokasi</FormLabel>
                            <FormControl>
                                <Input id="createLocation" type="text" required {...field} />
                            </FormControl>
                            <FormDescription>Lokasi pengadaan atau pelaksanaan.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="value" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-6">
                            <FormLabel htmlFor="createvalue">Nilai HPS</FormLabel>
                            <FormControl>
                                <Input id="createvalue" type="number" placeholder="10000000" required {...field} />
                            </FormControl>
                            <FormDescription>Nilai Harga Perkiraan Sendiri (HPS) Katalog.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <div className="mb-8">
                        <FormLabel htmlFor="createSubfields" className="mb-4">Bidang & Sub Bidang</FormLabel>
                        <MultiSelect id="createSubfields" options={subfields} onValueChange={multiSelectChange} placeholder="Pilih Sub Bidang" variant="default" maxCount={0} modalPopover={true}></MultiSelect>
                    </div>

                    <FormField control={form.control} name="registerDateStart" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-6">
                            <FormLabel>Waktu Pendaftaran Dimulai</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            { (field.value) ? (
                                                <span>{field.value.toLocaleDateString('id-ID')}</span>
                                            ) : (
                                                <span>Pilih Tanggal</span>
                                            ) }
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown" />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="registerDateEnd" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-6">
                            <FormLabel>Waktu Selesai Pendaftaran</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                            { (field.value) ? (
                                                <span>{field.value.toLocaleDateString('id-ID')}</span>
                                            ) : (
                                                <span>Pilih Tanggal</span>
                                            ) }
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} captionLayout="dropdown" />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem className="grid gap-3 mb-6">
                            <FormLabel htmlFor="createDescription">Keterangan</FormLabel>
                            <FormControl>
                                <Textarea id="createDescription" rows={4} {...field} />
                            </FormControl>
                            <FormDescription>List keterangan tambahan</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {children}
                </form>
            </Form>
        </>
    )
}