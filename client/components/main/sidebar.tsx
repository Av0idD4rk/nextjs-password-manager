import Link from "next/link";
import {JSX, SVGProps} from "react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

export default function MainSidebar() {
    const router = useRouter()
    const onClick = () => {
        window.sessionStorage.setItem("vault","")
        window.sessionStorage.setItem("vk","")
        router.push("/login")
    }
    return (
        <div
            className="hidden border border-gray-200 border-r bg-gray-100/40 lg:block dark:border-gray-800 dark:bg-gray-800/40">
            <div className="flex h-full flex-col gap-2">
                <div className="flex h-[60px] items-center border-b border-gray-200 px-6 dark:border-gray-800">
                    <Link className="flex items-center gap-2 font-semibold" href="#">
                        <LockIcon className="h-6 w-6"/>
                        <span className="">Password Vault</span>
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-4 text-sm font-medium">
                        <Link
                            className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900 transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                            href="#"
                        >
                            <LockIcon className="h-4 w-4"/>
                            Vault
                        </Link>
                    </nav>
                </div>
                <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-800">
                    <Button className="w-full" size="sm" variant="ghost" onClick={onClick}>
                        <LogOutIcon className="h-4 w-4 mr-2"/>
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    )
}

function ListIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="8" x2="21" y1="6" y2="6"/>
            <line x1="8" x2="21" y1="12" y2="12"/>
            <line x1="8" x2="21" y1="18" y2="18"/>
            <line x1="3" x2="3.01" y1="6" y2="6"/>
            <line x1="3" x2="3.01" y1="12" y2="12"/>
            <line x1="3" x2="3.01" y1="18" y2="18"/>
        </svg>
    )
}


function LockIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
    )
}

function LogOutIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    )
}