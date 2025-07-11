import { Link } from "@inertiajs/react"
import logo from "@/assets/eproc-logo.png"
import { Toaster } from "@/components/ui/sonner"

type PropType = {
    children: React.ReactNode,
    title?: string
}

export default function AuthLayout({ children, title }: PropType) {
    return (
        <main>
            <Toaster position="top-center" />
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                        <div className="flex items-center">
                            <img src={logo} className="max-w-[32px] mr-4" alt="logo" />
                            {title}
                        </div>
                    </Link>
                    {children}
                </div>
            </div>
        </main>
    )
}