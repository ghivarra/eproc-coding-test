import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchApi, formatNumber, processError } from "@/lib/common"
import { APIResponse, CatalogItem, SubfieldSelectType } from "@/types"
import { AxiosResponse } from "axios"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import VendorCatalogListItem from "./vendor-catalog-list-item"
import VendorCatalogCreate from "./vendor-catalog-create"

export default function VendorCatalogList({ vendorID, subfields }: { vendorID: number, subfields: SubfieldSelectType[] }) {

    type FetchedCatalog = {
        total: number,
        totalFiltered: number,
        data: CatalogItem[]
    }

    // data
    const [ catalogs, setCatalogs ] = useState<CatalogItem[] | undefined>(undefined)
    const [ currentTotal, setCurrentTotal ] = useState(0)
    const [ filteredTotal, setFilteredTotal ] = useState(0)
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ totalPage, setTotalPage ] = useState(1)
    const limitPerPage = 10
    
    // data fetcher
    const fetchCatalogData = useCallback((query?: string, controller?: AbortController) => {

        const offsetValue = limitPerPage * (currentPage - 1)

        const axios = fetchApi()
        axios.get(route('api.catalog.index'), {
            signal: (typeof controller !== 'undefined') ? controller.signal : undefined,
            params: {
                vendor: vendorID,
                query: (typeof query === 'undefined') ? '' : query,
                limit: limitPerPage,
                offset: offsetValue,
            }
        }).then((response: AxiosResponse) => {
            const res = response.data as APIResponse
            if (res.status === 'success') {
                const data = res.data as FetchedCatalog

                // set data
                setCurrentTotal(data.total)
                setFilteredTotal(data.totalFiltered)
                setCatalogs(data.data)

                // set total page
                const value = Math.ceil(data.total / limitPerPage)
                setTotalPage(value)

            } else {
                toast.warning(res.message)
            }
        }).catch((err) => {
            console.error(err)
            if (typeof err.response.data.message !== 'undefined') {
                processError({ err: [] }, err.response.data.message)
            }
        })

    }, [vendorID, limitPerPage, currentPage, setTotalPage])

    // methods
    const formChangePage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value)

        if (value < 1) {
            setCurrentPage(1)
            return
        }

        if (value >= totalPage) {
            setCurrentPage(totalPage)
            return
        }

        setCurrentPage(value)
    }

    const previousPage = () => {
        if (currentPage == 1) {
            setCurrentPage(1)
            return
        }
        setCurrentPage(currentPage => currentPage - 1)
    }

    const nextPage = () => {
        if (currentPage == totalPage) {
            setCurrentPage(totalPage)
            return
        }
        setCurrentPage(currentPage => currentPage + 1)
    }

    const calculateBetween = () => {
        const catLen = (typeof catalogs === 'undefined') ? 0 : catalogs.length
        const end = formatNumber((limitPerPage * (currentPage - 1)) + catLen)
        const start = formatNumber((limitPerPage * (currentPage - 1)) + 1)

        return `Menampilkan ${start} - ${end} dari total ${filteredTotal} katalog`
    }

    // use effect
    useEffect(() => {
        const controller = new AbortController()

        fetchCatalogData('', controller)

        return () => {
            controller.abort()
        }

    }, [fetchCatalogData])

    // render
    return (
        <>
            <div className="mb-4">
                <VendorCatalogCreate vendorID={vendorID} subfields={subfields} refreshData={fetchCatalogData} />
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-secondary">
                        <TableHead></TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Kualifikasi</TableHead>
                        <TableHead className="text-right">Nilai</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {catalogs && catalogs.map(catalog => (
                        <VendorCatalogListItem key={catalog.id} props={catalog} subfields={subfields} refreshData={fetchCatalogData} />
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-secondary">
                        <TableHead></TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Kualifikasi</TableHead>
                        <TableHead className="text-right">Nilai</TableHead>
                    </TableRow>
                </TableFooter>
            </Table>

            <div className="pt-4 text-gray-400">
                {calculateBetween()}
            </div>

            { (filteredTotal !== currentTotal) && (
                <div className="pt-4 text-gray-400">
                    Menyaring {formatNumber(filteredTotal)} item dari total {formatNumber(currentTotal)} katalog
                </div>
            ) }
            

            <div className="flex w-full items-center justify-center pt-6">
                <Button onClick={previousPage} variant="outline" className="rounded-full" disabled={ currentPage <= 1 }>
                    Sebelumnya
                </Button>
                <Input onChange={formChangePage} value={currentPage} id="tableCurrentInput" type="number" className="max-w-[60px] ml-4"></Input>
                <span className="mx-4">/</span>
                <Input value={totalPage} id="tableTotalPage" className="max-w-[60px] mr-4" disabled></Input>
                <Button onClick={nextPage} variant="outline" className="rounded-full" disabled={ currentPage >= totalPage }>
                    Selanjutnya
                </Button>
            </div>
        </>
    )
}