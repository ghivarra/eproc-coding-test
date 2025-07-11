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

const FormSchema = z.object({
    fullName: z.string().min(1, { message: 'Nama wajib diisi' }),
    email: z.email({ message: 'Email tidak valid' }),
    password: z.string().min(10, { message: 'Minimal 10 karakter' }),
    password_confirmation: z.string().min(10, { message: 'Minimal 10 karakter' })
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak cocok',
    path: ['password_confirmation']
})

export default function Register() {

    const saveData = (data: z.infer<typeof FormSchema>) => {
        
        const form = new FormData()
        form.append('name', data.fullName)
        form.append('email', data.email)
        form.append('password', data.password)
        form.append('password_confirmation', data.password_confirmation)
        
        // register
        axios.post(route('api.register'), form)
            .then((response: AxiosResponse) => {
                const res = response.data as APIResponse

                if (res.status === 'success') {
                    toast(res.message, {
                        onAutoClose: () => router.visit(route('view.login')),
                        onDismiss: () => router.visit(route('view.login'))
                    })
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
            fullName: '',
            email: '',
            password: '',
            password_confirmation: ''
        }
    })    

    return (
        <AuthLayout title="E-Procurement">
            <Head title="Registrasi" />
            <div className="flex flex-col gap-6">

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Form Registrasi</CardTitle>
                        <CardDescription>
                            Input data sesuai form untuk melanjutkan pendaftaran.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(saveData)}>
                                <FormField control={form.control} name="fullName" render={({ field }) => (
                                    <FormItem className="grid gap-3 mb-4">
                                        <FormLabel htmlFor="fullName">Nama Lengkap</FormLabel>
                                        <FormControl>
                                            <Input id="fullName" type="text" placeholder="Ghivarra Senandika" autoComplete="new-password" required {...field} />
                                        </FormControl>
                                        <FormDescription>Wajib Diisi.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
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
                                    <FormItem className="grid gap-3 mb-4">
                                        <FormLabel htmlFor="password">Password</FormLabel>
                                        <FormControl>
                                            <Input id="password" type="password" placeholder="********" autoComplete="new-password" required {...field} />
                                        </FormControl>
                                        <FormDescription>Minimal 10 karakter dan wajib mengandung huruf kecil, kapital, angka, dan simbol.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="password_confirmation" render={({ field }) => (
                                    <FormItem className="grid gap-3 mb-8">
                                        <FormLabel htmlFor="password_confirmation">Konfirmasi Password</FormLabel>
                                        <FormControl>
                                            <Input id="password_confirmation" type="password" placeholder="********" autoComplete="new-password" required {...field} />
                                        </FormControl>
                                        <FormDescription>Input sesuai dengan kolom password.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <Button type="submit" className="w-full mb-4">
                                    Daftar
                                </Button>
                                <div>
                                    Sudah memiliki akun? <Link href={route('view.login')} className="font-bold text-primary underline">Login</Link>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

            </div>
        </AuthLayout>
    )
}