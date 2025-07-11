import AuthLayout from "@/layouts/auth-layout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Link, router } from "@inertiajs/react"
import { Head } from "@inertiajs/react"
import axios, { AxiosResponse } from "axios"
import { APIResponse } from "@/types"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { setCookie } from "@/lib/common"
import { checkAccess } from "@/lib/common"

const FormSchema = z.object({
    email: z.email({ message: 'Wajib Diisi' }),
    password: z.string().min(1, { message: 'Wajib Diisi' }),
})

export default function Register() {

    // check access
    checkAccess()
        .then((response: AxiosResponse) => {
            const res = response.data as APIResponse
            if (res.status === 'success') {
                router.visit(route('panel.dashboard'))
            }
        })
        .catch((err) => {
            console.log(err)
            if (typeof err.response.data.message !== 'undefined') {
                toast(err.response.data.message)
            }
        })

    const sendFormData = (data: z.infer<typeof FormSchema>) => {
        
        const form = new FormData()
        form.append('email', data.email)
        form.append('password', data.password)
        
        // register
        axios.post(route('api.login'), form)
            .then((response: AxiosResponse) => {
                const res = response.data as APIResponse
                const data = res.data as { access_token: string }

                // store token in cookie
                setCookie('access_token', data.access_token, 24)
                
                // set response
                if (res.status === 'success') {
                    toast(res.message + '. Anda akan dialihkan dalam beberapa saat')
                    setTimeout(() => {
                        router.visit(route('panel.dashboard'))
                    }, 2000)
                } else {
                    console.warn(res.message, res.data)
                    toast(res.message)
                }
            })
            .catch((err) => {
                console.error(err)
                if (typeof err.response.data.message !== 'undefined') {
                    toast(err.response.data.message)
                }
            })
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    return (
        <AuthLayout title="E-Procurement">
            <Head title="Registrasi" />
            <div className="flex flex-col gap-6">

                <Card>
                    <CardHeader className="text-center mb-4">
                        <CardTitle className="text-xl">Form Registrasi</CardTitle>
                        <CardDescription>
                            Input data sesuai form untuk melanjutkan pendaftaran.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(sendFormData)}>
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem className="grid gap-3 mb-4">
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <FormControl>
                                            <Input id="email" type="email" placeholder="kontak@ghivarra.com" autoComplete="new-password" required {...field} />
                                        </FormControl>
                                        <FormDescription>Wajib Diisi.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem className="grid gap-3 mb-12">
                                        <FormLabel htmlFor="password">Password</FormLabel>
                                        <FormControl>
                                            <Input id="password" type="password" placeholder="********" autoComplete="new-password" required {...field} />
                                        </FormControl>
                                        <FormDescription>Minimal 10 karakter dan wajib mengandung huruf kecil, kapital, angka, dan simbol.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <Button type="submit" className="w-full mb-4">
                                    Masuk
                                </Button>
                                <div>
                                    Belum memiliki akun? <Link href={route('view.register')} className="font-bold text-primary underline">Daftar Di Sini</Link>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

            </div>
        </AuthLayout>
    )
}