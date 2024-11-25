'use client'
import {redirect, useRouter} from "next/navigation";
import {MainPage} from "@/components/component/main-page";
import {useEffect, useState} from "react";

function SetupPage() {
    const [isLoading, setLoading] = useState(true)
    const router = useRouter()
    useEffect(() => {
        const vaultKey = window.sessionStorage.getItem("vk");

        if (!vaultKey) {
            router.push("/login")
        } else {
            setLoading(false)
        }
    }, [router]);
    if (!isLoading) {
        return (
            <MainPage/>
        )
    }
}

export default SetupPage;