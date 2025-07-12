import { fetchApi, formatNumber, localDate, processError } from "@/lib/common"
import { APIResponse, CatalogItem } from "@/types"
import { AxiosResponse } from "axios"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/icon"
import { ArrowLeft } from "lucide-react"

export default function CatalogDetailContent({ id }: { id: number }) {

    // const
    const [ catalog, setCatalog ] = useState<CatalogItem|undefined>(undefined)

    // fetcher
    const fetchCatalogData = useCallback((controller?: AbortController) => {
        const axios = fetchApi()
        axios.get(route('api.catalog.find'), {
            signal: (typeof controller !== 'undefined') ? controller.signal : undefined,
            params: {
                id: id,
            }
        }).then((response: AxiosResponse) => {
            const res = response.data as APIResponse
            if (res.status === 'success') {
                const data = res.data as CatalogItem
                console.log(data)
                setCatalog(data)
            } else {
                toast.warning(res.message)
            }
        }).catch((err) => {
            console.error(err)
            if (typeof err.response.data.message !== 'undefined') {
                processError({ err: [] }, err.response.data.message)
            }
        })
    }, [id])

    // use effect
    useEffect(() => {

        const controller = new AbortController()

        if ((typeof id !== 'undefined') && catalog === undefined) {
            fetchCatalogData(controller)
        }

        return () => {
            controller.abort()
        }

    }, [id, fetchCatalogData, catalog])

    const goBack = () => {
        history.back()
    }

    // render
    return (
        <main>
            { (typeof catalog === 'undefined') ? (
                <p>Sedang memuat data...</p>
            ) : (
                <>
                    <section className="mb-6">
                        <p className="font-bold mb-2 text-gray-700">{catalog.vendor_name}</p>
                        <h1 className="text-xl tracking-wide font-bold">{catalog.title}</h1>
                        <p className="text-gray-500">{catalog.number}</p>
                    </section>
                    <section className="mb-6">
                        <h2 className="font-bold mb-4 text-gray-700">Detail</h2>
                        <Table className="border-2 ">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="min-w-[100px] whitespace-normal bg-cyan-50">
                                        Nilai HPS
                                    </TableCell>
                                    <TableCell className="border-l-2 w-full whitespace-normal">
                                        {formatNumber(catalog.value)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="min-w-[100px] whitespace-normal bg-cyan-50">
                                        Metode
                                    </TableCell>
                                    <TableCell className="border-l-2 w-full whitespace-normal">
                                        {catalog.method}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="min-w-[100px] whitespace-normal bg-cyan-50">
                                        Kualifikasi
                                    </TableCell>
                                    <TableCell className="border-l-2 w-full whitespace-normal">
                                        {catalog.qualification}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="min-w-[100px] whitespace-normal bg-cyan-50">
                                        Lokasi
                                    </TableCell>
                                    <TableCell className="border-l-2 w-full whitespace-normal">
                                        {catalog.location}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="min-w-[100px] whitespace-normal bg-cyan-50">
                                        Keterangan
                                    </TableCell>
                                    <TableCell className="border-l-2 w-full whitespace-normal">
                                        {catalog.description}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="min-w-[100px] whitespace-normal bg-cyan-50">
                                        Bidang / Subbidang
                                    </TableCell>
                                    <TableCell className="border-l-2 w-full whitespace-normal">
                                        <ul className="list-disc px-6 py-4">
                                            {catalog.subfields_collection && catalog.subfields_collection.map(subfield => (
                                                <li className="mb-2" key={subfield.subfield_id}>Bidang {subfield.field_name}, Sub Bidang {subfield.subfield_name}</li>
                                            ))}
                                        </ul>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>         
                    </section>
                    <section className="mb-10">
                        <h2 className="font-bold mb-4 text-gray-700">Tanggal Pendaftaran</h2>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="min-w-[140px] whitespace-normal bg-cyan-50">
                                        Tanggal Mulai
                                    </TableCell>
                                    <TableCell className="border-l-2 w-full whitespace-normal">
                                        {localDate(catalog.register_date_start)}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="min-w-[140px] whitespace-normal bg-cyan-50">
                                        Tanggal Selesai
                                    </TableCell>
                                    <TableCell className="border-l-2 w-full whitespace-normal">
                                        {localDate(catalog.register_date_end)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </section>
                    <section className="mb-4">
                        <Button onClick={goBack} type="button" variant="default">
                            <Icon iconNode={ArrowLeft} />
                            Kembali
                        </Button>
                    </section>
                </>
            ) }
        </main>
    )
}